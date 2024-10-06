import { colors } from '@/constants/colors';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export async function setAndroidNavigationBar(themes: 'light' | 'dark') {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync(themes === 'dark' ? 'light' : 'dark');
  await NavigationBar.setBackgroundColorAsync(
    themes === 'dark' ? colors.dark.background : colors.light.background,
  );
}
