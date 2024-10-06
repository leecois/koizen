import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import PondCreationBottomSheet from '@/components/bottom-sheet/pond-creation-bottom-sheet';
import { SpeedDial } from '@rneui/themed';

// Define the Pond type based on your database schema
type Pond = {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  size: number;
  depth: number;
  volume: number;
  drain_count: number;
  pump_capacity: number;
  created_at: string;
};

const mockPonds: Pond[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Serene Lake',
    image_url: 'https://placehold.co/600x400.png',
    size: 100,
    depth: 2.5,
    volume: 250,
    drain_count: 2,
    pump_capacity: 1000,
    created_at: '2024-03-15T12:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Koi Paradise',
    image_url: 'https://placehold.co/600x400.png',
    size: 150,
    depth: 3,
    volume: 450,
    drain_count: 3,
    pump_capacity: 1500,
    created_at: '2024-03-20T10:00:00Z',
  },
];

export default function PondScreen() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const handlePondCreated = () => {
    // Implement the logic for when a new pond is created
    setIsBottomSheetOpen(false);
    // You might want to refresh the list of ponds here
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        {mockPonds.map(pond => (
          <Card key={pond.id} className="w-full mb-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{pond.name}</CardTitle>
              <CardTitle className="text-sm font-medium">Number of fish: 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Image source={{ uri: pond.image_url }} className="w-full h-48 rounded-md mb-4" />
              <View className="space-y-2">
                <InfoRow icon="resize" label="Size" value={`${pond.size} m²`} />
                <InfoRow icon="arrow-down" label="Depth" value={`${pond.depth} m`} />
                <InfoRow icon="water" label="Volume" value={`${pond.volume} m³`} />
                <InfoRow icon="pulse" label="Drain Count" value={pond.drain_count.toString()} />
                <InfoRow icon="repeat" label="Pump Capacity" value={`${pond.pump_capacity} L/h`} />
                <InfoRow
                  icon="calendar"
                  label="Created At"
                  value={new Date(pond.created_at).toLocaleDateString()}
                />
              </View>
            </CardContent>
          </Card>
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
            title="Add New Pond"
            onPress={() => {
              setIsSpeedDialOpen(false);
              setIsBottomSheetOpen(true);
            }}
          />,
        ]}
      </SpeedDial>
      <PondCreationBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onPondCreated={handlePondCreated}
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
