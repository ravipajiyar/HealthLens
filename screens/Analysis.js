// screens/Analysis.js
import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Header, ListItem } from '@rneui/themed';
import styles from '../styles';
import NutrientList from '../components/NutrientList';

const Analysis = ({ route }) => {
    const { analysis, label, imageUri, ingredients, nutrients } = route.params;
    const { suggestion, reasons } = analysis || {}; // Use default object if analysis is undefined
    const dietReasons = (reasons || []).filter(reason => reason.type === 'diet');
    const allergyReasons = (reasons || []).filter(reason => reason.type === 'allergy');
    const nutrientReasons = (reasons || []).filter(reason => reason.type === 'nutrient');
      const infoReasons = (reasons || []).filter(reason => reason.type === 'info');


    return (
        <ScrollView>
            <Header
                backgroundColor="#1E3A8A"
                centerComponent={{ text: 'Analysis', style: styles.heading }}
            />
            <NutrientList
                loading={false}
                imageUri={imageUri}
                label={label}
                nutrients={nutrients}
                ingredients={ingredients}
            />
            <View style={styles.container}>
                <Text h4 style={styles.sectionHeader}>AI Analysis</Text>
                <Text>Suggestion: {suggestion}</Text>
                {infoReasons.length > 0 && infoReasons.map((reason, index) => (
                    <View key={index}>
                        <Text>{reason.message}</Text>
                    </View>
                ))}
                {dietReasons.length > 0 && (
                    <View>
                        <Text h4 style={styles.sectionHeader}>Dietary Preferences:</Text>
                        {dietReasons.map((reason, index) => (
                            <View key={index}>
                                <Text>{reason.message}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {allergyReasons.length > 0 && (
                    <View>
                        <Text h4 style={styles.sectionHeader}>Allergy Information:</Text>
                        {allergyReasons.map((reason, index) => (
                            <View key={index}>
                                <Text>{reason.message}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {nutrientReasons.length > 0 && (
                    <View>
                        <Text h4 style={styles.sectionHeader}>Nutrient Warnings:</Text>
                        {nutrientReasons.map((reason, index) => (
                            <View key={index}>
                                <Text>{reason.message}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Analysis;