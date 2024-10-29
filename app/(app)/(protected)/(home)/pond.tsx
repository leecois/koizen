import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { supabase } from '@/config/supabase';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import PondCreationUpdateBottomSheet, {
  PondData,
} from '@/components/bottom-sheet/pond-creation-update-bottom-sheet';
import { SpeedDial } from '@rneui/themed';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

type SortOption = 'newest' | 'oldest' | 'size' | 'depth';

export default function PondScreen() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [ponds, setPonds] = useState<PondData[]>([]);
  const [filteredPonds, setFilteredPonds] = useState<PondData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPond, setSelectedPond] = useState<PondData | null>(null);

  // Filter states
  const [sortOpen, setSortOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [sizeFilter, setSizeFilter] = useState<string>('');

  const sortOptions: ItemType<SortOption>[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Diện tích (Lớn → Nhỏ)', value: 'size' },
    { label: 'Độ sâu (Sâu → Nông)', value: 'depth' },
  ];

  const sizeOptions: ItemType<string>[] = [
    { label: 'Tất cả', value: '' },
    { label: 'Nhỏ (<50m²)', value: 'small' },
    { label: 'Trung bình (50-100m²)', value: 'medium' },
    { label: 'Lớn (>100m²)', value: 'large' },
  ];

  useEffect(() => {
    fetchPonds();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ponds, sortBy, sizeFilter]);

  const fetchPonds = async () => {
    const { data, error } = await supabase
      .from('ponds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy dữ liệu ao:', error);
    } else {
      setPonds(data || []);
      setFilteredPonds(data || []);
    }
  };

  const applyFilters = () => {
    let filtered = [...ponds];

    // Apply size filter
    if (sizeFilter) {
      filtered = filtered.filter(pond => {
        const size = pond.size || 0;
        switch (sizeFilter) {
          case 'small':
            return size < 50;
          case 'medium':
            return size >= 50 && size <= 100;
          case 'large':
            return size > 100;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'depth':
          return (b.depth || 0) - (a.depth || 0);
        default:
          return 0;
      }
    });

    setFilteredPonds(filtered);
  };

  const resetFilters = () => {
    setSortBy('newest');
    setSizeFilter('');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPonds().then(() => setRefreshing(false));
  }, []);

  const handlePondCreatedOrUpdated = () => {
    setIsBottomSheetOpen(false);
    fetchPonds();
  };

  const handlePondPress = (pond: PondData) => {
    setSelectedPond(pond);
    setIsBottomSheetOpen(true);
  };

  const FilterSection = () => (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sort Dropdown */}
        <View className="mb-4 z-50">
          <Text className="mb-2">Sắp xếp theo</Text>
          <DropDownPicker
            open={sortOpen}
            value={sortBy}
            items={sortOptions}
            setOpen={setSortOpen}
            setValue={setSortBy}
            zIndex={3000}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Size Filter Dropdown */}
        <View className="mb-4 z-40">
          <Text className="mb-2">Kích thước</Text>
          <DropDownPicker
            open={sizeOpen}
            value={sizeFilter}
            items={sizeOptions}
            setOpen={setSizeOpen}
            setValue={setSizeFilter}
            zIndex={2000}
            listMode="MODAL"
          />
        </View>

        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg items-center"
          onPress={resetFilters}>
          <Text>Đặt lại bộ lọc</Text>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isFilterVisible && <FilterSection />}
        <View className="p-4">
          {filteredPonds.map(pond => (
            <TouchableOpacity key={pond.id} onPress={() => handlePondPress(pond)}>
              <Card className="w-full mb-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{pond.name}</CardTitle>
                  <CardTitle className="text-sm font-medium">
                    Số lượng cá: {pond.fish_count ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    source={{ uri: pond.image_url || '' }}
                    className="w-full h-48 rounded-md mb-4"
                  />
                  <View className="space-y-2">
                    <InfoRow icon="resize" label="Kích thước" value={`${pond.size} m²`} />
                    <InfoRow icon="arrow-down" label="Độ sâu" value={`${pond.depth} m`} />
                    <InfoRow icon="water" label="Thể tích" value={`${pond.volume} m³`} />
                    <InfoRow
                      icon="pulse"
                      label="Số lượng cống"
                      value={pond.drain_count?.toString() || '0'}
                    />
                    <InfoRow
                      icon="repeat"
                      label="Công suất bơm"
                      value={`${pond.pump_capacity} L/h`}
                    />
                    <InfoRow
                      icon="calendar"
                      label="Ngày tạo"
                      value={
                        pond.created_at ? new Date(pond.created_at).toLocaleDateString() : 'N/A'
                      }
                    />
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SpeedDial
        isOpen={isSpeedDialOpen}
        icon={{ name: 'add', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setIsSpeedDialOpen(true)}
        onClose={() => setIsSpeedDialOpen(false)}
        color="#b30400">
        <SpeedDial.Action
          icon={{ name: 'add', color: '#fff' }}
          title="Thêm ao mới"
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

      <PondCreationUpdateBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => {
          setIsBottomSheetOpen(false);
          setSelectedPond(null);
        }}
        onPondCreatedOrUpdated={handlePondCreatedOrUpdated}
        pondToUpdate={selectedPond}
      />
    </View>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function InfoRow({ icon, label, value }: { icon: IoniconsName; label: string; value: string }) {
  return (
    <View className="flex-row items-center">
      <Ionicons name={icon} size={16} color="#4B5563" style={{ marginRight: 8, width: 20 }} />
      <Text className="text-gray-600 font-medium">{label}:</Text>
      <Text className="ml-2 font-semibold">{value}</Text>
    </View>
  );
}
