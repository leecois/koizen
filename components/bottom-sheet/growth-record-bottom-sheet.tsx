import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Divider, Input } from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type GrowthRecordData = {
  id?: string;
  fish_id: string;
  image_url: string;
  date: string; // Use string to store timestamptz
  size: number;
  weight: number;
  notes: string;
};

type GrowthRecordBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onRecordSaved: () => void;
  fishId: string;
  record?: GrowthRecordData;
};

const GrowthRecordBottomSheet: React.FC<GrowthRecordBottomSheetProps> = ({
  isOpen,
  onClose,
  onRecordSaved,
  fishId,
  record,
}) => {
  const initialRecordData: GrowthRecordData = {
    fish_id: fishId,
    image_url: '',
    date: new Date().toISOString(), // Initialize with current date and time
    size: 0,
    weight: 0,
    notes: '',
  };

  const [recordData, setRecordData] = useState<GrowthRecordData>(record ?? initialRecordData);
  const [uploading, setUploading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (record) {
      setRecordData(record);
    } else {
      setRecordData(initialRecordData);
    }
  }, [record]);

  useEffect(() => {
    setRecordData(prev => ({ ...prev, fish_id: fishId }));
  }, [fishId]);

  const handleInputChange = (key: keyof GrowthRecordData, value: string | number | Date) => {
    setRecordData(prev => ({ ...prev, [key]: value }));
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
      const path = `growth_record_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('koi_images')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('koi_images').getPublicUrl(path);
      setRecordData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!recordData.size || !recordData.weight) {
      Alert.alert('Lỗi xác thực', 'Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const { id, ...dataToSubmit } = recordData;

    let response;
    if (id) {
      response = await supabase.from('growth_records').update(dataToSubmit).eq('id', id);
    } else {
      response = await supabase.from('growth_records').insert({
        ...dataToSubmit,
        fish_id: fishId,
      });
    }

    const { error } = response;

    if (error) {
      console.error('Lỗi lưu hồ sơ tăng trưởng:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu hồ sơ tăng trưởng.');
    } else {
      onRecordSaved();
      onClose();
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    handleInputChange('date', date.toISOString());
    hideDatePicker();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            {record ? 'Cập nhật hồ sơ tăng trưởng' : 'Thêm hồ sơ tăng trưởng'}
          </Text>

          <TouchableOpacity
            onPress={handleImagePick}
            style={{ marginBottom: 16 }}
            disabled={uploading}>
            {recordData.image_url ? (
              <Image
                source={{ uri: recordData.image_url }}
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
                    <FontAwesome5 name="camera" size={40} color="#888" />
                    <Text style={{ marginTop: 8, color: '#888' }}>Nhấn để chọn ảnh</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          <View className="mb-4">
            <Text>Ngày và giờ</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
              onPress={showDatePicker}>
              <Text className="text-lg">{new Date(recordData.date).toLocaleString()}</Text>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={new Date(recordData.date)}
            />
          </View>

          <Divider style={{ marginVertical: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Kích thước (cm)"
                label="Kích thước (cm)"
                value={recordData.size.toString()}
                onChangeText={value => handleInputChange('size', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="ruler-horizontal" size={18} color="#32CD32" />}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Trọng lượng (kg)"
                label="Trọng lượng (kg)"
                value={recordData.weight.toString()}
                onChangeText={value => handleInputChange('weight', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="weight" size={18} color="#32CD32" />}
              />
            </View>
          </View>
          <Input
            placeholder="Ghi chú"
            label="Ghi chú"
            value={recordData.notes}
            onChangeText={value => handleInputChange('notes', value)}
            leftIcon={<FontAwesome5 name="sticky-note" size={18} color="#FF4500" />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button onPress={handleSubmit} disabled={uploading} style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {record ? 'Cập nhật' : 'Thêm'}
              </Text>
            </Button>
            <Button onPress={onClose} variant="outline" style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Hủy</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default GrowthRecordBottomSheet;
