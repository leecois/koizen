import { FlatList, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { ProductCard } from '@/components/card/product-card';
import React from 'react';
import { supabase } from '@/config/supabase';
import { Product } from '@/types/db';
import { Chip } from '@rneui/themed';

const SPACING = 8;
export default function RecommendationScreen() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .order('category');

      if (error) throw error;

      // Remove duplicates and null values
      const uniqueCategories = Array.from(new Set(data.map(item => item.category).filter(Boolean)));

      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  const fetchProducts = async (category?: string) => {
    try {
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      // Add order and limit
      query = query.order('created_at', { ascending: false }).limit(50);

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProducts(selectedCategory ?? undefined);
  }, [selectedCategory]);

  React.useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  React.useEffect(() => {
    fetchProducts(selectedCategory ?? undefined);
  }, [selectedCategory]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      item={item}
      onPress={product => {
        console.log('Sản phẩm được nhấn:', product.id);
      }}
    />
  );

  return (
    <View className="flex-1 items-start">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
        <Chip
          title="Tất cả"
          type={selectedCategory === null ? 'solid' : 'outline'}
          onPress={() => setSelectedCategory(null)}
          containerStyle={{ marginRight: 8 }}
        />
        {categories.map(category => (
          <Chip
            key={category}
            title={category}
            type={selectedCategory === category ? 'solid' : 'outline'}
            onPress={() => setSelectedCategory(category)}
            containerStyle={{ marginRight: 8 }}
          />
        ))}
      </ScrollView>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: SPACING / 2, flex: 1 }}
        columnWrapperStyle={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
}
