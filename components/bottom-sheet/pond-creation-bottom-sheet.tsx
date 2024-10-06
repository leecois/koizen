import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';
import { Divider, Input } from '@rneui/themed';
import { useSupabase } from '@/context/supabase-provider';

type PondData = {
  user_id: string;
  name: string;
  image_url: string;
  size: number;
  depth: number;
  volume: number;
  drain_count: number;
  pump_capacity: number;
  created_at: Date;
};

type PondCreationBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onPondCreated: () => void;
};

const PondCreationBottomSheet = ({
  isOpen,
  onClose,
  onPondCreated,
}: PondCreationBottomSheetProps) => {
  const { user } = useSupabase();

  const initialPondData: PondData = {
    user_id: user?.id || '',
    name: '',
    image_url: '',
    size: 0,
    depth: 0,
    volume: 0,
    drain_count: 0,
    pump_capacity: 0,
    created_at: new Date(),
  };

  const [pondData, setPondData] = useState<PondData>(initialPondData);
  const [uploading, setUploading] = useState(false);

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

    const { data, error } = await supabase.from('ponds').insert(pondData).select();

    if (error) {
      console.error('Error creating pond:', error);
      Alert.alert('Error', 'There was an error creating the pond.');
    } else if (data) {
      onPondCreated();
      onClose();
    }
  };

  const resetForm = () => {
    setPondData(initialPondData);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            Add New Pond
          </Text>

          <TouchableOpacity
            onPress={handleImagePick}
            style={{ marginBottom: 16 }}
            disabled={uploading}>
            {pondData.image_url ? (
              <Image
                source={{ uri: pondData.image_url }}
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
                    <Text style={{ marginTop: 8, color: '#888' }}>Tap to select image</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          <Input
            placeholder="Name"
            label="Name"
            value={pondData.name}
            onChangeText={value => handleInputChange('name', value)}
            leftIcon={<FontAwesome name="files-o" size={24} color="#888" />}
          />

          <Divider style={{ marginVertical: 16 }} />
          <View className="flex-row justify-between mb-4">
            <View className="w-[48%]">
              <Input
                placeholder="Size (m²)"
                label="Size (m²)"
                value={pondData.size.toString()}
                onChangeText={value => handleInputChange('size', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="arrows-h" size={24} color="#888" />}
              />
            </View>
            <View className="w-[48%]">
              <Input
                placeholder="Depth (m)"
                label="Depth (m)"
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
                placeholder="Volume (m³)"
                label="Volume (m³)"
                value={pondData.volume.toString()}
                onChangeText={value => handleInputChange('volume', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="cube" size={24} color="#888" />}
              />
            </View>
            <View className="w-[48%]">
              <Input
                placeholder="Drain Count"
                label="Drain Count"
                value={pondData.drain_count.toString()}
                onChangeText={value => handleInputChange('drain_count', parseInt(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="tint" size={24} color="#888" />}
              />
            </View>
          </View>
          <Input
            placeholder="Pump Capacity (l/h)"
            label="Pump Capacity (l/h)"
            value={pondData.pump_capacity.toString()}
            onChangeText={value => handleInputChange('pump_capacity', parseFloat(value) || 0)}
            keyboardType="numeric"
            leftIcon={<FontAwesome name="tachometer" size={24} color="#888" />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button onPress={handleSubmit} disabled={uploading} style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Pond</Text>
            </Button>
            <Button onPress={resetForm} variant="outline" style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Reset</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default PondCreationBottomSheet;
