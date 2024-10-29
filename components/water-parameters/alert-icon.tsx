import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AlertLevel } from '@/types/water-parameters';

interface AlertIconProps {
  level: AlertLevel;
}

export const AlertIcon: React.FC<AlertIconProps> = ({ level }) => {
  switch (level) {
    case 'normal':
      return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
    case 'warning':
      return <Ionicons name="warning" size={24} color="#FFC107" />;
    case 'danger':
      return <Ionicons name="alert-circle" size={24} color="#F44336" />;
    case 'null':
      return <Ionicons name="help-circle" size={24} color="#9E9E9E" />;
  }
};
