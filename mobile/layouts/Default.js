import React, { Component } from 'react';
import { StyleSheet, Button, View, Image, Text, Alert } from 'react-native';
import Menu from '../components/Menu'


function Default() {
  return (
    <View style= {styles.base}>
      <Button style={styles.button}
        title= "Discover"
        color= '#2e2e2e'
      />
     
      <Text style={styles.context}>
        Hello
      </Text>
      <Text style={styles.pages}>
        Pages
      </Text>
          
     
    </View>
    );
  };


const styles = StyleSheet.create({
    
    base:{
      
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      top: 30,
           
    },
    
    button: {
      
    },

    context: {
     color: '#fff',
    },

    pages:{
      color: '#fff',
    },
  });

export default Default;