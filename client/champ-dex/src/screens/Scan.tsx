import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Box, Text, Center } from 'native-base';
import { Camera } from 'expo-camera';


export function Scan() {
  return (
    <Box flex={1}>
      <ImageBackground
        source={require('../../assets/Kalos_Pokedex-transformed.jpeg')} // Correct path to your image
        style={styles.background}
        imageStyle={styles.image} // Apply zoom effect
      >
        <Box style={styles.container}>
          {/* <Text style={styles.text}></Text>
          Add your scan screen content here */}
          
        </Box>
      </ImageBackground>
    </Box>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover', // Ensures the image covers the entire screen
    transform: [{ scale: 1.2 }], // Adjust the scale to zoom in
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
});


