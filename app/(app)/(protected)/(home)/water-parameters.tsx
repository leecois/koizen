import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Divider, Button, SpeedDial } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { H1, Muted } from '@/components/ui/typography';
import { Text } from '@/components/ui/text';
import MeasurementCreation from '@/components/bottom-sheet/measurement-creation-bottom-sheet';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Parameter = {
  name: string;
  value: string;
  icon: IconName;
};

type WaterParameterSet = {
  id: string;
  pondName: string;
  dateTime: string;
  parameters: Parameter[];
  note: string;
};

const mockWaterParameterSets: WaterParameterSet[] = [
  {
    id: '1',
    pondName: 'Lake',
    dateTime: '05.10.2024 - 23:25',
    parameters: [
      { name: 'Nitrite NO2', value: '0 mg/l', icon: 'water-outline' },
      { name: 'Nitrate NO3', value: '20 mg/l', icon: 'flask-outline' },
      { name: 'Phosphate PO4', value: '0.03 mg/l', icon: 'leaf-outline' },
      { name: 'Ammonium NH4', value: '0 mg/l', icon: 'cloud-outline' },
      { name: 'Hardness', value: '12 °DH', icon: 'diamond-outline' },
      { name: 'Salt', value: '0.1%', icon: 'cellular-outline' },
      { name: 'Outdoor Temp', value: '-40°C', icon: 'thermometer-outline' },
      { name: 'Oxygen O2', value: '20 mg/l', icon: 'water-outline' },
      { name: 'Temperature', value: '5°C', icon: 'thermometer-outline' },
      { name: 'pH Value', value: '7', icon: 'analytics-outline' },
      { name: 'KH', value: '4 °DH', icon: 'beaker-outline' },
      { name: 'CO2', value: '12 mg/l', icon: 'cloud-outline' },
      { name: 'Total Chlorines', value: '0.001 mg/l', icon: 'flask-outline' },
      { name: 'Amount Fed', value: '5g', icon: 'fish-outline' },
    ],
    note: 'Water parameters are within normal range.',
  },
  {
    id: '2',
    pondName: 'Lake',
    dateTime: '05.10.2024 - 23:25',
    parameters: [
      { name: 'Nitrite NO2', value: '0 mg/l', icon: 'water-outline' },
      { name: 'Nitrate NO3', value: '20 mg/l', icon: 'flask-outline' },
      { name: 'Phosphate PO4', value: '0.03 mg/l', icon: 'leaf-outline' },
      { name: 'Ammonium NH4', value: '0 mg/l', icon: 'cloud-outline' },
      { name: 'Hardness', value: '12 °DH', icon: 'diamond-outline' },
      { name: 'Salt', value: '0.1%', icon: 'cellular-outline' },
      { name: 'Outdoor Temp', value: '-40°C', icon: 'thermometer-outline' },
      { name: 'Oxygen O2', value: '20 mg/l', icon: 'water-outline' },
      { name: 'Temperature', value: '5°C', icon: 'thermometer-outline' },
      { name: 'pH Value', value: '7', icon: 'analytics-outline' },
      { name: 'KH', value: '4 °DH', icon: 'beaker-outline' },
      { name: 'CO2', value: '12 mg/l', icon: 'cloud-outline' },
      { name: 'Total Chlorines', value: '0.001 mg/l', icon: 'flask-outline' },
      { name: 'Amount Fed', value: '5g', icon: 'fish-outline' },
    ],
    note: 'Water parameters are within normal range.',
  },
];

const ParameterItem = ({ param }: { param: Parameter }) => (
  <View style={styles.parameterItem}>
    <View style={styles.parameterNameContainer}>
      <Ionicons name={param.icon} size={20} color="#007AFF" />
      <Text style={styles.parameterName}>{param.name}</Text>
    </View>
    <Text style={styles.parameterValue}>{param.value}</Text>
  </View>
);

const WaterParameterCard = ({ set }: { set: WaterParameterSet }) => (
  <Card containerStyle={styles.card}>
    <Card.Title>{set.pondName}</Card.Title>
    <Text style={styles.dateTime}>{set.dateTime}</Text>
    <Divider style={styles.divider} />
    <View style={styles.parametersContainer}>
      {set.parameters.map((param, index) => (
        <ParameterItem key={index} param={param} />
      ))}
    </View>
    <Divider style={styles.divider} />
    <Text style={styles.note}>Note: {set.note}</Text>
    <Button
      title="Edit"
      type="outline"
      containerStyle={styles.buttonContainer}
      onPress={() => console.log('Edit button pressed')}
    />
  </Card>
);

export default function WaterParameters() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  return (
    <View className="flex-1">
      <ScrollView style={styles.container}>
        <H1 style={styles.title}>Water Parameters</H1>
        {mockWaterParameterSets.map(set => (
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
            title="Add New Measurement"
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
        onMeasurementCreated={function (): void {
          throw new Error('Function not implemented.');
        }}
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
