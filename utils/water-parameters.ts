import { WaterParameters } from '@/types/db';
import { AlertLevel, ParameterAlert } from '@/types/water-parameters';

export const getAlertLevel = (value: number | null, min: number, max: number): AlertLevel => {
  if (value === null) return 'null';

  const numericValue = Number(value);
  if (isNaN(numericValue)) return 'null';

  const isLessThanMin = parseFloat(numericValue.toFixed(3)) < parseFloat(min.toFixed(3));
  const isMoreThanMax =
    max !== Infinity && parseFloat(numericValue.toFixed(3)) > parseFloat(max.toFixed(3));
  const isEqualMin = parseFloat(numericValue.toFixed(3)) === parseFloat(min.toFixed(3));
  const isEqualMax =
    max !== Infinity && parseFloat(numericValue.toFixed(3)) === parseFloat(max.toFixed(3));

  if (isLessThanMin || isMoreThanMax) return 'danger';
  if (isEqualMin || isEqualMax) return 'warning';
  return 'normal';
};

export const getAlertMessageColor = (level: AlertLevel): string => {
  switch (level) {
    case 'normal':
      return '#4CAF50';
    case 'warning':
      return '#FFC107';
    case 'danger':
      return '#F44336';
    case 'null':
      return '#9E9E9E';
  }
};

// export const formatParameterValue = (value: number | null, precision: number = 3): string => {
//   if (value === null) return '-';
//   return Number(value).toFixed(precision);
// };

export const getParameterAlerts = (set: WaterParameters): ParameterAlert[] => [
  {
    name: 'Nitrite NO₂',
    value: set.nitrite_no2,
    unit: 'mg/l',
    range: { min: 0, max: 0.1 },
    description: 'Nitrite cao có thể gây độc cho cá',
  },
  {
    name: 'Nitrate NO₃',
    value: set.nitrate_no3,
    unit: 'mg/l',
    range: { min: 0, max: 20 },
    description: 'Nitrate cao có thể gây hại cho cá',
  },
  {
    name: 'Phosphate PO₄',
    value: set.phosphate_po4,
    unit: 'mg/l',
    range: { min: 0, max: 0.035 },
    description: 'Phosphate cao có thể gây tảo phát triển quá mức',
  },
  {
    name: 'Ammonium NH₄',
    value: set.ammonium_nh4,
    unit: 'mg/l',
    range: { min: 0, max: 0.1 },
    description: 'Ammonium cao có thể gây độc cho cá',
  },
  {
    name: 'Độ cứng',
    value: set.hardness,
    unit: '°DH',
    range: { min: 0, max: 30 },
    description: 'Độ cứng cao có thể ảnh hưởng đến sức khỏe của cá',
  },
  {
    name: 'Muối',
    value: set.salt,
    unit: '%',
    range: { min: 0, max: 0.5 },
    description: 'Mức muối cao có thể gây hại cho cá',
  },
  {
    name: 'Nhiệt độ ngoài trời',
    value: set.outdoor_temp,
    unit: '°C',
    range: { min: -10, max: 40 },
    description: 'Nhiệt độ ngoài trời ảnh hưởng đến nhiệt độ nước',
  },
  {
    name: 'Oxy O₂',
    value: set.oxygen_o2,
    unit: 'mg/l',
    range: { min: 5, max: 14 },
    description: 'Mức oxy thấp có thể gây ngạt cho cá',
  },
  {
    name: 'Nhiệt độ',
    value: set.temperature,
    unit: '°C',
    range: { min: 20, max: 30 },
    description: 'Nhiệt độ nước ảnh hưởng đến sức khỏe của cá',
  },
  {
    name: 'Giá trị pH',
    value: set.ph_value,
    unit: '',
    range: { min: 6.5, max: 8.5 },
    description: 'Giá trị pH không phù hợp có thể gây hại cho cá',
  },
  {
    name: 'KH',
    value: set.kh,
    unit: '°DH',
    range: { min: 3, max: 10 },
    description: 'KH ảnh hưởng đến độ ổn định của pH',
  },
  {
    name: 'CO₂',
    value: set.co2,
    unit: 'mg/l',
    range: { min: 0, max: 30 },
    description: 'Mức CO₂ cao có thể gây ngạt cho cá',
  },
  {
    name: 'Tổng Clo',
    value: set.total_chlorines,
    unit: 'mg/l',
    range: { min: 0, max: 0.1 },
    description: 'Clo cao có thể gây độc cho cá',
  },
  {
    name: 'Lượng thức ăn',
    value: set.amount_fed,
    unit: 'g',
    range: { min: 0, max: 100 },
    description: 'Lượng thức ăn ảnh hưởng đến chất lượng nước',
  },
];

export const getParameters = (set: WaterParameters) => [
  {
    name: 'Nitrite NO₂',
    value: `${set.nitrite_no2} mg/l`,
    icon: 'water-outline',
    isAlert: getAlertLevel(set.nitrite_no2, 0, 0.1) !== 'normal',
  },
  {
    name: 'Nitrate NO₃',
    value: `${set.nitrate_no3} mg/l`,
    icon: 'flask-outline',
    isAlert: getAlertLevel(set.nitrate_no3, 0, 20) !== 'normal',
  },
  {
    name: 'Phosphate PO₄',
    value: `${set.phosphate_po4} mg/l`,
    icon: 'leaf-outline',
    isAlert: getAlertLevel(set.phosphate_po4, 0, 0.035) !== 'normal',
  },
  {
    name: 'Ammonium NH₄',
    value: `${set.ammonium_nh4} mg/l`,
    icon: 'cloud-outline',
    isAlert: getAlertLevel(set.ammonium_nh4, 0, 0.1) !== 'normal',
  },
  {
    name: 'Độ cứng',
    value: `${set.hardness} °DH`,
    icon: 'diamond-outline',
    isAlert: getAlertLevel(set.hardness, 0, 30) !== 'normal',
  },
  {
    name: 'Muối',
    value: `${set.salt}%`,
    icon: 'cellular-outline',
    isAlert: getAlertLevel(set.salt, 0, 0.5) !== 'normal',
  },
  {
    name: 'Nhiệt độ ngoài trời',
    value: `${set.outdoor_temp}°C`,
    icon: 'thermometer-outline',
    isAlert: getAlertLevel(set.outdoor_temp, -10, 40) !== 'normal',
  },
  {
    name: 'Oxy O₂',
    value: `${set.oxygen_o2} mg/l`,
    icon: 'water-outline',
    isAlert: getAlertLevel(set.oxygen_o2, 5, 14) !== 'normal',
  },
  {
    name: 'Nhiệt độ',
    value: `${set.temperature}°C`,
    icon: 'thermometer-outline',
    isAlert: getAlertLevel(set.temperature, 20, 30) !== 'normal',
  },
  {
    name: 'Giá trị pH',
    value: `${set.ph_value}`,
    icon: 'analytics-outline',
    isAlert: getAlertLevel(set.ph_value, 6.5, 8.5) !== 'normal',
  },
  {
    name: 'KH',
    value: `${set.kh} °DH`,
    icon: 'beaker-outline',
    isAlert: getAlertLevel(set.kh, 3, 10) !== 'normal',
  },
  {
    name: 'CO₂',
    value: `${set.co2} mg/l`,
    icon: 'cloud-outline',
    isAlert: getAlertLevel(set.co2, 0, 30) !== 'normal',
  },
  {
    name: 'Tổng Clo',
    value: `${set.total_chlorines} mg/l`,
    icon: 'flask-outline',
    isAlert: getAlertLevel(set.total_chlorines, 0, 0.1) !== 'normal',
  },
  {
    name: 'Lượng thức ăn',
    value: `${set.amount_fed}g`,
    icon: 'fish-outline',
    isAlert: getAlertLevel(set.amount_fed, -1, 100) !== 'normal',
  },
];

export const hasAnyAlert = (set: WaterParameters): boolean => {
  const alerts = getParameterAlerts(set);
  return alerts.some(
    param => getAlertLevel(param.value, param.range.min, param.range.max) !== 'normal',
  );
};

export const getHighestAlertLevel = (set: WaterParameters): AlertLevel => {
  const alerts = getParameterAlerts(set);
  const alertLevels = alerts.map(param =>
    getAlertLevel(param.value, param.range.min, param.range.max),
  );

  if (alertLevels.includes('danger')) return 'danger';
  if (alertLevels.includes('warning')) return 'warning';
  if (alertLevels.includes('null')) return 'null';
  return 'normal';
};
