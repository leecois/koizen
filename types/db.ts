import { Tables } from './supabase';

export type KoiFish = Tables<'koi_fish'>;

export type Ponds = Tables<'ponds'>;

export type Product = Tables<'products'>;

export type WaterParameters = Tables<'water_parameters'> & {
  pond_name: string;
  date_time: string;
};
