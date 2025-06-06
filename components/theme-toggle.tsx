import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import Feather from '@expo/vector-icons/Feather';

import { useColorScheme } from '@/lib/useColorScheme';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <Pressable
      onPress={() => {
        const newTheme = isDarkColorScheme ? 'light' : 'dark';
        setColorScheme(newTheme);
        setAndroidNavigationBar(newTheme);
        AsyncStorage.setItem('theme', newTheme);
      }}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2">
      {({ pressed }) => (
        <View
          className={cn(
            'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
            pressed && 'opacity-70',
          )}>
          {isDarkColorScheme ? (
            <Feather name="moon" size={24} color="white" />
          ) : (
            <Feather name="sun" size={24} color="black" />
          )}
        </View>
      )}
    </Pressable>
  );
}
