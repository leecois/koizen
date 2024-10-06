import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Divider, Input } from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type FeedingRecordData = {
  id?: string;
  fish_id: string;
  date: string; // Use string to store timestamptz
  amount: number;
  food_type: string;
  notes?: string;
};

type FeedingRecordBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onRecordSaved: () => void;
  fishId: string;
  record?: FeedingRecordData;
};

const FeedingRecordBottomSheet: React.FC<FeedingRecordBottomSheetProps> = ({
  isOpen,
  onClose,
  onRecordSaved,
  fishId,
  record,
}) => {
  const initialRecordData: FeedingRecordData = {
    fish_id: fishId,
    date: new Date().toISOString(), // Initialize with current date and time
    amount: 0,
    food_type: '',
    notes: '',
  };

  const [recordData, setRecordData] = useState<FeedingRecordData>(record ?? initialRecordData);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (record) {
      setRecordData(record);
    } else {
      setRecordData(initialRecordData);
    }
  }, [record]);

  useEffect(() => {
    setRecordData(prev => ({ ...prev, fish_id: fishId }));
  }, [fishId]);

  const handleInputChange = (key: keyof FeedingRecordData, value: string | number | Date) => {
    setRecordData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Kiểm tra các trường cần thiết
    if (!recordData.amount || !recordData.food_type || !fishId) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    const { id, ...dataToSubmit } = recordData;

    let response;
    if (id) {
      response = await supabase.from('feeding_records').update(dataToSubmit).eq('id', id);
    } else {
      response = await supabase.from('feeding_records').insert({
        ...dataToSubmit,
        fish_id: fishId,
      });
    }

    const { error } = response;

    if (error) {
      console.error('Error saving feeding record:', error);
      Alert.alert('Error', 'There was an error saving the feeding record.');
    } else {
      onRecordSaved();
      onClose();
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    handleInputChange('date', date.toISOString());
    hideDatePicker();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            {record ? 'Update Feeding Record' : 'Add Feeding Record'}
          </Text>

          <View className="mb-4">
            <Text>Date and Time</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
              onPress={showDatePicker}>
              <Text className="text-lg">{new Date(recordData.date).toLocaleString()}</Text>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={new Date(recordData.date)}
            />
          </View>

          <Divider style={{ marginVertical: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Amount (g)"
                label="Amount (g)"
                value={recordData.amount.toString()}
                onChangeText={value => handleInputChange('amount', parseFloat(value) || 0)}
                keyboardType="numeric"
                leftIcon={<FontAwesome5 name="weight" size={18} color="#32CD32" />}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                placeholder="Food Type"
                label="Food Type"
                value={recordData.food_type}
                onChangeText={value => handleInputChange('food_type', value)}
                leftIcon={<FontAwesome5 name="utensils" size={18} color="#32CD32" />}
              />
            </View>
          </View>
          <Input
            placeholder="Notes"
            label="Notes"
            value={recordData.notes}
            onChangeText={value => handleInputChange('notes', value)}
            leftIcon={<FontAwesome5 name="sticky-note" size={18} color="#FF4500" />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button onPress={handleSubmit} style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {record ? 'Update' : 'Add'}
              </Text>
            </Button>
            <Button onPress={onClose} variant="outline" style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default FeedingRecordBottomSheet;
