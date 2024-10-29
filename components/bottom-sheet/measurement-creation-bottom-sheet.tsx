import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { supabase } from '@/config/supabase';
import BottomSheet from './bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Muted } from '../ui/typography';
import { Divider, Input, Overlay } from '@rneui/themed';

type WaterParameter = {
  pond_id: string;
  date_time: string;
  nitrite_no2: string;
  nitrate_no3: string;
  phosphate_po4: string;
  ammonium_nh4: string;
  hardness: string;
  salt: string;
  outdoor_temp: string;
  oxygen_o2: string;
  temperature: string;
  ph_value: string;
  kh: string;
  co2: string;
  total_chlorines: string;
  amount_fed: string;
  note: string;
};

type Pond = {
  id: string;
  name: string;
};

type MeasurementCreationProps = {
  isOpen: boolean;
  onClose: () => void;
  onMeasurementCreated: () => void;
};

const optimalRanges = {
  nitrite_no2: { min: 0, max: 0.1 },
  nitrate_no3: { min: 0, max: 20 },
  phosphate_po4: { min: 0, max: 0.035 },
  ammonium_nh4: { min: 0, max: 0.1 },
  hardness: { min: 0, max: 21 },
  salt: { min: 0, max: 0.1 },
  outdoor_temp: { min: -40, max: 40 },
  oxygen_o2: { min: 6.5, max: Infinity },
  temperature: { min: 5, max: 26 },
  ph_value: { min: 6.9, max: 8 },
  kh: { min: 4, max: Infinity },
  co2: { min: 5, max: 35 },
  total_chlorines: { min: 0, max: 0.001 },
};

const MeasurementCreation = ({
  isOpen,
  onClose,
  onMeasurementCreated,
}: MeasurementCreationProps) => {
  const initialWaterData: WaterParameter = {
    pond_id: '',
    date_time: new Date().toISOString(),
    nitrite_no2: '',
    nitrate_no3: '',
    phosphate_po4: '',
    ammonium_nh4: '',
    hardness: '',
    salt: '',
    outdoor_temp: '',
    oxygen_o2: '',
    temperature: '',
    ph_value: '',
    kh: '',
    co2: '',
    total_chlorines: '',
    amount_fed: '',
    note: '',
  };

  const [waterData, setWaterData] = useState<WaterParameter>(initialWaterData);
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState<{ [key: string]: boolean }>({
    nitrite_no2: false,
    nitrate_no3: false,
    phosphate_po4: false,
    ammonium_nh4: false,
    hardness: false,
    salt: false,
    outdoor_temp: false,
    oxygen_o2: false,
    temperature: false,
    ph_value: false,
    kh: false,
    co2: false,
    total_chlorines: false,
    amount_fed: false,
    note: false,
  });

  useEffect(() => {
    fetchPonds();
  }, []);

  const fetchPonds = async () => {
    const { data, error } = await supabase.from('ponds').select('id, name').order('name');
    if (error) {
      console.error('Lỗi khi lấy dữ liệu ao:', error);
    } else {
      setPonds(data || []);
    }
  };

  const handleInputChange = (key: keyof WaterParameter, value: string) => {
    setWaterData(prev => ({ ...prev, [key]: value }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    handleInputChange('date_time', date.toISOString());
    hideDatePicker();
  };

  const handleSubmit = async () => {
    if (!waterData.pond_id) {
      Alert.alert('Lỗi xác thực', 'Vui lòng chọn một ao.');
      return;
    }

    const numericWaterData = Object.entries(waterData).reduce((acc, [key, value]) => {
      if (key !== 'id' && key !== 'pond_id' && key !== 'date_time' && key !== 'note') {
        acc[key] = parseFloat(value) || 0;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const { data, error } = await supabase
      .from('water_parameters')
      .insert(numericWaterData)
      .select();
    if (error) {
      console.error('Lỗi khi tạo thông số nước:', error);
    } else if (data) {
      onMeasurementCreated();
      onClose();
    }
  };

  const resetForm = () => {
    setWaterData(initialWaterData);
  };

  const toggleOverlay = (key: string) => {
    setOverlayVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isValueInRange = (key: keyof typeof optimalRanges, value: string) => {
    const range = optimalRanges[key];
    if (!range) return true; // Nếu không có phạm vi được định nghĩa, coi như hợp lệ
    const numericValue = parseFloat(value);
    return numericValue >= range.min && numericValue <= range.max;
  };

  const renderLabelWithInfo = (label: string, key: string, info: string) => (
    <View className="flex-row items-center mb-2">
      <Text className="mr-2">{label}</Text>
      <Ionicons
        name="information-circle-outline"
        size={20}
        color="#007AFF"
        onPress={() => toggleOverlay(key)}
      />
      <Overlay isVisible={overlayVisible[key]} onBackdropPress={() => toggleOverlay(key)}>
        <Text>{info}</Text>
      </Overlay>
    </View>
  );

  const renderInput = (
    label: string,
    key: keyof WaterParameter,
    placeholder: string,
    info: string,
  ) => {
    const isInRange = isValueInRange(key as keyof typeof optimalRanges, waterData[key]);
    return (
      <View className="w-[48%]">
        {renderLabelWithInfo(label, key, info)}
        <Input
          placeholder={placeholder}
          value={waterData[key]}
          onChangeText={value => handleInputChange(key, value)}
          keyboardType="numeric"
          leftIcon={<Ionicons name="water-outline" size={24} color={isInRange ? 'green' : 'red'} />}
          inputStyle={{
            color: isInRange ? 'green' : 'red',
          }}
        />
      </View>
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4 text-center">Thêm Thông Số Nước Mới</Text>

          <View className="mb-4">
            <Muted>Ao</Muted>
            <Picker
              selectedValue={waterData.pond_id}
              onValueChange={value => handleInputChange('pond_id', value)}>
              <Picker.Item label="Chọn một ao" value="" />
              {ponds.map(pond => (
                <Picker.Item key={pond.id} label={pond.name} value={pond.id} />
              ))}
            </Picker>
          </View>

          <View className="mb-4">
            <Muted>Ngày và Giờ</Muted>
            <TouchableOpacity
              className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
              onPress={showDatePicker}>
              <Text className="text-lg">{new Date(waterData.date_time).toLocaleString()}</Text>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={new Date(waterData.date_time)}
            />
          </View>

          <Divider className="my-4" />
          <View className="flex-row justify-between mb-4">
            {renderInput('Nitrite (NO2)', 'nitrite_no2', 'mg/l', 'Phạm vi tối ưu: 0-0.1 mg/l')}
            {renderInput('Nitrate (NO3)', 'nitrate_no3', 'mg/l', 'Phạm vi tối ưu: 0-20 mg/l')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput(
              'Phosphate (PO4)',
              'phosphate_po4',
              'mg/l',
              'Phạm vi tối ưu: 0-0.035 mg/l',
            )}
            {renderInput('Ammonium (NH4)', 'ammonium_nh4', 'mg/l', 'Phạm vi tối ưu: 0-0.1 mg/l')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput('Độ cứng: (GH)', 'hardness', '°dH', 'Phạm vi tối ưu: 0 - 21 °dH')}
            {renderInput('Muối', 'salt', '%', 'Phạm vi tối ưu: 0-0.1%')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput(
              'Nhiệt độ ngoài trời',
              'outdoor_temp',
              '°C',
              'Phạm vi tối ưu: -40 - 40 °C',
            )}
            {renderInput('Oxy (O2)', 'oxygen_o2', 'mg/l', 'Phạm vi tối ưu: > 6.5 mg/l')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput('Nhiệt độ', 'temperature', '°C', 'Phạm vi tối ưu: 5 - 26 °C')}
            {renderInput('Giá trị pH', 'ph_value', '', 'Phạm vi tối ưu: 6.9 - 8')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput('Độ cứng cacbonat (KH)', 'kh', '°dH', 'Phạm vi tối ưu: >= 4 °dH')}
            {renderInput('CO2', 'co2', 'mg/l', 'Phạm vi tối ưu: 5-35 mg/l')}
          </View>
          <View className="flex-row justify-between mb-4">
            {renderInput(
              'Tổng Clo (mg/l)',
              'total_chlorines',
              'mg/l',
              'Phạm vi tối ưu: 0 - 0.001 mg/l',
            )}
            {renderInput(
              'Lượng thức ăn',
              'amount_fed',
              'g',
              'Theo dõi lượng thức ăn giúp bạn giám sát sức khỏe của cá.',
            )}
          </View>

          {renderLabelWithInfo('Ghi chú', 'note', 'Ghi chú thêm')}
          <Input
            placeholder="Ghi chú"
            value={waterData.note}
            onChangeText={value => handleInputChange('note', value)}
            multiline
            numberOfLines={3}
            leftIcon={<Ionicons name="chatbubble-outline" size={24} color="#007AFF" />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button onPress={handleSubmit} style={{ flex: 1, marginRight: 8 }}>
              <Text className="text-white font-bold">Tạo Thông Số Nước</Text>
            </Button>
            <Button onPress={resetForm} variant="outline" style={{ flex: 1, marginLeft: 8 }}>
              <Text className="font-bold">Đặt lại</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default MeasurementCreation;
