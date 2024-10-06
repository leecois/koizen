import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSupabase } from '@/context/supabase-provider';
import { Muted } from '@/components/ui/typography';
import { Text } from '@/components/ui/text';

const formSchema = z
  .object({
    email: z.string().email('Ối! Email này lạ quá, bạn kiểm tra lại nhé!'),
    password: z
      .string()
      .min(8, 'Ấy chà, mật khẩu ngắn quá! Cho thêm ít nhất 8 ký tự nha.')
      .max(64, 'Ui trời, dài quá! Bớt lại còn 64 ký tự thôi bạn ơi.')
      .regex(/^(?=.*[a-z])/, 'Thiếu chữ thường rồi, thêm vào đi nào!')
      .regex(/^(?=.*[A-Z])/, 'Ố ồ, quên chữ hoa rồi! Thêm một cái nhé.')
      .regex(/^(?=.*[0-9])/, 'Ơ kìa, số đâu? Cho vài con số vào đi.')
      .regex(/^(?=.*[!@#$%^&*])/, 'Chưa đủ "gia vị" đặc biệt, thêm một ký tự đặc biệt nào!'),
    confirmPassword: z.string().min(8, 'Nhắc lại nè, ít nhất 8 ký tự nhé!'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Oops! Hai mật khẩu không giống nhau kìa.',
    path: ['confirmPassword'],
  });

export default function SignUp() {
  const { signUp } = useSupabase();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      router.replace('/sign-in');
    } catch (error: Error | any) {
      console.log('Ối giời ơi, có lỗi này:', error.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#A93328' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(1000).springify()} className="pt-8 px-6">
            <Text className="text-white text-4xl font-bold mb-2">Bùm chíu chíu!</Text>
            <Text className="text-white text-3xl mb-8">Cùng bắt đầu nào.</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(1000).springify()}
            className="bg-background rounded-t-3xl flex-1 pt-8 px-6">
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
                      placeholderTextColor="gray"
                      onChangeText={onChange}
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <View className="mb-4">
                  <View className="flex-row items-center bg-secondary rounded-lg px-4 py-3">
                    <MaterialIcons name="lock-outline" size={24} color="#A93328" />
                    <TextInput
                      className="flex-1 ml-3 text-secondary-foreground"
                      placeholder="Nhập lại mật khẩu cho chắc ăn"
                      placeholderTextColor="gray"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                    />
                  </View>
                  {errors.confirmPassword && (
                    <Text className="text-red-500 mt-1">{errors.confirmPassword.message}</Text>
                  )}
                </View>
              )}
            />
            <TouchableOpacity className="self-end mb-6">
              <Text className="text-secondary-foreground font-medium">Quên mật khẩu rồi hả?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-primary py-4 rounded-lg items-center mb-6"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text className="text-primary-foreground font-bold text-lg">
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký ngay!'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text className="text-center mb-6">
                Đã có tài khoản rồi à? <Text className="font-bold">Đăng nhập luôn</Text>
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
