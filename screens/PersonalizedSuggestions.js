// screens/PersonalizedSuggestions.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Header, ListItem } from '@rneui/themed';
import styles from '../styles';
import { getScannedFoods } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';


const PersonalizedSuggestions = () => {
    const [scannedFoods, setScannedFoods] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        loadScannedFoods();
    }, [isFocused]);

    const loadScannedFoods = async () => {
        const foods = await getScannedFoods();
       if(foods){
           setScannedFoods(foods);
       }
    };

    const getTopScannedFoods = () => {
        if (!scannedFoods || scannedFoods.length === 0) {
            return [];
        }
         // create a map to count frequency
         const foodCount = scannedFoods.reduce((acc, food) => {
           acc[food.label] = (acc[food.label] || 0) + 1;
              return acc;
           }, {});

         //sort based on the frequency
         const sortedFoods = Object.entries(foodCount)
             .sort(([, countA], [, countB]) => countB - countA)
             .map(([label]) => label)

           return sortedFoods.slice(0, 5);
    };


    const topFoods = getTopScannedFoods();

    return (
        <ScrollView>
            <Header
                backgroundColor="#1E3A8A"
                centerComponent={{ text: 'Personalized Suggestions', style: styles.heading }}
                containerStyle={styles.headerStyle}
            />
            <View style={styles.container}>
                 <Text h4 style={styles.sectionHeader}>Top Scanned Foods</Text>
                 {topFoods.length > 0 ? (
                    topFoods.map((label, index) =>(
                       <ListItem key={index} containerStyle={styles.listItemContainer}>
                            <ListItem.Content>
                                 <ListItem.Title style={styles.listItemTitle}>{label}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                   ) : (
                        <Text>No scanned food history available.</Text>
                    )}
            </View>
        </ScrollView>
    );
};

export default PersonalizedSuggestions;