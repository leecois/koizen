import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/config/supabase';
import { useSupabase } from '@/context/supabase-provider';

import Avatar from '@/components/custom/avatar';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';

const formSchema = z.object({
  full_name: z.string().min(1, { message: 'Full name is required' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
}

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const { session, user } = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      username: '',
    },
  });

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user on the session!');

      const { data, error } = await supabase.from('users').select('*').eq('id', user?.id).single();

      if (error) throw new Error(error.message);

      if (data) {
        setProfile(data);
        form.reset({
          full_name: data.full_name || '',
          username: data.username || '',
        });
      }
    } catch {
      showToast('error', 'Error loading profile');
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { error } = await supabase.from('users').upsert({
        id: session.user.id,
        ...data,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      showToast('success', 'Profile updated successfully');
      await getProfile();
    } catch (error) {
      showToast('error', 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (url: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { error } = await supabase
        .from('users')
        .upsert({ id: session.user.id, avatar_url: url });

      if (error) throw error;
      setProfile(prev => (prev ? { ...prev, avatar_url: url } : null));
      showToast('success', 'Avatar updated successfully');
    } catch (error) {
      showToast('error', 'Error updating avatar');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type,
      text1: type === 'success' ? 'Success' : 'Error',
      text2: message,
      topOffset: insets.top === 0 ? 12 : insets.top,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="red" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Profile Settings' }} />
      <ScrollView className="px-4">
        <View className="mt-8">
          <Form {...form}>
            <View className="w-full gap-6 mb-4">
              <Avatar
                size={150}
                url={profile?.avatar_url ?? null}
                onUpload={updateAvatar}
                loading={loading}
              />
              <View className="items-center">
                <Text className="text-lg font-semibold">{session?.user.email}</Text>
              </View>
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormInput label="Họ và Tên" placeholder="Họ và tên" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormInput
                    label="Tên người dùng"
                    placeholder="Nhập tên người dùng"
                    autoCapitalize="none"
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </View>
          </Form>
          <Button
            className="w-full mt-4"
            onPress={form.handleSubmit(onSubmit)}
            disabled={loading || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold">Cập nhật thông tin</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
