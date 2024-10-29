import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, Chip } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { H3, Muted } from '@/components/ui/typography';
import { supabase } from '@/config/supabase';
import { Product } from '@/types/db';

const { width } = Dimensions.get('window');
const SPACING = 8;
const COLUMN_COUNT = 2;
const cardWidth = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

type ProductCardProps = {
  item: Product;
  onPress?: (product: Product) => void;
};

export const ProductCard = React.memo(({ item, onPress }: ProductCardProps) => {
  const handlePress = async () => {
    if (item.marketplace_url) {
      const supported = await Linking.canOpenURL(item.marketplace_url);
      if (supported) {
        await Linking.openURL(item.marketplace_url);
      } else {
        console.error("Can't open URL:", item.marketplace_url);
      }
    }
    onPress?.(item);
  };

  const MarketplaceIcon = () => {
    switch (item.marketplace_name?.toLowerCase()) {
      case 'shopee':
        return <FontAwesome5 name="shopping-bag" size={12} color="#ee4d2d" />;
      case 'lazada':
        return <FontAwesome5 name="shopping-cart" size={12} color="#0f146d" />;
      case 'tiki':
        return <FontAwesome5 name="store" size={12} color="#1a94ff" />;
      default:
        return <FontAwesome5 name="external-link-alt" size={12} color="#64748b" />;
    }
  };

  return (
    <TouchableOpacity className="mb-2" onPress={handlePress}>
      <Card
        containerStyle={{
          borderRadius: 12,
          padding: 0,
          margin: SPACING / 2,
          width: cardWidth,
          elevation: 2,
        }}>
        <Image
          source={{ uri: item.image_url ?? '' }}
          style={{
            width: '100%',
            height: cardWidth * 0.8,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
        <View className="p-2">
          <H3 className="text-sm font-bold text-gray-800 mb-1" numberOfLines={1}>
            {item.name}
          </H3>

          <View className="flex-row items-center mb-1">
            <FontAwesome5 name="tag" size={10} color="#64748b" style={{ marginRight: 4 }} />
            <Muted className="text-xs" numberOfLines={1}>
              {item.category}
            </Muted>
          </View>

          <Text className="text-gray-600 text-xs mb-2" numberOfLines={2}>
            {item.description}
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="bg-blue-50 px-2 py-1 rounded-full">
              <Text className="text-blue-600 font-semibold text-sm">
                ${(item.price ?? 0).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MarketplaceIcon />
              <Text className="text-xs ml-1 text-gray-600">{item.marketplace_name}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
});
