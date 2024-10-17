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

export default function PondScreen() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [ponds, setPonds] = useState<PondData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPond, setSelectedPond] = useState<PondData | null>(null);

  const fetchPonds = async () => {
    const { data, error } = await supabase
      .from('ponds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy dữ liệu ao:', error);
    } else {
      setPonds(data || []);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

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

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {ponds.map(pond => (
          <TouchableOpacity key={pond.id} onPress={() => handlePondPress(pond)}>
            <Card className="w-full mb-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{pond.name}</CardTitle>
                <CardTitle className="text-sm font-medium">
                  Fish count: {pond.fish_count ?? 0}
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
                    value={pond.created_at ? new Date(pond.created_at).toLocaleDateString() : 'N/A'}
                  />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <SpeedDial
        isOpen={isSpeedDialOpen}
        icon={{ name: 'add', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setIsSpeedDialOpen(true)}
        onClose={() => setIsSpeedDialOpen(false)}
        color="#b30400">
        {[
          <SpeedDial.Action
            key="add-pond"
            icon={{ name: 'add', color: '#fff' }}
            title="Thêm ao mới"
            onPress={() => {
              setIsSpeedDialOpen(false);
              setIsBottomSheetOpen(true);
            }}
          />,
        ]}
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
