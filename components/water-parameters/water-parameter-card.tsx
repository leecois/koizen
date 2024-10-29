import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Divider } from '@rneui/themed';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

import { getAlertLevel, getParameterAlerts, getParameters } from '@/utils/water-parameters';
import { ParameterItem } from './parameter-item';
import { ParameterAlertItem } from './parameter-alert-item';
import { WaterParameters } from '@/types/db';

interface WaterParameterCardProps {
  set: WaterParameters;
  onEdit?: (id: string) => void;
}

export const WaterParameterCard: React.FC<WaterParameterCardProps> = ({ set, onEdit }) => {
  const parameterAlerts = getParameterAlerts(set);
  const parameters = getParameters(set);

  const hasAnyAlert = parameterAlerts.some(
    param => getAlertLevel(param.value, param.range.min, param.range.max) !== 'normal',
  );

  return (
    <Card containerStyle={styles.card}>
      <Card.Title>
        <View style={styles.cardHeader}>
          <Text style={styles.pondName}>{set.pond_name}</Text>
          {hasAnyAlert && (
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={16} color="#FFF" />
              <Text style={styles.alertBadgeText}>Có cảnh báo</Text>
            </View>
          )}
        </View>
      </Card.Title>

      <Text style={styles.dateTime}>{new Date(set.date_time).toLocaleString()}</Text>

      {hasAnyAlert && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Cảnh báo</Text>
          {parameterAlerts
            .filter(
              param => getAlertLevel(param.value, param.range.min, param.range.max) !== 'normal',
            )
            .map((param, index) => (
              <ParameterAlertItem key={index} parameter={param} />
            ))}
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Hiển thị tất cả các thông số */}
      <View style={styles.parametersContainer}>
        {parameters.map((param, index) => (
          <ParameterItem key={index} param={param} />
        ))}
      </View>

      {set.note && (
        <>
          <Divider style={styles.divider} />
          <Text style={styles.note}>Ghi chú: {set.note}</Text>
        </>
      )}

      <Button
        title="Chỉnh sửa"
        type="outline"
        containerStyle={styles.buttonContainer}
        onPress={() => onEdit?.(set.id)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pondName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 12,
  },
  dateTime: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  alertsSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF9800',
  },
  parametersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  divider: {
    marginVertical: 10,
  },
  note: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 15,
  },
});

export default WaterParameterCard;
