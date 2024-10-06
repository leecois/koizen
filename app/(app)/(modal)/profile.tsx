import React from 'react';
import { ScrollView, TouchableOpacity, View, useColorScheme, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSupabase } from '@/context/supabase-provider';
import { useProfile } from '@/hooks/use-profile';
import Avatar from '@/components/custom/avatar';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

type MenuItemProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ iconName, title, onPress }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
      <View className="flex-row items-center">
        <Ionicons name={iconName} size={24} color={isDarkMode ? '#fff' : '#333'} />
        <Text className={`ml-3 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#999' : '#666'} />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const { profile, loading, updateProfile } = useProfile();
  const { session, signOut } = useSupabase();

  const handleSignOut = () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            Alert.alert('Lỗi', 'Đăng xuất thất bại. Vui lòng thử lại.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView className="px-4">
        <View className="mt-8 items-center">
          <Avatar
            size={150}
            url={profile.avatar_url}
            onUpload={(url: string) => updateProfile({ avatar_url: url })}
            loading={loading}
          />
          <Text className="mt-4 text-2xl font-bold">{profile.full_name}</Text>
          <Text className="mt-1">{session?.user.email}</Text>
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold mb-2">Cài đặt tài khoản</Text>
          <MenuItem
            iconName="settings-outline"
            title="Cập nhật thông tin tài khoản"
            onPress={() => router.push('/(modal)/settings')}
          />
          <MenuItem
            iconName="notifications-outline"
            title="Cài đặt thông báo"
            onPress={() => {
              /* Navigate to Notification Preferences */
            }}
          />
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold mb-2">Hỗ trợ</Text>
          <MenuItem
            iconName="help-circle-outline"
            title="Trung tâm hỗ trợ"
            onPress={() => {
              /* Navigate to Help Center */
            }}
          />
          <MenuItem
            iconName="mail-outline"
            title="Liên hệ với chúng tôi"
            onPress={() => {
              /* Navigate to Contact Us */
            }}
          />
        </View>

        <Button onPress={handleSignOut} className="mt-8 bg-primary">
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-primary-foreground font-semibold ml-2">Đăng xuất</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
