import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import { Text } from '@/components/ui/text';
import { ParameterAlert } from '@/types/water-parameters';
import { getAlertLevel, getAlertMessageColor } from '@/utils/water-parameters';
import { AlertIcon } from './alert-icon';

interface ParameterAlertItemProps {
  parameter: ParameterAlert;
}

export const ParameterAlertItem: React.FC<ParameterAlertItemProps> = ({ parameter }) => {
  const alertLevel = getAlertLevel(parameter.value, parameter.range.min, parameter.range.max);

  const getAlertMessage = () => {
    if (parameter.value === null) {
      return 'Chưa có dữ liệu';
    }
    if (alertLevel === 'danger') {
      return `Ngoài phạm vi cho phép (${parameter.range.min}-${
        parameter.range.max === Infinity ? '∞' : parameter.range.max
      } ${parameter.unit})`;
    }
    if (alertLevel === 'warning') {
      return 'Ở mức giới hạn cho phép';
    }
    return 'Trong phạm vi tốt';
  };

  return (
    <Card containerStyle={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text style={styles.parameterName}>{parameter.name}</Text>
        <AlertIcon level={alertLevel} />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.value}>
          {parameter.value !== null ? `${parameter.value} ${parameter.unit}` : 'Không có dữ liệu'}
        </Text>
        <Text style={[styles.alertMessage, { color: getAlertMessageColor(alertLevel) }]}>
          {getAlertMessage()}
        </Text>
        <Text style={styles.description}>{parameter.description}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  alertCard: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertContent: {
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
