import React, { useCallback } from 'react';
import { router } from 'expo-router';
import { Pressable, View, StyleSheet, Platform, useColorScheme } from 'react-native';
import { cn } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';

export function ModalToggle() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handlePress = useCallback(() => {
    router.push('/(modal)/profile');
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Open profile modal"
      accessibilityHint="Opens your profile settings"
      className={cn(
        'web:ring-offset-background web:transition-colors',
        'web:focus-visible:outline-none web:focus-visible:ring-2',
        'web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        'rounded-full overflow-hidden',
      )}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        Platform.OS === 'ios' && styles.iosShadow,
        Platform.OS === 'android' && styles.androidShadow,
      ]}>
      {({ pressed }) => (
        <View
          className={cn(
            'flex-1 aspect-square justify-center items-center bg-background',
            pressed && (isDarkMode ? 'bg-gray-700' : 'bg-gray-200'),
          )}
          style={styles.iconContainer}>
          <Ionicons
            name="person-circle-outline"
            color={isDarkMode ? '#ffffff' : '#000000'}
            size={28}
            style={[styles.icon, pressed && styles.pressedIcon]}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    marginRight: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  androidShadow: {
    elevation: 4,
  },
  iconContainer: {
    borderRadius: 22,
  },
  icon: {
    opacity: 0.9,
  },
  pressedIcon: {
    opacity: 0.7,
  },
});
