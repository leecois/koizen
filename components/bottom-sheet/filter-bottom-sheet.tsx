import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import BottomSheet from '@/components/bottom-sheet';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
}

interface Filters {
  name: string;
  variety: string;
  age: string;
  size: string;
  weight: string;
  sex: string;
  origin: string;
  breeder: string;
  status: string;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState<Filters>({
    name: '',
    variety: '',
    age: '',
    size: '',
    weight: '',
    sex: '',
    origin: '',
    breeder: '',
    status: '',
  });

  const handleInputChange = (field: keyof Filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={filters.name}
          onChangeText={value => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Variety"
          value={filters.variety}
          onChangeText={value => handleInputChange('variety', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={filters.age}
          onChangeText={value => handleInputChange('age', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Size"
          value={filters.size}
          onChangeText={value => handleInputChange('size', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={filters.weight}
          onChangeText={value => handleInputChange('weight', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Sex"
          value={filters.sex}
          onChangeText={value => handleInputChange('sex', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Origin"
          value={filters.origin}
          onChangeText={value => handleInputChange('origin', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Breeder"
          value={filters.breeder}
          onChangeText={value => handleInputChange('breeder', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={filters.status}
          onChangeText={value => handleInputChange('status', value)}
        />
        <Button title="Apply Filters" onPress={() => onApplyFilters(filters)} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default FilterBottomSheet;
