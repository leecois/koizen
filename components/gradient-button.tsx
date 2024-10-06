import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './ui/text';
import { cn } from '@/lib/utils';

interface GradientButtonProps {
  containerClass?: string;
  buttonClass?: string;
  textClass?: string;
  value: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function GradientButton({
  containerClass,
  buttonClass,
  textClass,
  value,
  onPress,
  disabled = false,
}: GradientButtonProps) {
  return (
    <LinearGradient
      colors={['#8B0000', '#B22222']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0.1, y: 0.2 }}
      className={cn('rounded-full', disabled ? 'opacity-50' : 'opacity-100', containerClass)}>
      <TouchableOpacity
        className={cn(
          'p-3 px-4',
          disabled ? 'cursor-not-allowed' : 'active:opacity-80',
          buttonClass,
        )}
        onPress={onPress}
        disabled={disabled}>
        <Text
          className={cn(
            'text-white font-bold text-center',
            disabled ? 'text-gray-300' : 'text-white',
            textClass,
          )}>
          {value}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
