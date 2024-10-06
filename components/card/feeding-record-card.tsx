import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';

type FeedingRecord = {
  id: string;
  fish_id: string;
  date: string;
  amount: number;
  food_type: string;
  notes: string;
};

type FeedingRecordCardProps = {
  record: FeedingRecord;
  onPress: () => void;
};

const FeedingRecordCard: React.FC<FeedingRecordCardProps> = ({ record, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card containerStyle={styles.card}>
        <View style={styles.row}>
          <View style={styles.content}>
            <Text style={styles.date}>{new Date(record.date).toLocaleString()}</Text>
            <Text style={styles.info}>
              <FontAwesome5 name="utensils" size={12} color="#32CD32" /> {record.food_type}
            </Text>
            <Text style={styles.info}>
              <FontAwesome5 name="weight" size={12} color="#32CD32" /> {record.amount} g
            </Text>
            {record.notes ? <Text style={styles.notes}>{record.notes}</Text> : null}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  info: {
    fontSize: 12,
    marginBottom: 2,
    color: '#555',
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#777',
  },
});

export default FeedingRecordCard;
