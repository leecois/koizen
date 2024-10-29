import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Button, SpeedDial, Card } from '@rneui/themed';
import { Text } from '@/components/ui/text';
import { supabase } from '@/config/supabase';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

import MeasurementCreation from '@/components/bottom-sheet/measurement-creation-bottom-sheet';
import WaterParameterEdit from '@/components/bottom-sheet/measurement-update-bottom-sheet';
import WaterParameterCard from '@/components/water-parameters/water-parameter-card';
import { WaterParameters } from '@/types/db';

type SortOption = 'newest' | 'oldest';

export default function WaterParametersScreen() {
  const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);
  const [isEditBottomSheetOpen, setIsEditBottomSheetOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<string | undefined>();
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [waterParameters, setWaterParameters] = useState<WaterParameters[]>([]);
  const [filteredParameters, setFilteredParameters] = useState<WaterParameters[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter states
  const [sortOpen, setSortOpen] = useState(false);
  const [pondOpen, setPondOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedPond, setSelectedPond] = useState<string>('');
  const [ponds, setPonds] = useState<string[]>([]);

  const sortOptions: ItemType<SortOption>[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  useEffect(() => {
    fetchWaterParameters();
    fetchPonds();

    const subscription = supabase
      .channel('water_parameters_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'water_parameters' }, () => {
        fetchWaterParameters();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [waterParameters, sortBy, selectedPond]);

  const fetchPonds = async () => {
    try {
      const { data } = await supabase.from('ponds').select('name').order('name');

      if (data) {
        const pondNames = data.map(pond => pond.name);
        setPonds(pondNames);
      }
    } catch (error) {
      console.error('Error fetching ponds:', error);
    }
  };

  const fetchWaterParameters = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('water_parameters')
        .select(
          `
          *,
          ponds (name)
        `,
        )
        .order('date_time', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          ...item,
          pond_name: item.ponds.name,
        }));
        setWaterParameters(formattedData);
        setFilteredParameters(formattedData);
      }
    } catch (err) {
      console.error('Error fetching water parameters:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...waterParameters];

    // Apply pond filter
    if (selectedPond) {
      filtered = filtered.filter(param => param.pond_name === selectedPond);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date_time).getTime();
      const dateB = new Date(b.date_time).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredParameters(filtered);
  };

  const resetFilters = () => {
    setSortBy('newest');
    setSelectedPond('');
  };

  const handleEdit = (parameterId: string) => {
    setSelectedParameterId(parameterId);
    setIsEditBottomSheetOpen(true);
  };

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
          zIndex={3000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Pond Dropdown */}
      <View className="mb-4 z-40">
        <Text className="mb-2">Hồ</Text>
        <DropDownPicker
          open={pondOpen}
          value={selectedPond}
          items={[
            { label: 'Tất cả', value: '' },
            ...ponds.map(pond => ({ label: pond, value: pond })),
          ]}
          setOpen={setPondOpen}
          setValue={setSelectedPond}
          zIndex={2000}
          listMode="MODAL"
        />
      </View>

      <Button title="Đặt lại bộ lọc" onPress={resetFilters} type="outline" />
    </Card>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b30400" />
        <Text className="mt-2">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <Button onPress={fetchWaterParameters} title="Thử lại" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {isFilterVisible && <FilterSection />}

        {filteredParameters.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              Chưa có thông số nước nào. Nhấn nút + để thêm mới.
            </Text>
          </View>
        ) : (
          filteredParameters.map(set => (
            <WaterParameterCard key={set.id} set={set} onEdit={() => handleEdit(set.id)} />
          ))
        )}
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
          title="Thêm Thông Số Mới"
          onPress={() => {
            setIsSpeedDialOpen(false);
            setIsCreateBottomSheetOpen(true);
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

      <MeasurementCreation
        isOpen={isCreateBottomSheetOpen}
        onClose={() => setIsCreateBottomSheetOpen(false)}
        onMeasurementCreated={() => {
          setIsCreateBottomSheetOpen(false);
          fetchWaterParameters();
        }}
      />

      <WaterParameterEdit
        isOpen={isEditBottomSheetOpen}
        onClose={() => {
          setIsEditBottomSheetOpen(false);
          setSelectedParameterId(undefined);
        }}
        onParameterUpdated={() => {
          fetchWaterParameters();
        }}
        parameterId={selectedParameterId}
      />
    </View>
  );
}
