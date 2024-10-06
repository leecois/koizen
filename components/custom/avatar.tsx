import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { supabase } from '@/config/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/text';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  loading?: boolean;
}

export default function Avatar({ url, size = 150, onUpload, loading = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => setAvatarUrl(fr.result as string);
    } catch (error) {
      console.log('Error downloading image: ', (error as Error).message);
    }
  }

  async function uploadAvatar() {
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
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;
      onUpload(data.path);
    } catch (error) {
      console.error('Error uploading avatar:', (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={uploadAvatar}
        disabled={uploading || loading}
        className={`relative rounded-full overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
        }`}
        style={{ width: size, height: size }}>
        {loading ? (
          <View className="w-full h-full items-center justify-center">
            <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
          </View>
        ) : avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full"
            accessibilityLabel="Avatar"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="person" size={size * 0.6} color={isDarkMode ? '#666' : '#999'} />
          </View>
        )}
      </TouchableOpacity>
      {uploading && (
        <View className="mt-2 flex-row items-center">
          <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Uploading...</Text>
        </View>
      )}
    </View>
  );
}
