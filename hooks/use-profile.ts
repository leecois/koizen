import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';
import { useSupabase } from '../context/supabase-provider';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Profile = Record<string, any>;

export const useProfile = () => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({});
  const { session } = useSupabase();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const getProfile = async () => {
    setLoading(true);
    if (!session?.user) {
      Alert.alert('Error', 'No user on the session!');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw new Error(error.message);
      if (data) setProfile(data);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    setLoading(true);
    if (!session?.user) {
      Alert.alert('Error', 'No user on the session!');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('users').upsert({
        id: session.user.id,
        ...updates,
        updated_at: new Date(),
      });

      if (error) throw new Error(error.message);
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Cập nhật thông tin thành công',
        topOffset: insets.top === 0 ? 12 : insets.top,
      });
      await getProfile();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, updateProfile };
};
