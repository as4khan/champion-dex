export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
}

export interface AllPokemon {
  count: number;
  next: string | null;
  previous?: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface EvolutionChain {
  chain: EvolutionDetail;
}

export interface EvolutionDetail {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionDetail[];
}

export interface AbilityDetail {
  effect_entries: {
    effect: string;
    language: {
      name: string;
    };
  }[];
}

export async function fetchFn(endpoint: string): Promise<any> {
  const response = await fetch(endpoint);
  return response.json();
}

export async function fetchAllPokemon({ pageParam }: { pageParam?: string }): Promise<AllPokemon> {
  const response = await fetch(pageParam || 'https://pokeapi.co/api/v2/pokemon?limit=50');
  const data: AllPokemon = await response.json();
  return data;
}

export async function fetchPokemonDetails(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data: Pokemon = await response.json();
  return data;
}

export async function fetchPokemonSpecies(url: string): Promise<PokemonSpecies> {
  const response = await fetch(url);
  const data: PokemonSpecies = await response.json();
  return data;
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await fetch(url);
  const data = await response.json();

  const parseEvolutionChain = (chain: EvolutionDetail): EvolutionDetail => {
    const extractEvolutionDetails = (evolution: EvolutionDetail): EvolutionDetail => {
      return {
        species: evolution.species,
        evolves_to: evolution.evolves_to.map(extractEvolutionDetails),
      };
    };

    return extractEvolutionDetails(chain);
  };

  return {
    chain: parseEvolutionChain(data.chain),
  };
}

export async function fetchAbilityDetails(url: string): Promise<AbilityDetail> {
  const response = await fetch(url);
  const data: AbilityDetail = await response.json();
  return data;
}

export async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error('Pokémon not found');
  }
  const data: Pokemon = await response.json();
  return data;
}
