import { supabase } from '@/config/supabase';
import * as Location from 'expo-location';
import { useEffect, useState, useCallback } from 'react';
import { NearbyRestaurant } from 'types/db';

export const useNearbyRestaurants = () => {
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<NearbyRestaurant[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [status, requestPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    if (status && !status.granted && status.canAskAgain) {
      requestPermission();
    }
  }, [status]);

  const getLocation = useCallback(async () => {
    if (!status?.granted) {
      return null;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    return location;
  }, [status]);

  const fetchNearbyRestaurants = useCallback(
    async (loc: Location.LocationObject | null, search: string = '') => {
      if (!loc) {
        return;
      }
      setIsLoading(true);
      try {
        let query = supabase.rpc('nearby_restaurants', {
          lat: loc.coords.latitude,
          long: loc.coords.longitude,
        });

        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }
        setRestaurants(data || []);
        setFilteredRestaurants(data || []);
      } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const refresh = useCallback(async () => {
    const currentLocation = await getLocation();
    await fetchNearbyRestaurants(currentLocation, searchTerm);
  }, [getLocation, fetchNearbyRestaurants, searchTerm]);

  const searchRestaurants = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (term.trim() === '') {
        setFilteredRestaurants(restaurants);
      } else {
        const filtered = restaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(term.toLowerCase()),
        );
        setFilteredRestaurants(filtered);
      }
    },
    [restaurants],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    restaurants: filteredRestaurants,
    isLoading,
    refresh,
    searchRestaurants,
    searchTerm,
  };
};
