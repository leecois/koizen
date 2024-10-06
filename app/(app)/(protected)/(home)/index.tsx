import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { SpeedDial } from '@rneui/themed';
import { H1, Muted } from '@/components/ui/typography';
import { supabase } from '@/config/supabase';
import KoiCreationBottomSheet from '@/components/bottom-sheet/koi-creation-bottom-sheet';
import RenderKoiItem from '@/components/render-koi-item';

type KoiFish = {
  id: string;
  name: string;
  variety: string;
  weight: number;
  age: number;
  image_url: string;
  sex: string;
  size: number;
};

export default function MyKoiScreen() {
  const [koiList, setKoiList] = useState<KoiFish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  useEffect(() => {
    fetchKoiList();
  }, []);

  const fetchKoiList = async () => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }
    const { data, error } = await supabase
      .from('koi_fish')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching koi list:', error);
    } else {
      setKoiList(data || []);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchKoiList();
  };

  return (
    <View className="flex-1 bg-gray-100">
      {isLoading && !isRefreshing ? (
        <View className="flex-1 justify-center items-center">
          <Muted>Loading your koi...</Muted>
        </View>
      ) : (
        <FlatList
          data={koiList}
          renderItem={RenderKoiItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
      )}
      <SpeedDial
        isOpen={isSpeedDialOpen}
        icon={{ name: 'add', color: '#fff' }}
        openIcon={{ name: 'close', color: '#fff' }}
        onOpen={() => setIsSpeedDialOpen(true)}
        onClose={() => setIsSpeedDialOpen(false)}
        color="#b30400">
        {[
          <SpeedDial.Action
            key="add-koi"
            icon={{ name: 'add', color: '#fff' }}
            title="Add New Koi"
            onPress={() => {
              setIsSpeedDialOpen(false);
              setIsBottomSheetOpen(true);
            }}
          />,
        ]}
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
