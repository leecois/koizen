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
  id: string;
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

type WaterParameterEditProps = {
  isOpen: boolean;
  onClose: () => void;
  onParameterUpdated: () => void;
  parameterId?: string;
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

const WaterParameterEdit = ({
  isOpen,
  onClose,
  onParameterUpdated,
  parameterId,
}: WaterParameterEditProps) => {
  const initialWaterData: WaterParameter = {
    id: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPonds();
    if (parameterId) {
      fetchWaterParameter();
    }
  }, [parameterId]);

  const fetchPonds = async () => {
    const { data, error } = await supabase.from('ponds').select('id, name').order('name');
    if (error) {
      console.error('Lỗi khi lấy dữ liệu ao:', error);
    } else {
      setPonds(data || []);
    }
  };

  const fetchWaterParameter = async () => {
    if (!parameterId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('water_parameters')
        .select('*')
        .eq('id', parameterId)
        .single();

      if (error) throw error;
      if (data) {
        // Convert numeric values to strings for form inputs
        const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
          acc[key as keyof WaterParameter] = value?.toString() ?? '';
          return acc;
        }, {} as WaterParameter);

        setWaterData(formattedData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông số nước:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông số nước');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: keyof WaterParameter, value: string) => {
    setWaterData(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirm = (date: Date) => {
    handleInputChange('date_time', date.toISOString());
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (!waterData.pond_id) {
      Alert.alert('Lỗi xác thực', 'Vui lòng chọn một ao.');
      return;
    }

    try {
      const numericWaterData = Object.entries(waterData).reduce((acc, [key, value]) => {
        if (key !== 'id' && key !== 'pond_id' && key !== 'date_time' && key !== 'note') {
          acc[key] = parseFloat(value) || 0;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('water_parameters')
        .update(numericWaterData)
        .eq('id', parameterId);

      if (error) throw error;

      Alert.alert('Thành công', 'Đã cập nhật thông số nước');
      onParameterUpdated();
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông số nước:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông số nước');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa thông số nước này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('water_parameters')
              .delete()
              .eq('id', parameterId);

            if (error) throw error;

            Alert.alert('Thành công', 'Đã xóa thông số nước');
            onParameterUpdated();
            onClose();
          } catch (error) {
            console.error('Lỗi khi xóa thông số nước:', error);
            Alert.alert('Lỗi', 'Không thể xóa thông số nước');
          }
        },
      },
    ]);
  };

  const renderInput = (
    label: string,
    key: keyof WaterParameter,
    placeholder: string,
    info: string,
  ) => {
    const isInRange = isValueInRange(key as keyof typeof optimalRanges, waterData[key]);
    return (
      <View className="w-[48%]">
        <View className="flex-row items-center mb-2">
          <Text className="mr-2">{label}</Text>
          <TouchableOpacity onPress={() => setOverlayVisible(prev => ({ ...prev, [key]: true }))}>
            <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
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
        <Overlay
          isVisible={!!overlayVisible[key]}
          onBackdropPress={() => setOverlayVisible(prev => ({ ...prev, [key]: false }))}>
          <Text>{info}</Text>
        </Overlay>
      </View>
    );
  };

  const isValueInRange = (key: keyof typeof optimalRanges, value: string) => {
    const range = optimalRanges[key];
    if (!range) return true;
    const numericValue = parseFloat(value);
    return numericValue >= range.min && numericValue <= range.max;
  };

  if (isLoading) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <View className="p-4 items-center justify-center">
          <Text>Đang tải...</Text>
        </View>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4 text-center">Chỉnh Sửa Thông Số Nước</Text>

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
            onPress={() => setDatePickerVisibility(true)}>
            <Text>{new Date(waterData.date_time).toLocaleString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          date={new Date(waterData.date_time)}
        />

        <Divider className="my-4" />

        {/* Render all parameter inputs */}
        <View className="flex-row flex-wrap justify-between">
          {renderInput('Nitrite NO2', 'nitrite_no2', 'mg/l', 'Phạm vi tối ưu: 0-0.1 mg/l')}
          {renderInput('Nitrate NO3', 'nitrate_no3', 'mg/l', 'Phạm vi tối ưu: 0-20 mg/l')}
          {renderInput('Phosphate PO4', 'phosphate_po4', 'mg/l', 'Phạm vi tối ưu: 0-0.035 mg/l')}
          {renderInput('Ammonium NH4', 'ammonium_nh4', 'mg/l', 'Phạm vi tối ưu: 0-0.1 mg/l')}
          {renderInput('Độ cứng (GH)', 'hardness', '°dH', 'Phạm vi tối ưu: 0-21 °dH')}
          {renderInput('Muối', 'salt', '%', 'Phạm vi tối ưu: 0-0.1%')}
          {renderInput('Nhiệt độ ngoài trời', 'outdoor_temp', '°C', 'Phạm vi tối ưu: -40-40 °C')}
          {renderInput('Oxy O2', 'oxygen_o2', 'mg/l', 'Phạm vi tối ưu: >6.5 mg/l')}
          {renderInput('Nhiệt độ', 'temperature', '°C', 'Phạm vi tối ưu: 5-26 °C')}
          {renderInput('Giá trị pH', 'ph_value', '', 'Phạm vi tối ưu: 6.9-8')}
          {renderInput('KH', 'kh', '°dH', 'Phạm vi tối ưu: ≥4 °dH')}
          {renderInput('CO2', 'co2', 'mg/l', 'Phạm vi tối ưu: 5-35 mg/l')}
          {renderInput('Tổng Clo', 'total_chlorines', 'mg/l', 'Phạm vi tối ưu: 0-0.001 mg/l')}
          {renderInput('Lượng thức ăn', 'amount_fed', 'g', 'Theo dõi lượng thức ăn')}
        </View>

        <View className="mb-4">
          <Muted>Ghi chú</Muted>
          <Input
            placeholder="Nhập ghi chú"
            value={waterData.note}
            onChangeText={value => handleInputChange('note', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View className="flex-row justify-between mt-4">
          <Button onPress={handleSubmit} className="flex-1 mr-2">
            <Text className="text-white">Cập nhật</Text>
          </Button>
          <Button onPress={handleDelete} className="flex-1 ml-2" variant="destructive">
            <Text className="text-white">Xóa</Text>
          </Button>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default WaterParameterEdit;
