import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';
import { Divider, Input } from '@rneui/themed';
import { useSupabase } from '@/context/supabase-provider';

const DEFAULT_IMAGE_URL = 'https://picsum.photos/600/400';

export type PondData = {
  id?: string;
  user_id: string;
  name: string;
  image_url: string;
  size: number;
  depth: number;
  volume: number;
  drain_count: number;
  fish_count?: number;
  pump_capacity: number;
  created_at: Date;
};

type PondCreationUpdateBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onPondCreatedOrUpdated: () => void;
  pondToUpdate?: PondData | null;
};

const PondCreationUpdateBottomSheet = ({
  isOpen,
  onClose,
  onPondCreatedOrUpdated,
  pondToUpdate,
}: PondCreationUpdateBottomSheetProps) => {
  const { user } = useSupabase();

  const initialPondData: PondData = {
    user_id: user?.id ?? '',
    name: '',
    image_url: DEFAULT_IMAGE_URL,
    size: 0,
    depth: 0,
    volume: 0,
    drain_count: 0,
    pump_capacity: 0,
    created_at: new Date(),
  };

  const [pondData, setPondData] = useState<PondData>(initialPondData);
  const [uploading, setUploading] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
      setPondData(prevData => ({
        ...prevData,
        user_id: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (pondToUpdate) {
      setPondData({
        ...pondToUpdate,
        created_at: new Date(pondToUpdate.created_at),
      });
    } else if (user) {
      setPondData({
        ...initialPondData,
        user_id: user.id,
      });
    }
  }, [pondToUpdate, isOpen, user]);

  const handleInputChange = (key: keyof PondData, value: string | number | Date) => {
    setPondData(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.');
        return;
      }

      const image = result.assets[0];
      if (!image.uri) throw new Error('No image uri!');

      const arraybuffer = await fetch(image.uri).then(res => res.arrayBuffer());
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `pond_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('pond_images')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('pond_images').getPublicUrl(path);
      setPondData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa ao này không? Hành động này sẽ xóa tất cả thông số và không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: confirmDelete },
      ],
      { cancelable: true },
    );
  };

  const confirmDelete = async () => {
    if (!pondToUpdate?.id) return;

    try {
      setIsDeleting(true);

      // Delete associated water parameters first
      await supabase.from('water_parameters').delete().eq('pond_id', pondToUpdate.id);

      // Delete the pond
      const { error } = await supabase.from('ponds').delete().eq('id', pondToUpdate.id);

      if (error) throw error;

      onPondCreatedOrUpdated();
      onClose();
    } catch (error) {
      console.error('Error deleting pond:', error);
      Alert.alert('Lỗi', 'Không thể xóa ao khi cá vẫn còn trong ao. Vui lòng thử lại sau.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !pondData.name ||
      !pondData.size ||
      !pondData.depth ||
      !pondData.volume ||
      !pondData.drain_count ||
      !pondData.pump_capacity
    ) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    const dataToSubmit = {
      ...pondData,
      user_id: user?.id,
      image_url: pondData.image_url || DEFAULT_IMAGE_URL,
    };

    let result;
    if (pondToUpdate) {
      // Update existing pond
      result = await supabase.from('ponds').update(dataToSubmit).eq('id', pondToUpdate.id).select();
    } else {
      // Create new pond
      result = await supabase.from('ponds').insert(dataToSubmit).select();
    }

    const { data, error } = result;

    if (error) {
      console.error('Error creating/updating pond:', error);
      Alert.alert('Error', 'There was an error creating/updating the pond.');
    } else if (data) {
      onPondCreatedOrUpdated();
      onClose();
    }
  };

  const resetForm = () => {
    setPondData(
      pondToUpdate
        ? { ...pondToUpdate, created_at: new Date(pondToUpdate.created_at) }
        : initialPondData,
    );
  };

  if (!isUserLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            {pondToUpdate ? 'Cập nhật ao' : 'Thêm ao mới'}
          </Text>

          <TouchableOpacity
            onPress={handleImagePick}
            style={{ marginBottom: 16 }}
            disabled={uploading}>
            {pondData.image_url ? (
              <Image
                source={{ uri: pondData.image_url || DEFAULT_IMAGE_URL }}
                style={{ width: '100%', height: 200, borderRadius: 8 }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {uploading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <FontAwesome name="camera" size={40} color="#888" />
                    <Text style={{ marginTop: 8, color: '#888' }}>Chọn ảnh</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          <Input
            placeholder="Tên ao"
            label="Tên"
            value={pondData.name}
            onChangeText={value => handleInputChange('name', value)}
            leftIcon={<FontAwesome name="files-o" size={24} color="#888" />}
          />

          <Divider style={{ marginVertical: 16 }} />
          <View className="flex-row justify-between mb-4">
            <View className="w-[48%]">
              <Input
                placeholder="Diện tích (m²)"
                label="Diện tích (m²)"
                value={pondData.size.toString()}
                onChangeText={value => handleInputChange('size', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="arrows-h" size={24} color="#888" />}
              />
            </View>
            <View className="w-[48%]">
              <Input
                placeholder="Độ sâu (m)"
                label="Độ sâu (m)"
                value={pondData.depth.toString()}
                onChangeText={value => handleInputChange('depth', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="arrows-v" size={24} color="#888" />}
              />
            </View>
          </View>
          <View className="flex-row justify-between mb-4">
            <View className="w-[48%]">
              <Input
                placeholder="Thể tích (m³)"
                label="Thể tích (m³)"
                value={pondData.volume.toString()}
                onChangeText={value => handleInputChange('volume', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="cube" size={24} color="#888" />}
              />
            </View>
            <View className="w-[48%]">
              <Input
                placeholder="Số cống"
                label="Số cống"
                value={pondData.drain_count.toString()}
                onChangeText={value => handleInputChange('drain_count', parseInt(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="tint" size={24} color="#888" />}
              />
            </View>
          </View>
          <Input
            placeholder="Công suất bơm (l/h)"
            label="Công suất bơm (l/h)"
            value={pondData.pump_capacity.toString()}
            onChangeText={value => handleInputChange('pump_capacity', parseFloat(value) || 0)}
            keyboardType="numeric"
            leftIcon={<FontAwesome name="tachometer" size={24} color="#888" />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button
              onPress={handleSubmit}
              disabled={uploading || isDeleting}
              style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {pondToUpdate ? 'Cập nhật' : 'Tạo mới'}
              </Text>
            </Button>
            <Button
              onPress={resetForm}
              variant="outline"
              disabled={isDeleting}
              style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Đặt lại</Text>
            </Button>
          </View>

          {pondToUpdate && (
            <Button onPress={handleDelete} disabled={isDeleting} className="mt-4 bg-red-500">
              <View className="flex-row items-center justify-center">
                <FontAwesome name="trash" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {isDeleting ? 'Đang xóa...' : 'Xóa ao'}
                </Text>
              </View>
            </Button>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default PondCreationUpdateBottomSheet;
