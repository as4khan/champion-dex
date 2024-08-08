import React, { useState, useEffect } from "react";
import { Stack, Input, Spinner, Icon, Text, Center, Box } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import { fetchPokemon, Pokemon } from "../utils/api";
import { MainStackScreenProps } from "../navigators/types";

export function Search({ navigation }: MainStackScreenProps<'Search'>) {
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const fetchPokemonData = async () => {
            if (!text) return;

            setLoading(true);
            setError(null);

            try {
                const data = await fetchPokemon(text.toLowerCase());
                setPokemon(data);
            } catch (err) {
                setError('Pokémon not found');
                setPokemon(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonData();
    }, [text]);

    useEffect(() => {
        if (pokemon) {
            navigation.replace('Detail', { name: pokemon.name });
        }
    }, [pokemon, navigation]);

    return (
        <Box flex={1} bg="#28282B">
            <Stack p='4'>
                <Input 
                    placeholder="Search Pokemon by Name or ID#"
                    backgroundColor='white'
                    rounded='xl'
                    py='3'
                    px='1'
                    fontSize='14'
                    returnKeyType="search"
                    onSubmitEditing={({ nativeEvent }) => setText(nativeEvent.text)}
                    InputLeftElement={
                        <Icon 
                            m='2' 
                            ml='3' 
                            size='6' 
                            color='gray.400'
                            as={<MaterialIcons name="search"/>}
                        />
                    }
                />
            </Stack>
            <Center flex="1">
                {error && (
                    <Text fontSize="xl" color="white">
                        {error}
                    </Text>
                )}
                {loading && <Spinner size="lg" color="white" />}
            </Center>
        </Box>
    );
}




