const colours = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const alternateColours = {
  normal: '#C6C6A7',
  fire: '#F5AC78',
  water: '#9DB7F5',
  electric: '#FAE078',
  grass: '#A7DB8D',
  ice: '#BCE6E6',
  fighting: '#D67873',
  poison: '#C183C1',
  ground: '#EBD69D',
  flying: '#C6B7F5',
  psychic: '#FA92B2',
  bug: '#C6D16E',
  rock: '#D1C17D',
  ghost: '#A292BC',
  dragon: '#A27DFA',
  dark: '#A29288',
  steel: '#D1D1E0',
  fairy: '#F4BDC9',
};

export const getTypeColor = (type: string) => {
  return colours[type as keyof typeof colours] || '#A8A77A'; // Default to 'normal' color if type not found
};

export const getAlternateTypeColor = (type: string) => {
  return alternateColours[type as keyof typeof alternateColours] || '#C6C6A7'; // Default to 'normal' alternate color if type not found
};

// formats number to three digits
export const formatNumber = (num: number) => {
  return num.toString().padStart(3, '0');
};

export const removeEscapeCharacter = (str: string) => {
  return str.replace(/[\n\r\t\f]/g, " ");
}

export const correctPokemonName = (text: string) => {
  return text.replace(/POK[éÉE]MON/g, 'Pokémon');
};
  