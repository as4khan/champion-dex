import React from 'react';
// import { StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Text } from 'react-native';
import { PokemonCard } from '../components/PokemonCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AllPokemon, fetchAllPokemon } from '../utils/api';
import {Center, Spinner, FlatList, Text, Box} from 'native-base'

export function Home() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery<AllPokemon>({
    queryKey: ['pokemon'],
    queryFn: ({ pageParam = 'https://pokeapi.co/api/v2/pokemon?limit=50' }) => fetchAllPokemon({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 'https://pokeapi.co/api/v2/pokemon?limit=50',
  });

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  if (isLoading) return (
    <Center flex={1}>
      <Spinner size='lg' color='black'/>
    </Center>
  );
  if (error) return (<Text>Error loading data: {error.message}</Text>);
  if (!data) return null;

  const pokemon = data.pages.flatMap((page) => page.results);

  return (
    <Box flex={1} bg='#28282B'>
      <FlatList
        data={pokemon.slice(0, 890)}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <PokemonCard url={item.url} name={item.name} />}
        onEndReached={loadMore}
        // numColumns={1}
        contentInsetAdjustmentBehavior='automatic'
        ListFooterComponent={() => (isFetchingNextPage ? <Spinner mt={4} size='lg' color='white' /> : null)}
        _contentContainerStyle={{ p: 2, bg: '#28282B' }}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
}



