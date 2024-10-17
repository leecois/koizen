import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Divider, Button, SpeedDial } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import MeasurementCreation from '@/components/bottom-sheet/measurement-creation-bottom-sheet';
import { supabase } from '@/config/supabase';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Parameter = {
  name: string;
  value: string;
  icon: IconName;
};

type WaterParameterSet = {
  id: string;
  pond_id: string;
  pond_name: string;
  date_time: string;
  nitrite_no2: number;
  nitrate_no3: number;
  phosphate_po4: number;
  ammonium_nh4: number;
  hardness: number;
  salt: number;
  outdoor_temp: number;
  oxygen_o2: number;
  temperature: number;
  ph_value: number;
  kh: number;
  co2: number;
  total_chlorines: number;
  amount_fed: number;
  note: string;
};

const ParameterItem = ({ param }: { param: Parameter }) => (
  <View style={styles.parameterItem}>
    <View style={styles.parameterNameContainer}>
      <Ionicons name={param.icon} size={20} color="#007AFF" />
      <Text style={styles.parameterName}>{param.name}</Text>
    </View>
    <Text style={styles.parameterValue}>{param.value}</Text>
  </View>
);

const WaterParameterCard = ({ set }: { set: WaterParameterSet }) => {
  const parameters: Parameter[] = [
    { name: 'Nitrite NO2', value: `${set.nitrite_no2} mg/l`, icon: 'water-outline' },
    { name: 'Nitrate NO3', value: `${set.nitrate_no3} mg/l`, icon: 'flask-outline' },
    { name: 'Phosphate PO4', value: `${set.phosphate_po4} mg/l`, icon: 'leaf-outline' },
    { name: 'Ammonium NH4', value: `${set.ammonium_nh4} mg/l`, icon: 'cloud-outline' },
    { name: 'Độ cứng', value: `${set.hardness} °DH`, icon: 'diamond-outline' },
    { name: 'Muối', value: `${set.salt}%`, icon: 'cellular-outline' },
    { name: 'Nhiệt độ ngoài trời', value: `${set.outdoor_temp}°C`, icon: 'thermometer-outline' },
    { name: 'Oxy O2', value: `${set.oxygen_o2} mg/l`, icon: 'water-outline' },
    { name: 'Nhiệt độ', value: `${set.temperature}°C`, icon: 'thermometer-outline' },
    { name: 'Giá trị pH', value: `${set.ph_value}`, icon: 'analytics-outline' },
    { name: 'KH', value: `${set.kh} °DH`, icon: 'beaker-outline' },
    { name: 'CO2', value: `${set.co2} mg/l`, icon: 'cloud-outline' },
    { name: 'Tổng Clo', value: `${set.total_chlorines} mg/l`, icon: 'flask-outline' },
    { name: 'Lượng thức ăn', value: `${set.amount_fed}g`, icon: 'fish-outline' },
  ];

  return (
    <Card containerStyle={styles.card}>
      <Card.Title>{set.pond_name}</Card.Title>
      <Text style={styles.dateTime}>{new Date(set.date_time).toLocaleString()}</Text>
      <Divider style={styles.divider} />
      <View style={styles.parametersContainer}>
        {parameters.map((param, index) => (
          <ParameterItem key={index} param={param} />
        ))}
      </View>
      <Divider style={styles.divider} />
      <Text style={styles.note}>Ghi chú: {set.note}</Text>
      <Button
        title="Chỉnh sửa"
        type="outline"
        containerStyle={styles.buttonContainer}
        onPress={() => console.log('Edit button pressed for id:', set.id)}
      />
    </Card>
  );
};

export default function WaterParameters() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [waterParameters, setWaterParameters] = useState<WaterParameterSet[]>([]);

  useEffect(() => {
    fetchWaterParameters();

    const subscription = supabase
      .channel('water_parameters_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'water_parameters' },
        fetchWaterParameters,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWaterParameters = async () => {
    const { data, error } = await supabase
      .from('water_parameters')
      .select(
        `
        *,
        ponds (name)
      `,
      )
      .order('date_time', { ascending: false });

    if (error) {
      console.error('Error fetching water parameters:', error);
    } else if (data) {
      const formattedData = data.map(item => ({
        ...item,
        pond_name: item.ponds.name,
      }));
      setWaterParameters(formattedData);
    }
  };

  const handleMeasurementCreated = () => {
    setIsBottomSheetOpen(false);
    fetchWaterParameters();
  };

  return (
    <View className="flex-1">
      <ScrollView style={styles.container}>
        {waterParameters.map(set => (
          <WaterParameterCard key={set.id} set={set} />
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
            key="add-measurement"
            icon={{ name: 'add', color: '#fff' }}
            title="Thêm Thông Số Mới"
            onPress={() => {
              setIsSpeedDialOpen(false);
              setIsBottomSheetOpen(true);
            }}
          />,
        ]}
      </SpeedDial>
      <MeasurementCreation
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onMeasurementCreated={handleMeasurementCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  dateTime: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  divider: {
    marginVertical: 10,
  },
  parametersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  parameterItem: {
    width: '48%',
    marginBottom: 10,
  },
  parameterNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  parameterName: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  parameterValue: {
    textAlign: 'right',
    fontSize: 14,
  },
  note: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 15,
  },
});
