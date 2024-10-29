import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1, H2, Muted } from '@/components/ui/typography';
import { Card, ButtonGroup } from '@rneui/themed';
import { useSupabase } from '@/context/supabase-provider';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '@/config/supabase';

// Types giữ nguyên như cũ
interface WaterParameters {
  date_time: string;
  temperature: number;
  ph_value: number;
  oxygen_o2: number;
}

interface GrowthRecord {
  date: string;
  size: number;
  weight: number;
}

interface FeedingRecord {
  date: string;
  amount: number;
  food_type: string;
}

interface Stats {
  totalFish: number;
  averageWeight: number;
  averageSize: number;
  totalFeedings: number;
  averageTemp: number;
  averagePH: number;
}

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';
type WaterMetric = 'temperature' | 'ph_value' | 'oxygen_o2';
type GrowthMetric = 'weight' | 'size';

export default function StatisticsScreen() {
  // States giữ nguyên như cũ
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthRecord[]>([]);
  const [waterData, setWaterData] = useState<WaterParameters[]>([]);
  const [feedingData, setFeedingData] = useState<FeedingRecord[]>([]);

  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [waterMetric, setWaterMetric] = useState<WaterMetric>('temperature');
  const [growthMetric, setGrowthMetric] = useState<GrowthMetric>('weight');
  const [selectedFoodType, setSelectedFoodType] = useState<string>('all');

  const dateRanges: { [key in DateRange]: number } = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365,
    all: 99999,
  };

  // Logic functions giữ nguyên như cũ
  const getDateConstraint = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const fetchStats = async () => {
    try {
      const dateConstraint = getDateConstraint(dateRanges[dateRange]);

      const { data: fishCount } = await supabase
        .from('koi_fish')
        .select('id')
        .eq('status', 'alive');

      const { data: growthStats } = await supabase
        .from('growth_records')
        .select('weight, size, date')
        .gte('date', dateConstraint)
        .order('date', { ascending: false });

      const feedingQuery = supabase
        .from('feeding_records')
        .select('*')
        .gte('date', dateConstraint)
        .order('date', { ascending: false });

      if (selectedFoodType !== 'all') {
        feedingQuery.eq('food_type', selectedFoodType);
      }

      const { data: feedingStats } = await feedingQuery;

      const { data: waterStats } = await supabase
        .from('water_parameters')
        .select('*')
        .gte('date_time', dateConstraint)
        .order('date_time', { ascending: false });

      if (growthStats && feedingStats && waterStats) {
        setStats({
          totalFish: fishCount?.length || 0,
          averageWeight: calculateAverage(growthStats.map(g => g.weight)),
          averageSize: calculateAverage(growthStats.map(g => g.size)),
          totalFeedings: feedingStats.length,
          averageTemp: calculateAverage(waterStats.map(w => w.temperature)),
          averagePH: calculateAverage(waterStats.map(w => w.ph_value)),
        });
        setGrowthData(growthStats);
        setWaterData(waterStats);
        setFeedingData(feedingStats);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const calculateAverage = (numbers: number[]): number => {
    return numbers.length > 0
      ? Number((numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2))
      : 0;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange, selectedFoodType]);

  // Filter components với text tiếng Việt
  const DateRangeFilter = () => (
    <View className="mb-4">
      <Text className="font-bold mb-2">Khoảng Thời Gian</Text>
      <ButtonGroup
        buttons={['7 ngày', '30 ngày', '90 ngày', '1 năm', 'Tất cả']}
        selectedIndex={['7d', '30d', '90d', '1y', 'all'].indexOf(dateRange)}
        onPress={index => setDateRange(['7d', '30d', '90d', '1y', 'all'][index] as DateRange)}
        containerStyle={{ height: 40 }}
      />
    </View>
  );

  const WaterMetricFilter = () => (
    <View className="mb-4">
      <Text className="font-bold mb-2">Thông Số Nước</Text>
      <ButtonGroup
        buttons={['Nhiệt độ', 'Độ pH', 'Oxy']}
        selectedIndex={['temperature', 'ph_value', 'oxygen_o2'].indexOf(waterMetric)}
        onPress={index =>
          setWaterMetric(['temperature', 'ph_value', 'oxygen_o2'][index] as WaterMetric)
        }
        containerStyle={{ height: 40 }}
      />
    </View>
  );

  const GrowthMetricFilter = () => (
    <View className="mb-4">
      <Text className="font-bold mb-2">Chỉ Số Tăng Trưởng</Text>
      <ButtonGroup
        buttons={['Cân nặng', 'Kích thước']}
        selectedIndex={['weight', 'size'].indexOf(growthMetric)}
        onPress={index => setGrowthMetric(['weight', 'size'][index] as GrowthMetric)}
        containerStyle={{ height: 40 }}
      />
    </View>
  );

  return (
    <ScrollView
      className="flex-1"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="p-4">
        {/* Filters Card */}
        <Card containerStyle={{ borderRadius: 10 }}>
          <H2>Bộ Lọc</H2>
          <DateRangeFilter />
          <WaterMetricFilter />
          <GrowthMetricFilter />
        </Card>

        {/* Overview Stats */}
        <Card containerStyle={{ borderRadius: 10, marginTop: 16 }}>
          <H2>Tổng Quan</H2>
          <View className="flex-row flex-wrap justify-between mt-2">
            <View className="w-1/2 mb-4">
              <Text className="font-bold">Tổng Số Cá</Text>
              <Text>{stats?.totalFish ?? 0}</Text>
            </View>
            <View className="w-1/2 mb-4">
              <Text className="font-bold">Cân Nặng TB</Text>
              <Text>{stats?.averageWeight || 0}g</Text>
            </View>
            <View className="w-1/2 mb-4">
              <Text className="font-bold">Kích Thước TB</Text>
              <Text>{stats?.averageSize || 0}cm</Text>
            </View>
            <View className="w-1/2 mb-4">
              <Text className="font-bold">Cho Ăn ({dateRange})</Text>
              <Text>{stats?.totalFeedings || 0} lần</Text>
            </View>
          </View>
        </Card>

        {/* Water Parameters */}
        <Card containerStyle={{ borderRadius: 10, marginTop: 16 }}>
          <H2>Thông Số Nước</H2>
          <View className="mt-2">
            <Text className="font-bold">
              {waterMetric === 'temperature'
                ? 'Nhiệt Độ TB'
                : waterMetric === 'ph_value'
                  ? 'Độ pH TB'
                  : 'Oxy TB'}
            </Text>
            <Text>
              {waterMetric === 'temperature'
                ? `${stats?.averageTemp || 0}°C`
                : waterMetric === 'ph_value'
                  ? stats?.averagePH || 0
                  : `${calculateAverage(waterData.map(w => w.oxygen_o2))} mg/L`}
            </Text>
          </View>
          {waterData.length > 0 && (
            <LineChart
              data={{
                labels: waterData.slice(-7).map(w =>
                  new Date(w.date_time).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                  }),
                ),
                datasets: [
                  {
                    data: waterData.slice(-7).map(w => w[waterMetric]),
                  },
                ],
              }}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{ marginTop: 16 }}
              bezier
            />
          )}
        </Card>

        {/* Growth Chart */}
        <Card containerStyle={{ borderRadius: 10, marginTop: 16 }}>
          <H2>Xu Hướng Tăng Trưởng</H2>
          {growthData.length > 0 && (
            <LineChart
              data={{
                labels: growthData.slice(-7).map(g =>
                  new Date(g.date).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                  }),
                ),
                datasets: [
                  {
                    data: growthData.slice(-7).map(g => g[growthMetric]),
                  },
                ],
              }}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{ marginTop: 16 }}
              bezier
            />
          )}
        </Card>

        {/* Recent Feedings */}
        <Card containerStyle={{ borderRadius: 10, marginTop: 16 }}>
          <H2>Lịch Sử Cho Ăn Gần Đây</H2>
          <View className="mt-2 mb-4">
            <Text className="font-bold mb-2">Loại Thức Ăn</Text>
            <ButtonGroup
              buttons={['Tất cả', 'Viên nén', 'Tươi sống', 'Đông lạnh']}
              selectedIndex={['all', 'pellets', 'live', 'frozen'].indexOf(selectedFoodType)}
              onPress={index => setSelectedFoodType(['all', 'pellets', 'live', 'frozen'][index])}
              containerStyle={{ height: 40 }}
            />
          </View>
          <ScrollView className="mt-2" horizontal>
            {feedingData.slice(0, 5).map((feeding, index) => (
              <View
                key={index}
                className="mr-4 p-2 bg-gray-100 rounded-lg"
                style={{ minWidth: 120 }}>
                <Text className="font-bold">
                  {new Date(feeding.date).toLocaleDateString('vi-VN')}
                </Text>
                <Text>{feeding.amount}g</Text>
                <Text className="text-sm text-gray-600">{feeding.food_type}</Text>
              </View>
            ))}
          </ScrollView>
        </Card>

        <Button className="mt-4 mb-8" onPress={onRefresh} variant="outline">
          <Text>Làm Mới</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
