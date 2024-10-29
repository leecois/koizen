export type AlertLevel = 'normal' | 'warning' | 'danger' | 'null';

export interface Parameter {
  name: string;
  value: string;
  icon: string;
  isAlert: boolean;
}

export interface ParameterAlert {
  name: string;
  value: number | null;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  description: string;
}
