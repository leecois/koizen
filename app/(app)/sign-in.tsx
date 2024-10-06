import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Muted } from '@/components/ui/typography';
import { router } from 'expo-router';
import { useSupabase } from '@/context/supabase-provider';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from '@/components/safe-area-view';

const formSchema = z.object({
  email: z.string().email('Ái chà, email này lạ quá! Nhập lại đi bạn ơi.'),
  password: z
    .string()
    .max(64, 'Ôi trời, mật khẩu dài như sông Mê Kông! Tối đa 64 ký tự thôi nhé.')
    .min(1, 'Quên mật khẩu à? Gõ vào đi nào!'),
});

export default function SignIn() {
  const { signInWithPassword } = useSupabase();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await signInWithPassword(data.email, data.password);
    } catch (error: Error | any) {
      console.log('Ối giời ơi, có lỗi này:', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#A93328' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(1000).springify()} className="pt-8 px-6">
            <Text className="text-white text-4xl font-bold mb-2">Chào bạn nhé,</Text>
            <Text className="text-white text-3xl mb-8">Mừng bạn quay lại</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(1000).springify()}
            className="bg-background dark:bg-neutral-800 rounded-t-3xl flex-1 pt-8 px-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <View className="mb-4">
                  <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                    <Ionicons name="mail-outline" size={24} color="#A93328" />
                    <TextInput
                      className="flex-1 ml-3 text-secondary-foreground"
                      placeholder="Email nè"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="gray"
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && (
                    <Text className="text-red-500 mt-1">{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <View className="mb-4">
                  <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                    <MaterialIcons name="lock-outline" size={24} color="#A93328" />
                    <TextInput
                      className="flex-1 ml-3 text-secondary-foreground"
                      placeholder="Mật khẩu bí mật"
                      placeholderTextColor="gray"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                    />
                  </View>
                  {errors.password && (
                    <Text className="text-red-500 mt-1">{errors.password.message}</Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity className="self-end mb-6">
              <Text className="text-secondary-foreground font-medium">Quên mật khẩu rồi hả?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-primary py-4 rounded-lg items-center mb-6"
              onPress={handleSubmit(onSubmit)}>
              <Text className="text-primary-foreground font-bold text-lg">Đăng nhập thôi nào!</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/sign-up')}>
              <Text className="text-center mb-6">
                Chưa phải thành viên à? <Text className="font-bold">Đăng ký ngay đi!</Text>
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-3 my-4">
              <View className="flex-1 h-px bg-muted" />
              <Muted>HOẶC THỬ CÁCH NÀY</Muted>
              <View className="flex-1 h-px bg-muted" />
            </View>

            <Button className="w-full border mt-4 border-[#A93328] bg-transparent flex-row items-center justify-center py-3 rounded-lg">
              <Image source={require('@/assets/icons/ic_google.png')} className="w-5 h-5 mr-3" />
              <Text className="font-medium text-foreground">Đăng nhập bằng Google</Text>
            </Button>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
