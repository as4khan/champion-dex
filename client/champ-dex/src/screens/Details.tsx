import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainStackScreenProps } from "../navigators/types";
import { fetchFn, Pokemon, fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain, fetchAbilityDetails, EvolutionChain, PokemonSpecies, EvolutionDetail, AbilityDetail } from "../utils/api";
import { AspectRatio, Image, Text, Heading, Stack, HStack, Center, Box, ScrollView, VStack } from "native-base";
import { getTypeColor, removeEscapeCharacter, correctPokemonName } from "../utils/helper";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumber, getAlternateTypeColor } from "../utils/helper";

export function Detail({ route }: MainStackScreenProps<'Detail'>) {
  const { name } = route.params;
  const { isLoading: isLoadingDetails, data: dataDetails } = useQuery<Pokemon, Error>({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetails(name)
  });

  const { isLoading: isLoadingSpecies, data: dataSpecies } = useQuery<PokemonSpecies, Error>({
    queryKey: ['pokemonSpecies', dataDetails?.species.url],
    queryFn: () => fetchPokemonSpecies(dataDetails?.species.url!),
    enabled: !!dataDetails?.species.url,
  });

  const { isLoading: isLoadingEvolution, data: dataEvolution } = useQuery<EvolutionChain, Error>({
    queryKey: ['pokemonEvolution', dataSpecies?.evolution_chain.url],
    queryFn: () => fetchEvolutionChain(dataSpecies?.evolution_chain.url!),
    enabled: !!dataSpecies?.evolution_chain.url,
  });

  const [abilities, setAbilities] = useState<AbilityDetail[]>([]);
  const [isLoadingAbilities, setIsLoadingAbilities] = useState<boolean>(true);

  useEffect(() => {
    if (dataDetails?.abilities) {
      Promise.all(dataDetails.abilities.map(ability => fetchAbilityDetails(ability.ability.url)))
        .then(setAbilities)
        .finally(() => setIsLoadingAbilities(false));
    }
  }, [dataDetails?.abilities]);

  if (isLoadingDetails || isLoadingSpecies || isLoadingEvolution || isLoadingAbilities) return null;
  if (!dataDetails || !dataSpecies || !dataEvolution) return null;

  const typeColors = dataDetails.types.map(type => getTypeColor(type.type.name));
  const alternateTypeColors = dataDetails.types.map(type => getAlternateTypeColor(type.type.name));
  const primaryTypeColor = getTypeColor(dataDetails.types[0].type.name);

  const getEnglishFlavorText = () => {
    const flavorText = dataSpecies.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '';
    return correctPokemonName(removeEscapeCharacter(flavorText));
  };

  const renderEvolutionChain = (evolution: EvolutionDetail) => {
    const chain: EvolutionDetail[] = [evolution];
    let current = evolution;
    while (current.evolves_to.length > 0) {
      current = current.evolves_to[0];
      chain.push(current);
    }
    return (
      <VStack space={4} alignItems="center">
        {chain.map((evo, index) => (
          <React.Fragment key={index}>
            <Box alignItems="center">
              <AspectRatio ratio={1} width={100} mb={2}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.species.url.split('/').filter(Boolean).pop()}.png`,
                  }}
                  alt={evo.species.name}
                  resizeMode="contain"
                />
              </AspectRatio>
              <Text fontWeight="bold" textTransform="capitalize" color={primaryTypeColor}>{evo.species.name}</Text>
            </Box>
            {index < chain.length - 1 && (
              <Text fontWeight="bold" fontSize="lg" color={primaryTypeColor}>↓</Text>
            )}
          </React.Fragment>
        ))}
      </VStack>
    );
  };

  return (
    <Stack style={{ flex: 1, backgroundColor: 'white' }}>
      <Center width="100%" style={{ height: 250 }}>
        <LinearGradient
          colors={typeColors.length > 1 ? typeColors : [typeColors[0], typeColors[0]]}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            position: 'relative'
          }}
        >
          <Box position="absolute" top={2} right={2}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>#{formatNumber(dataDetails.id)}</Text>
          </Box>
          <AspectRatio ratio={1} width="60%">
            <Image 
              source={{
                uri: dataDetails.sprites.other['official-artwork'].front_default
              }}
              alt="image"
              resizeMode="contain"
            />
          </AspectRatio>
          <Box position="absolute" bottom={2} left={4}>
            <Heading textTransform='capitalize' color='white' style={{ fontWeight: 'bold', fontSize: 25 }}>{name}</Heading>
          </Box>
        </LinearGradient>
      </Center>
      <LinearGradient
        colors={alternateTypeColors.length > 1 ? alternateTypeColors : [alternateTypeColors[0], alternateTypeColors[0]]}
        start={[0, 0]}
        end={[1, 0]}
        style={{
          flex: 1,
          width: '100%',
          padding: 16,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <ScrollView width="100%">
          <Center>
            <Heading size="md" color='white'>Type</Heading>
          </Center>
          <Center>            
              <Box mt={2} borderRadius="full" shadow={1} width="80%">
                  <LinearGradient
                      colors={typeColors.length > 1 ? typeColors : [typeColors[0], typeColors[0]]}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      }}
                  >
                      <Box p={4}>
                      <HStack space={20} justifyContent="center">
                          {dataDetails.types.map((type, index) => (
                          <Box
                              key={index}
                              p={2}
                              borderRadius='full'
                              borderWidth={1}
                              borderColor='white'
                              justifyContent="center"
                              alignItems="center"
                          >
                              <Text style={{ color: 'white', fontWeight: 'bold' }}>{type.type.name.toUpperCase()}</Text>
                          </Box>
                          ))}
                      </HStack>
                      </Box>
                  </LinearGradient>
              </Box>
          </Center>
          <Center mt={4}>
            <Heading size="md" color='white'>Species</Heading>
          </Center>
          <Box mt={4} p={4} bg="white" borderRadius="lg" shadow={2} width="100%">
            <VStack space={4}>
              <Box flex={1} p={4} bg="white" borderRadius="md" borderWidth={1} style={{borderColor: primaryTypeColor}}>
                <Text px={2} style={{fontWeight: 'bold', color: primaryTypeColor}}>{getEnglishFlavorText()}</Text>
              </Box>
              <HStack space={4}>
                <Box flex={1} p={4} bg="white" borderRadius="md" borderWidth={1} alignItems="center" style={{borderColor: primaryTypeColor}}>
                  <Text fontSize="md" style={{fontWeight: 'bold', color: primaryTypeColor}}>{(dataDetails.height / 10).toFixed(2)} m</Text>
                  <Text fontSize="sm" style={{fontWeight: 'bold', color: primaryTypeColor}}>Height</Text>
                </Box>
                <Box flex={1} p={4} bg="white" borderRadius="md" borderWidth={1} alignItems="center" style={{borderColor: primaryTypeColor}}>
                  <Text fontSize="md" style={{fontWeight: 'bold', color: primaryTypeColor}}>{(dataDetails.weight / 10).toFixed(2)} kg</Text>
                  <Text fontSize="sm" style={{fontWeight: 'bold', color: primaryTypeColor}}>Weight</Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
          <Center mt={4}>
            <Heading size="md" color='white'>Base Stats</Heading>
          </Center>
          <Box mt={4} p={4} bg="white" borderRadius="lg" shadow={2} width="100%">
            <VStack space={3} mt={2}>
              {dataDetails.stats.map((stat) => (
                  <Box flex={1} p={2} bg="white" borderRadius="md" borderWidth={1} style={{borderColor: primaryTypeColor}}>
                      <HStack key={stat.stat.name} justifyContent="space-between">
                          <Text style={{fontWeight: 'bold', color: primaryTypeColor}}>{stat.stat.name.toUpperCase()}</Text>
                          <Text style={{fontWeight: 'bold', color: primaryTypeColor}}>{stat.base_stat}</Text>
                      </HStack>
                  </Box>
              ))}
            </VStack>
          </Box>
          <Center mt={4}>
            <Heading size="md" color='white'>Abilities</Heading>
          </Center>
          <Box mt={4} p={4} bg="white" borderRadius="lg" shadow={2} width="100%">
            <VStack space={2} mt={2}>
              {dataDetails.abilities.map((ability, index) => {
                const abilityDetails = abilities[index];
                const abilityDescription = abilityDetails?.effect_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en')?.effect || '';
                return (
                  <Box key={index} p={4} bg="white" borderRadius="md" borderWidth={1} style={{borderColor: primaryTypeColor}} alignItems='center'>
                    <HStack justifyContent="space-between">
                      <Text style={{fontWeight: 'bold', color: primaryTypeColor}}>{ability.ability.name.toUpperCase()}</Text>
                      <Text style={{color: primaryTypeColor}}>{ability.is_hidden ? '(Hidden)' : ''}</Text>
                    </HStack>
                    <Text textAlign='center' style={{color: primaryTypeColor, fontStyle: 'italic'}}>{abilityDescription}</Text>
                  </Box>
                );
              })}
            </VStack>
          </Box>
          <Center mt={4}>
            <Heading size="md" color='white'>Evolution Chain</Heading>
          </Center>
          <Center>
              <Box mt={4} p={4} bg="white" borderRadius="lg" shadow={2} width="65%">
                  {renderEvolutionChain(dataEvolution.chain)}
              </Box>
          </Center>
          
        </ScrollView>
      </LinearGradient>
    </Stack>
  );
}




    
    
