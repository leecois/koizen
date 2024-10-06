import { Link, Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/lib/useColorScheme';

import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useProfile } from '@/hooks/use-profile';
import { Avatar, AvatarFallback, SupabaseAvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { View } from 'react-native';
import { colors } from '@/constants/colors';

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();
  const { profile, loading } = useProfile();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme === 'dark' ? colors.dark.destructive : colors.light.destructive,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor:
            colorScheme === 'dark' ? colors.dark.background : colors.light.background,
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: 'KoiZen',
          tabBarIcon({ color, size }: { color: string; size: number }) {
            return <Entypo name="home" color={color} size={size} />;
          },
          headerRight: () => (
            <Link href="/(modal)/profile" className="pr-6">
              <Avatar alt="">
                <SupabaseAvatarImage storageUrl={profile.avatar_url} bucket="avatars" />
                <AvatarFallback>
                  <Text>{profile.full_name?.charAt(0) || 'U'}</Text>
                </AvatarFallback>
              </Avatar>
            </Link>
          ),
          headerTitle: () => (
            <View>
              {loading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <Text className="text-2xl font-bold">Xin chào, {profile.full_name}</Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          headerShown: false,
          title: 'Recommendations',
          tabBarIcon({ color, size }) {
            return <Ionicons name="star-outline" color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon({ color, size }) {
            return <Ionicons name="newspaper-outline" color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
}
