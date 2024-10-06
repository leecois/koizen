import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { H2, H3, H4, Muted } from './ui/typography';

type KoiFish = {
  id: string;
  name: string;
  variety: string;
  age: number;
  image_url: string;
  sex: string;
  size: number;
  weight: number; // Thêm trường weight
};

const { width } = Dimensions.get('window');
const cardWidth = width * 0.92;

const RenderKoiItem = ({ item }: { item: KoiFish }) => (
  <Link href={`/my-koi/${item.id}`} asChild>
    <TouchableOpacity className="mb-4">
      <Card
        containerStyle={{
          borderRadius: 15,
          padding: 0,
          margin: 8,
          width: cardWidth,
          elevation: 3,
        }}>
        <View className="flex-row">
          <Image
            source={{ uri: item.image_url }}
            style={{
              width: 130,
              height: 150,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
          />
          <View className="flex-1 p-3">
            <View className="flex-row justify-between border-b py-2 items-center mb-4">
              <H3>{item.name}</H3>
              <View className="flex-row items-center bg-blue-100 px-2 py-1 rounded-full">
                {item.sex === 'Male' && <FontAwesome5 name="mars" size={14} color="#3498db" />}
                {item.sex === 'Female' && <FontAwesome5 name="venus" size={14} color="#e74c3c" />}
                {item.sex === 'Unknown' && (
                  <FontAwesome5 name="question" size={14} color="#95a5a6" />
                )}
                <Text className="text-sm font-semibold ml-1">{item.sex}</Text>
              </View>
            </View>
            <View className="flex-row justify-between mb-2">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <FontAwesome5 name="fish" size={14} color="#3498db" style={{ width: 20 }} />
                  <View>
                    <Muted className="text-xs">Giống</Muted>
                    <H4 className="text-sm">{item.variety}</H4>
                  </View>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <FontAwesome5
                    name="birthday-cake"
                    size={14}
                    color="#2ecc71"
                    style={{ width: 20 }}
                  />
                  <View>
                    <Muted className="text-xs">Tuổi</Muted>
                    <H4 className="text-sm">{item.age} years</H4>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <FontAwesome5
                    name="ruler-vertical"
                    size={14}
                    color="#9b59b6"
                    style={{ width: 20 }}
                  />
                  <View>
                    <Muted className="text-xs">Chiều dài</Muted>
                    <H4 className="text-sm">{item.size} cm</H4>
                  </View>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <FontAwesome5 name="weight" size={14} color="#f39c12" style={{ width: 20 }} />
                  <View>
                    <Muted className="text-xs">Cân nặng</Muted>
                    <H4 className="text-sm">{item.weight} kg</H4>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  </Link>
);

export default RenderKoiItem;
