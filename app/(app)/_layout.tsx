import { Stack, useNavigation } from 'expo-router';

import { useColorScheme } from '@/lib/useColorScheme';
import { colors } from '@/constants/colors';
import { ThemeToggle } from '@/components/theme-toggle';

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';

export const unstable_settings = {
  initialRouteName: '(root)',
};

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  const CustomBackButton = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="arrow-back" size={24} color="red" />
      <Text style={{ color: 'red', marginLeft: 5 }}>Back</Text>
    </TouchableOpacity>
  );
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(protected)" />
      <Stack.Screen name="welcome" />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Tạo tài khoản',
          headerStyle: {
            backgroundColor:
              colorScheme === 'dark' ? colors.dark.background : colors.light.background,
          },
          headerTintColor:
            colorScheme === 'dark' ? colors.dark.foreground : colors.light.foreground,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Đăng nhập',
          headerStyle: {
            backgroundColor:
              colorScheme === 'dark' ? colors.dark.background : colors.light.background,
          },
          headerTintColor:
            colorScheme === 'dark' ? colors.dark.foreground : colors.light.foreground,
        }}
      />
      <Stack.Screen
        name="(modal)/profile"
        options={{
          headerShown: true,
          headerTitle: 'Tài khoản',
          headerRight: () => <ThemeToggle />,
          headerStyle: {
            backgroundColor:
              colorScheme === 'dark' ? colors.dark.background : colors.light.background,
          },
          headerTintColor:
            colorScheme === 'dark' ? colors.dark.foreground : colors.light.foreground,
        }}
      />
      <Stack.Screen
        name="(modal)/settings"
        options={{
          headerShown: true,
          headerTitle: 'Thông tin tài khoản',
          headerStyle: {
            backgroundColor:
              colorScheme === 'dark' ? colors.dark.background : colors.light.background,
          },
          headerTintColor:
            colorScheme === 'dark' ? colors.dark.foreground : colors.light.foreground,
        }}
      />
      <Stack.Screen
        name="my-koi/[id]"
        options={{
          title: '',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: 'red',
          headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack>
  );
}
