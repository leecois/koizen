import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as Linking from 'expo-linking';
import { Text } from '@/components/ui/text';
import { H1, Muted } from '@/components/ui/typography';
import { supabase } from '@/config/supabase';

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const WelcomeScreen = () => {
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);
  const router = useRouter();
  const termsOfService = async () => {
    const url = 'https://www.dineineasy.com/terms-of-service';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.log('Không thể mở liên kết này. Có vẻ như internet đang ngủ gật!');
    }
  };

  const privacyPolicy = async () => {
    const url = 'https://www.dineineasy.com/privacy-policy';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.log('Ôi không, liên kết này hơi khó tính. Thử lại sau nhé!');
    }
  };
  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-1 items-center justify-center gap-y-4">
        <Image
          source={require('@/assets/images/logo-lg.png')}
          alt="KoiZen Logo"
          className="w-32 h-32 mb-4"
        />
        <H1 className="text-center">Chào mừng đến với DineinEasy</H1>
        <Muted className="text-center">
          Trước khi "quẩy" với dịch vụ của chúng tôi, hãy đăng ký làm thành viên nhé!
        </Muted>
      </View>

      <View className="gap-4">
        <Button className="w-full rounded-xl" size="lg" onPress={() => router.push('/sign-up')}>
          <Text>Tạo tài khoản siêu tốc</Text>
        </Button>
        <Button
          className="w-full rounded-xl"
          size="lg"
          variant="secondary"
          onPress={() => router.push('/sign-in')}>
          <Text>Đăng nhập nhanh như chớp</Text>
        </Button>
        <View className="flex-row items-center gap-3 my-4">
          <View className="flex-1 h-px bg-muted" />
          <Muted>HOẶC CHỌN CÁCH KHÁC</Muted>
          <View className="flex-1 h-px bg-muted" />
        </View>

        <Button className="w-full border border-border gap-3 bg-background flex-row items-center justify-center">
          <Image
            source={require('@/assets/icons/ic_google.png')}
            style={{ width: 20, height: 20 }}
          />
          <Text className="text-foreground">Đăng nhập bằng Google</Text>
        </Button>
        <Muted className="text-center mt-4">
          Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
          <TouchableOpacity onPress={termsOfService}>
            <Text className="underline">Điều Khoản Dịch Vụ</Text>
          </TouchableOpacity>{' '}
          và xác nhận đã đọc{' '}
          <TouchableOpacity onPress={privacyPolicy}>
            <Text className="underline">Chính Sách Bảo Mật</Text>
          </TouchableOpacity>
        </Muted>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
