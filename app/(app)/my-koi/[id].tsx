import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/config/supabase';
import { H1, H2, Muted } from '@/components/ui/typography';
import { Text } from '@/components/ui/text';
import { Card, Button, ListItem, SpeedDial, Image } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import KoiUpdateBottomSheet from '@/components/bottom-sheet/koi-update-bottom-sheet';
import GrowthRecordBottomSheet from '@/components/bottom-sheet/growth-record-bottom-sheet';
import FeedingRecordBottomSheet from '@/components/bottom-sheet/feeding-record-bottom-sheet';
import GrowthRecordCard from '@/components/card/growth-record-card';
import FeedingRecordCard from '@/components/card/feeding-record-card';

type KoiFish = {
  id: string;
  user_id: string;
  pond_id: string | null;
  name: string;
  variety: string;
  physique: string;
  age: number;
  size: number;
  weight: number;
  sex: 'Male' | 'Female' | 'Unknown';
  origin: string;
  breeder: string;
  purchase_price: number;
  purchase_date: Date;
  inpond_since: string;
  image_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

type GrowthRecord = {
  id: string;
  fish_id: string;
  image_url: string;
  date: string;
  size: number;
  weight: number;
  notes: string;
};

type FeedingRecord = {
  id: string;
  fish_id: string;
  date: string;
  food_type: string;
  amount: number;
  notes: string;
};

const KoiDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [koi, setKoi] = useState<KoiFish | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [expandedGrowth, setExpandedGrowth] = useState(false);
  const [expandedFeeding, setExpandedFeeding] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isGrowthRecordBottomSheetOpen, setIsGrowthRecordBottomSheetOpen] = useState(false);
  const [isFeedingRecordBottomSheetOpen, setIsFeedingRecordBottomSheetOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState<KoiFish | null>(null);
  const [selectedGrowthRecord, setSelectedGrowthRecord] = useState<GrowthRecord | null>(null);
  const [selectedFeedingRecord, setSelectedFeedingRecord] = useState<FeedingRecord | null>(null);

  useEffect(() => {
    fetchKoiDetails();
    fetchGrowthRecords();
    fetchFeedingRecords();
  }, [id]);

  const fetchKoiDetails = async () => {
    const { data, error } = await supabase.from('koi_fish').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching koi details:', error);
    } else if (data) {
      setKoi(data);
    }
  };

  const fetchGrowthRecords = async () => {
    const { data, error } = await supabase.from('growth_records').select('*').eq('fish_id', id);

    if (error) {
      console.error('Error fetching growth records:', error);
    } else if (data) {
      const sortedData = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setGrowthRecords(sortedData);
    }
  };

  const fetchFeedingRecords = async () => {
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('fish_id', id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching feeding records:', error);
    } else if (data) {
      setFeedingRecords(data);
    }
  };

  const handleGrowthRecordSaved = () => {
    fetchGrowthRecords();
    setIsGrowthRecordBottomSheetOpen(false);
  };

  const handleFeedingRecordSaved = () => {
    fetchFeedingRecords();
    setIsFeedingRecordBottomSheetOpen(false);
  };

  const handleAddFeedingRecord = async () => {
    setSelectedFeedingRecord(null);
    setIsFeedingRecordBottomSheetOpen(true);
  };

  const handleKoiUpdated = () => {
    fetchKoiDetails();
    setIsBottomSheetOpen(false);
    setIsGrowthRecordBottomSheetOpen(false);
    setIsFeedingRecordBottomSheetOpen(false);
  };

  const handleSelectGrowthRecord = (record: GrowthRecord) => {
    setSelectedGrowthRecord(record);
    setIsGrowthRecordBottomSheetOpen(true);
  };

  const handleSelectFeedingRecord = (record: FeedingRecord) => {
    setSelectedFeedingRecord(record);
    setIsFeedingRecordBottomSheetOpen(true);
  };

  if (!koi)
    return (
      <View className="flex-1 justify-center items-center">
        <Muted>Loading your koi...</Muted>
      </View>
    );

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string | number;
  }) => (
    <View style={styles.infoItem}>
      <FontAwesome5 name={icon} size={16} color="#666" style={styles.icon} />
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <ScrollView style={styles.container}>
        <Image source={{ uri: koi.image_url }} style={styles.image} />
        <View style={styles.content}>
          <H1 style={styles.name}>{koi.name}</H1>
          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Basic Information</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="fish" label="Variety" value={koi.variety} />
              <InfoItem icon="dumbbell" label="Physique" value={koi.physique} />
            </View>
            <View style={styles.infoRow}>
              <InfoItem icon="birthday-cake" label="Age" value={`${koi.age} years`} />
              <InfoItem icon="venus-mars" label="Sex" value={koi.sex} />
            </View>
          </Card>

          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Physical Characteristics</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="ruler-vertical" label="Size" value={`${koi.size} cm`} />
              <InfoItem icon="weight" label="Weight" value={`${koi.weight} kg`} />
            </View>
          </Card>

          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Origin & Purchase</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="map-marker-alt" label="Origin" value={koi.origin} />
              <InfoItem icon="user" label="Breeder" value={koi.breeder} />
            </View>
            <View style={styles.infoRow}>
              <InfoItem
                icon="dollar-sign"
                label="Purchase Price"
                value={`$${koi.purchase_price}`}
              />
              <InfoItem
                icon="calendar-alt"
                label="Purchase Date"
                value={new Date(koi.purchase_date).toLocaleDateString()}
              />
            </View>
            <InfoItem
              icon="water"
              label="In Pond Since"
              value={new Date(koi.inpond_since).toLocaleDateString()}
            />
          </Card>

          {koi.notes && (
            <Card containerStyle={styles.card}>
              <H2 style={styles.sectionTitle}>Notes</H2>
              <Text>{koi.notes}</Text>
            </Card>
          )}

          <ListItem.Accordion
            content={
              <>
                <FontAwesome5 name="chart-line" size={20} />
                <ListItem.Content>
                  <ListItem.Title>Growth Records</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedGrowth}
            onPress={() => setExpandedGrowth(!expandedGrowth)}>
            {growthRecords.map(record => (
              <GrowthRecordCard
                key={record.id}
                record={record}
                onPress={() => handleSelectGrowthRecord(record)}
              />
            ))}
          </ListItem.Accordion>

          <ListItem.Accordion
            content={
              <>
                <FontAwesome5 name="utensils" size={20} />
                <ListItem.Content>
                  <ListItem.Title>Feeding Records</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedFeeding}
            onPress={() => setExpandedFeeding(!expandedFeeding)}>
            {feedingRecords.map(record => (
              <FeedingRecordCard
                key={record.id}
                record={record}
                onPress={() => handleSelectFeedingRecord(record)}
              />
            ))}
          </ListItem.Accordion>

          <Muted style={styles.timestamps}>
            Created: {new Date(koi.created_at).toLocaleString()}
            {'\n'}
            Last Updated: {new Date(koi.updated_at).toLocaleString()}
          </Muted>
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
          key="update-koi"
          icon={{ name: 'edit', color: '#fff' }}
          title="Update Koi"
          onPress={() => {
            setSelectedKoi(koi);
            setIsSpeedDialOpen(false);
            setIsBottomSheetOpen(true);
          }}
        />
        <SpeedDial.Action
          key="add-growth"
          icon={{ name: 'add', color: '#fff' }}
          title="Add Growth Record"
          onPress={() => {
            setSelectedKoi(koi); // Ensure selectedKoi is set
            setSelectedGrowthRecord(null); // Clear selected growth record
            setIsSpeedDialOpen(false);
            setIsGrowthRecordBottomSheetOpen(true);
          }}
        />
        <SpeedDial.Action
          key="add-feeding"
          icon={{ name: 'add', color: '#fff' }}
          title="Add Feeding Record"
          onPress={() => {
            setSelectedKoi(koi);
            setSelectedFeedingRecord(null); // Clear selected feeding record
            setIsSpeedDialOpen(false);
            setIsFeedingRecordBottomSheetOpen(true);
          }}
        />
      </SpeedDial>
      <KoiUpdateBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        koi={selectedKoi}
        onKoiUpdated={handleKoiUpdated}
      />
      <FeedingRecordBottomSheet
        isOpen={isFeedingRecordBottomSheetOpen}
        onClose={() => setIsFeedingRecordBottomSheetOpen(false)}
        onRecordSaved={handleFeedingRecordSaved}
        fishId={selectedKoi?.id ?? ''}
        record={selectedFeedingRecord ?? undefined}
      />
      <GrowthRecordBottomSheet
        isOpen={isGrowthRecordBottomSheetOpen}
        onClose={() => setIsGrowthRecordBottomSheetOpen(false)}
        onRecordSaved={handleGrowthRecordSaved}
        fishId={selectedKoi?.id ?? ''}
        record={selectedGrowthRecord ?? undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flex: 1,
  },
  icon: {
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamps: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  },
});

export default KoiDetailScreen;
