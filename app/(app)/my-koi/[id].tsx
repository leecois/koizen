import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  status: 'alive' | 'deceased';
};

type Pond = {
  id: string;
  name: string;
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
  const router = useRouter();
  const [koi, setKoi] = useState<KoiFish | null>(null);
  const [pond, setPond] = useState<Pond | null>(null);
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

  useEffect(() => {
    if (koi?.pond_id) {
      fetchPondDetails(koi.pond_id);
    }
  }, [koi]);

  const fetchKoiDetails = async () => {
    const { data, error } = await supabase.from('koi_fish').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching koi details:', error);
    } else if (data) {
      setKoi(data);
    }
  };

  const fetchPondDetails = async (pondId: string) => {
    const { data, error } = await supabase.from('ponds').select('*').eq('id', pondId).single();

    if (error) {
      console.error('Error fetching pond details:', error);
    } else if (data) {
      setPond(data);
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

  const handleDeleteKoi = async () => {
    if (!koi) return;

    const { error } = await supabase.from('koi_fish').delete().eq('id', koi.id);

    if (error) {
      console.error('Lỗi khi xóa cá koi:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa cá koi.');
    } else {
      Alert.alert('Thành công', 'Đã xóa cá koi thành công.');
      router.push('/(app)/(home)');
    }
  };

  const handleUpdateKoiStatus = async (status: 'alive' | 'deceased') => {
    if (!koi) return;

    const { error } = await supabase.from('koi_fish').update({ status }).eq('id', koi.id);

    if (error) {
      console.error(`Lỗi khi cập nhật trạng thái cá koi thành ${status}:`, error);
      Alert.alert('Lỗi', `Có lỗi xảy ra khi cập nhật trạng thái cá koi thành ${status}.`);
    } else {
      fetchKoiDetails();
      Alert.alert('Thành công', `Trạng thái cá koi đã được cập nhật thành ${status}.`);
    }
  };

  if (!koi)
    return (
      <View className="flex-1 justify-center items-center">
        <Muted>Đang tải cá koi của bạn...</Muted>
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
          {pond && <Text style={styles.pondName}>Hồ cá hiện tại: {pond.name}</Text>}
          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Thông tin cơ bản</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="fish" label="Giống" value={koi.variety} />
              <InfoItem icon="dumbbell" label="Thể trạng" value={koi.physique} />
            </View>
            <View style={styles.infoRow}>
              <InfoItem icon="birthday-cake" label="Tuổi" value={`${koi.age} năm`} />
              <InfoItem icon="venus-mars" label="Giới tính" value={koi.sex} />
            </View>
          </Card>

          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Đặt điểm vật lý</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="ruler-vertical" label="Kích thước" value={`${koi.size} cm`} />
              <InfoItem icon="weight" label="Cân nặng" value={`${koi.weight} kg`} />
            </View>
          </Card>

          <Card containerStyle={styles.card}>
            <H2 style={styles.sectionTitle}>Thông tin bổ sung</H2>
            <View style={styles.infoRow}>
              <InfoItem icon="map-marker-alt" label="Nguồn gốc" value={koi.origin} />
              <InfoItem icon="user" label="Người nhân giống" value={koi.breeder} />
            </View>
            <View style={styles.infoRow}>
              <InfoItem icon="dollar-sign" label="Giá mua" value={`$${koi.purchase_price}`} />
              <InfoItem
                icon="calendar-alt"
                label="Ngày mua"
                value={new Date(koi.purchase_date).toLocaleDateString()}
              />
            </View>
            <InfoItem
              icon="water"
              label="Đã ở trong ao từ"
              value={new Date(koi.inpond_since).toLocaleDateString()}
            />
          </Card>

          {koi.notes && (
            <Card containerStyle={styles.card}>
              <H2 style={styles.sectionTitle}>Ghi chú</H2>
              <Text>{koi.notes}</Text>
            </Card>
          )}

          <ListItem.Accordion
            content={
              <>
                <FontAwesome5 name="chart-line" size={20} />
                <ListItem.Content>
                  <ListItem.Title>Hồ sơ tăng trưởng</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedGrowth}
            onPress={() => setExpandedGrowth(!expandedGrowth)}>
            {growthRecords.length === 0 ? (
              <Muted>Không có hồ sơ tăng trưởng nào.</Muted>
            ) : (
              growthRecords.map(record => (
                <GrowthRecordCard
                  key={record.id}
                  record={record}
                  onPress={() => handleSelectGrowthRecord(record)}
                />
              ))
            )}
          </ListItem.Accordion>

          <ListItem.Accordion
            content={
              <>
                <FontAwesome5 name="utensils" size={20} />
                <ListItem.Content>
                  <ListItem.Title>Hồ sơ cho ăn</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={expandedFeeding}
            onPress={() => setExpandedFeeding(!expandedFeeding)}>
            {feedingRecords.length === 0 ? (
              <Muted>Không có hồ sơ cho ăn nào.</Muted>
            ) : (
              feedingRecords.map(record => (
                <FeedingRecordCard
                  key={record.id}
                  record={record}
                  onPress={() => handleSelectFeedingRecord(record)}
                />
              ))
            )}
          </ListItem.Accordion>

          <Muted style={styles.timestamps}>
            Thời gian tạo: {new Date(koi.created_at).toLocaleString()}
            {'\n'}
            Lần cuối cập nhật: {new Date(koi.updated_at).toLocaleString()}
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
        {koi.status === 'alive' ? (
          <SpeedDial.Action
            key="deceased-koi"
            icon={{ name: 'outlet', color: 'red' }}
            title="Đánh dấu là đã chết"
            color="white"
            onPress={() => {
              Alert.alert(
                'Đánh dấu cá koi đã chết',
                'Bạn có chắc chắn muốn đánh dấu cá koi này là đã chết?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Mark as Deceased',
                    style: 'destructive',
                    onPress: () => handleUpdateKoiStatus('deceased'),
                  },
                ],
                { cancelable: true },
              );
              setIsSpeedDialOpen(false);
            }}
          />
        ) : (
          <SpeedDial.Action
            key="revive-koi"
            icon={{ name: 'favorite', color: '#fff' }}
            title="Đánh dấu là sống"
            color="green"
            onPress={() => {
              Alert.alert(
                'Cá Koi Sống Lại',
                'Bạn có chắc chắn muốn đánh dấu cá koi này là sống lại?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Revive',
                    style: 'default',
                    onPress: () => handleUpdateKoiStatus('alive'),
                  },
                ],
                { cancelable: true },
              );
              setIsSpeedDialOpen(false);
            }}
          />
        )}
        <SpeedDial.Action
          key="delete-koi"
          icon={{ name: 'delete', color: '#fff' }}
          title="Xóa cá koi"
          color="#b30400"
          onPress={() => {
            Alert.alert(
              'Xóa cá koi',
              'Bạn có chắc chắn muốn xóa cá koi này? Hành động này không thể hoàn tác.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDeleteKoi },
              ],
              { cancelable: true },
            );
            setIsSpeedDialOpen(false);
          }}
        />
        <SpeedDial.Action
          key="update-koi"
          icon={{ name: 'edit', color: '#fff' }}
          title="Cập nhật cá Koi"
          color="blue"
          onPress={() => {
            setSelectedKoi(koi);
            setIsSpeedDialOpen(false);
            setIsBottomSheetOpen(true);
          }}
        />
        <SpeedDial.Action
          key="add-growth"
          icon={{ name: 'add', color: '#fff' }}
          title="Thêm hồ sơ tăng trưởng"
          onPress={() => {
            setSelectedKoi(koi);
            setSelectedGrowthRecord(null);
            setIsSpeedDialOpen(false);
            setIsGrowthRecordBottomSheetOpen(true);
          }}
        />
        <SpeedDial.Action
          key="add-feeding"
          icon={{ name: 'add', color: '#fff' }}
          title="Thêm hồ sơ cho ăn"
          onPress={() => {
            setSelectedKoi(koi);
            setSelectedFeedingRecord(null);
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
  pondName: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: '#666',
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
