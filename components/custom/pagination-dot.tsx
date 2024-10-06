import React from 'react';
import { View } from 'react-native';

interface PaginationDotProps {
  active: boolean;
}

export const PaginationDot: React.FC<PaginationDotProps> = ({ active }) => (
  <View className={`w-2 h-2 rounded-full mx-1 ${active ? 'bg-blue-500' : 'bg-gray-300'}`} />
);
