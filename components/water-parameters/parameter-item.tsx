import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Parameter } from '@/types/water-parameters';
import { styles } from './styles';

interface ParameterItemProps {
  param: Parameter;
}

export const ParameterItem = ({ param }: ParameterItemProps) => (
  <View style={[styles.parameterItem, param.isAlert && styles.parameterItemAlert]}>
    <View style={styles.parameterNameContainer}>
      <Ionicons
        name={param.icon as keyof typeof Ionicons.glyphMap}
        size={20}
        color={param.isAlert ? '#F44336' : '#007AFF'}
      />
      <Text style={[styles.parameterName, param.isAlert && styles.parameterNameAlert]}>
        {param.name}
      </Text>
    </View>
    <Text style={[styles.parameterValue, param.isAlert && styles.parameterValueAlert]}>
      {param.value}
    </Text>
    {param.isAlert && (
      <Ionicons name="warning" size={16} color="#F44336" style={styles.warningIcon} />
    )}
  </View>
);
