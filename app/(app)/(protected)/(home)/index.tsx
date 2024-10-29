import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { SpeedDial, Card } from '@rneui/themed';
import { H1, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { supabase } from '@/config/supabase';
import KoiCreationBottomSheet from '@/components/bottom-sheet/koi-creation-bottom-sheet';
import RenderKoiItem from '@/components/render-koi-item';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

type KoiFish = {
  id: string;
  name: string;
  variety: string;
  weight: number;
  age: number;
  image_url: string;
  sex: string;
  size: number;
  status: string;
  created_at: string;
};

type SortOption = 'newest' | 'oldest' | 'size' | 'weight' | 'age';
type SexOption = 'Male' | 'Female' | 'Unknown' | '';
type StatusOption = 'alive' | 'deceased';

export default function MyKoiScreen() {
  const [koiList, setKoiList] = useState<KoiFish[]>([]);
  const [filteredKoiList, setFilteredKoiList] = useState<KoiFish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [sexOpen, setSexOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [varietyOpen, setVarietyOpen] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedSex, setSelectedSex] = useState<SexOption>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>('alive');
  const [selectedVariety, setSelectedVariety] = useState<string>('');
  const [varieties, setVarieties] = useState<string[]>([]);

  // Dropdown options
  const sortOptions: ItemType<SortOption>[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Kích thước (Lớn → Nhỏ)', value: 'size' },
    { label: 'Cân nặng (Nặng → Nhẹ)', value: 'weight' },
    { label: 'Tuổi (Già → Trẻ)', value: 'age' },
  ];

  const sexOptions: ItemType<SexOption>[] = [
    { label: 'Tất cả', value: '' },
    { label: 'Đực', value: 'Male' },
    { label: 'Cái', value: 'Female' },
    { label: 'Chưa rõ', value: 'Unknown' },
  ];

  const statusOptions: ItemType<StatusOption>[] = [
    { label: 'Còn sống', value: 'alive' },
    { label: 'Đã mất', value: 'deceased' },
  ];

  useEffect(() => {
    fetchKoiList();
  }, []);

  useEffect(() => {
    if (koiList.length > 0) {
      const uniqueVarieties = Array.from(new Set(koiList.map(koi => koi.variety))).sort();
      setVarieties(uniqueVarieties);
    }
  }, [koiList]);

  useEffect(() => {
    applyFilters();
  }, [koiList, sortBy, selectedSex, selectedStatus, selectedVariety]);

  const fetchKoiList = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('koi_fish')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setKoiList(data || []);
      const defaultFiltered = data?.filter(koi => koi.status === 'alive') || [];
      setFilteredKoiList(defaultFiltered);
    } catch (error) {
      console.error('Error fetching koi list:', error);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...koiList];

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(koi => koi.status === selectedStatus);
    }

    // Filter by sex
    if (selectedSex) {
      filtered = filtered.filter(koi => koi.sex === selectedSex);
    }

    // Filter by variety
    if (selectedVariety) {
      filtered = filtered.filter(koi => koi.variety === selectedVariety);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'size':
          return b.size - a.size;
        case 'weight':
          return b.weight - a.weight;
        case 'age':
          return b.age - a.age;
        default:
          return 0;
      }
    });

    setFilteredKoiList(filtered);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchKoiList();
  };

  const resetFilters = () => {
    setSortBy('newest');
    setSelectedSex('');
    setSelectedStatus('alive');
    setSelectedVariety('');
  };

  const varietyOptions: ItemType<string>[] = [
    { label: 'Tất cả', value: '' },
    ...varieties.map(variety => ({ label: variety, value: variety })),
  ];

  const FilterSection = () => (
    <Card containerStyle={{ borderRadius: 10, margin: 8, zIndex: 1000 }}>
      <Text className="text-lg font-bold mb-4">Bộ lọc</Text>

      {/* Sort Dropdown */}
      <View className="mb-4 z-50">
        <Text className="mb-2">Sắp xếp theo</Text>
        <DropDownPicker
          open={sortOpen}
          value={sortBy}
          items={sortOptions}
          setOpen={setSortOpen}
          setValue={setSortBy}
          zIndex={4000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Sex Dropdown */}
      <View className="mb-4 z-40">
        <Text className="mb-2">Giới tính</Text>
        <DropDownPicker
          open={sexOpen}
          value={selectedSex}
          items={sexOptions}
          setOpen={setSexOpen}
          setValue={setSelectedSex}
          zIndex={3000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Variety Dropdown */}
      <View className="mb-4 z-30">
        <Text className="mb-2">Giống</Text>
        <DropDownPicker
          open={varietyOpen}
          value={selectedVariety}
          items={varietyOptions}
          setOpen={setVarietyOpen}
          setValue={setSelectedVariety}
          zIndex={2000}
          listMode="MODAL"
        />
      </View>

      {/* Status Dropdown */}
      <View className="mb-4 z-20">
        <Text className="mb-2">Trạng thái</Text>
        <DropDownPicker
          open={statusOpen}
          value={selectedStatus}
          items={statusOptions}
          setOpen={setStatusOpen}
          setValue={setSelectedStatus}
          zIndex={1000}
          listMode="SCROLLVIEW"
        />
      </View>

      <Button className="mt-2" variant="outline" onPress={resetFilters}>
        <Text>Đặt lại bộ lọc</Text>
      </Button>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {isLoading && !isRefreshing ? (
        <View className="flex-1 justify-center items-center">
          <Muted>Đang tải cá koi của bạn...</Muted>
        </View>
      ) : (
        <FlatList
          data={filteredKoiList}
          renderItem={RenderKoiItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={isFilterVisible ? FilterSection : null}
        />
      )}
      <SpeedDial
        isOpen={isSpeedDialOpen}
        icon={{ name: 'add', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setIsSpeedDialOpen(true)}
        onClose={() => setIsSpeedDialOpen(false)}
        color="#b30400">
        <SpeedDial.Action
          icon={{ name: 'add', color: '#fff' }}
          title="Thêm Cá Koi Mới"
          onPress={() => {
            setIsSpeedDialOpen(false);
            setIsBottomSheetOpen(true);
          }}
        />
        <SpeedDial.Action
          icon={{ name: 'filter-list', color: '#fff' }}
          title={isFilterVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          onPress={() => {
            setIsFilterVisible(!isFilterVisible);
            setIsSpeedDialOpen(false);
          }}
        />
      </SpeedDial>
      <KoiCreationBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onKoiCreated={() => {
          fetchKoiList();
          setIsBottomSheetOpen(false);
        }}
      />
    </View>
  );
}
