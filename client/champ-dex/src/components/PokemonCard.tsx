import React from "react"
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchFn, Pokemon } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { MainStackScreenProps } from "../navigators/types";
import {Box, Heading, Image, Text, HStack, Stack, Skeleton, Pressable, Center, AspectRatio} from 'native-base'
import { formatNumber, getTypeColor } from "../utils/helper";
import { LinearGradient } from "expo-linear-gradient";

interface PokemonCardProps {
  url: string;
  name: string;
}

export function PokemonCard({ url, name }: PokemonCardProps) {
  const { isLoading, error, data } = useQuery<Pokemon, Error>({
    queryKey: ['pokemon', name],
    queryFn: () => fetchFn(url)
  });

  const navigation = useNavigation<MainStackScreenProps<'Home'>['navigation']>();

  if (isLoading) return(
    <Stack
      flex={1}
      space={2}
      borderRadius={10}
      m='1.5'
      p='4'
    >
      <Skeleton h='32'/>
      <Skeleton.Text px='4'/>
    </Stack>
  )
  if (!data || error) return null;

  const typeColors = data.types.map(type => getTypeColor(type.type.name));

  return (
    <Pressable 
      flex={1}
      m="1.5"
      p="0"
      borderRadius={10}
      onPress={() => navigation.navigate('Detail', { name,url })}
    >
      <LinearGradient
        colors={typeColors.length > 1 ? typeColors : [typeColors[0], typeColors[0]]}
        start={[0, 0]}
        end={[1, 0]}
        style={{
          flex: 1,
          borderRadius: 10,
          padding: 16,
          width:'100%',
          height: '100%',
        }}
      >
        <Center>
          <AspectRatio ratio={1} width="78%">
            <Image
              source={{
                uri: data.sprites.other['official-artwork'].front_default,
              }}
              alt="image"
            />
          </AspectRatio>
        </Center>
        <Box position="absolute" top={2} right={2}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>#{formatNumber(data.id)}</Text>
        </Box>
        <Box>
          <Heading textTransform='capitalize' color='white' style={{ fontWeight: 'bold' }}>{data.name}</Heading>
        </Box>
        <HStack justifyContent='space-between' mt={3} mb={3}>
          {data.types.map((type) => (
            <Box
              key={type.type.name}
              px="2"
              mr="1"
              borderRadius="full"
              borderWidth={1}
              borderColor="white"
            >
              <Text style={{fontWeight: 'bold'}} textTransform='capitalize' color="white">{type.type.name}</Text>
            </Box>
          ))}
        </HStack>
        <HStack justifyContent='center' space={3} >
          {data.abilities.map((ability, index) =>(
            <Box key={index} px='2' py='1' bg="#36454F" borderRadius="full">
              <Text key={index} color="white" style={{ fontSize: 11, fontWeight: 'bold' }}>
                {ability.ability.name.toUpperCase()}
              </Text>
            </Box>
         ))}
        </HStack>
      </LinearGradient>
    </Pressable>
  );
}