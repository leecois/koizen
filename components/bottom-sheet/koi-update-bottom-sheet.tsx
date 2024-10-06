import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider, Input } from '@rneui/themed';
import { useSupabase } from '@/context/supabase-provider';
import { Muted } from '../ui/typography';

type KoiData = {
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
};

type Pond = {
  id: string;
  name: string;
};

type KoiUpdateBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onKoiUpdated: () => void;
  koi: KoiData | null;
};

const KoiUpdateBottomSheet: React.FC<KoiUpdateBottomSheetProps> = ({
  isOpen,
  onClose,
  onKoiUpdated,
  koi,
}) => {
  const { user } = useSupabase();
  const [ponds, setPonds] = useState<Pond[]>([]);
  const initialKoiData: KoiData = {
    id: '',
    user_id: user?.id ?? '',
    name: '',
    physique: 'Standard',
    age: 0,
    size: 0,
    weight: 0,
    sex: 'Unknown',
    pond_id: null,
    origin: '',
    breeder: '',
    purchase_price: 0,
    purchase_date: new Date(),
    inpond_since: '',
    image_url: 'https://res.cloudinary.com/dxjwvmczn/image/upload/v1728166664/koi.jpg',
    notes: '',
    variety: '',
  };

  const [koiData, setKoiData] = useState<KoiData>(koi ?? initialKoiData);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPonds();
    if (koi) {
      setKoiData(koi);
    }
  }, [koi]);

  const fetchPonds = async () => {
    const { data, error } = await supabase.from('ponds').select('id, name').order('name');
    if (error) {
      console.error('Lỗi khi lấy danh sách ao:', error);
    } else {
      setPonds(data || []);
    }
  };

  const handleInputChange = (key: keyof KoiData, value: string | number | Date | null) => {
    setKoiData(prev => ({ ...prev, [key]: value }));

    // Tính toán trọng lượng dựa trên chiều dài (kích thước)
    if (key === 'size') {
      const weight = (value as number) / 4; // 4 chiều dài = 1 trọng lượng
      setKoiData(prev => ({ ...prev, weight }));
    }
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
        console.log('Người dùng đã hủy chọn ảnh.');
        return;
      }

      const image = result.assets[0];
      if (!image.uri) throw new Error('Không có URI của ảnh!');

      const arraybuffer = await fetch(image.uri).then(res => res.arrayBuffer());
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `koi_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('koi_images')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('koi_images').getPublicUrl(path);
      setKoiData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!koiData.name || !koiData.size || !koiData.weight) {
      Alert.alert('Lỗi xác thực', 'Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const dataToSubmit = { ...koiData, pond_id: koiData.pond_id ?? null };

    const { data, error } = await supabase.from('koi_fish').update(dataToSubmit).eq('id', koi?.id);

    if (error) {
      console.error('Lỗi khi cập nhật koi:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật koi.');
    } else {
      onKoiUpdated(); // Đảm bảo koi đã được cập nhật trước khi đóng BottomSheet
      setTimeout(() => {
        onClose(); // Gọi hàm đóng sau khi cập nhật hoàn tất
      }, 300); // Delay một chút để đảm bảo mọi thứ đã hoàn tất
    }
  };

  const resetForm = () => {
    setKoiData(koi ?? initialKoiData);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            Cập nhật Koi
          </Text>

          <TouchableOpacity
            onPress={handleImagePick}
            style={{ marginBottom: 16 }}
            disabled={uploading}>
            {koiData.image_url ? (
              <Image
                source={{ uri: koiData.image_url }}
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

          <Input
            placeholder="Tên"
            label="Tên"
            value={koiData.name}
            onChangeText={value => handleInputChange('name', value)}
            leftIcon={<FontAwesome5 name="file-alt" size={18} color="#1E90FF" />}
          />

          <Divider style={{ marginVertical: 16 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Text>Thể trạng</Text>
              <Picker
                selectedValue={koiData.physique}
                onValueChange={value => handleInputChange('physique', value)}>
                <Picker.Item label="Tiêu chuẩn" value="Standard" />
                <Picker.Item label="Nặng" value="Heavy" />
                <Picker.Item label="Gầy" value="Slim" />
              </Picker>
            </View>
            <View style={{ width: '48%' }}>
              <Text>Tuổi</Text>
              <Picker
                selectedValue={koiData.age}
                onValueChange={value => handleInputChange('age', value)}>
                {[...Array(51)].map((_, index) => (
                  <Picker.Item key={index} label={`${index} năm`} value={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Text>Giới tính</Text>
              <Picker
                selectedValue={koiData.sex}
                onValueChange={value => handleInputChange('sex', value)}>
                <Picker.Item label="Không rõ" value="Unknown" />
                <Picker.Item label="Đực" value="Male" />
                <Picker.Item label="Cái" value="Female" />
              </Picker>
            </View>

            <View style={{ width: '48%' }}>
              <Text>Ao</Text>
              <Picker
                selectedValue={koiData.pond_id}
                onValueChange={value => handleInputChange('pond_id', value)}>
                <Picker.Item label="Không rõ" value={null} />
                {ponds.map(pond => (
                  <Picker.Item key={pond.id} label={pond.name} value={pond.id} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Kích thước (cm)"
                label="Chiều dài (cm)"
                value={koiData.size.toString()}
                onChangeText={value => handleInputChange('size', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="ruler-horizontal" size={18} color="#32CD32" />}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Trọng lượng (kg)"
                label="Trọng lượng (kg)"
                value={koiData.weight.toString()}
                onChangeText={value => handleInputChange('weight', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="weight" size={18} color="#32CD32" />}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Người nuôi"
                label="Người nuôi"
                value={koiData.breeder}
                onChangeText={value => handleInputChange('breeder', value)}
                leftIcon={<FontAwesome5 name="user" size={18} color="#FF4500" />}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Giá mua"
                label="Giá mua"
                value={koiData.purchase_price.toString()}
                onChangeText={value => handleInputChange('purchase_price', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="dollar-sign" size={18} color="#FFD700" />}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Loại"
                label="Loại"
                value={koiData.variety}
                onChangeText={value => handleInputChange('variety', value)}
                leftIcon={<FontAwesome5 name="fish" size={18} color="#1E90FF" />}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Nguồn gốc"
                label="Nguồn gốc"
                value={koiData.origin}
                onChangeText={value => handleInputChange('origin', value)}
                leftIcon={<FontAwesome5 name="map-marker-alt" size={18} color="#FF4500" />}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button onPress={handleSubmit} disabled={uploading} style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Cập nhật Koi</Text>
            </Button>
            <Button onPress={resetForm} variant="outline" style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Đặt lại</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default KoiUpdateBottomSheet;
