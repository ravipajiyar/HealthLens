import { Button, Header, ListItem, Skeleton, Text } from '@rneui/themed';
import { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, View, Alert, Animated } from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import styles from '../styles';
import NutrientList from '../components/NutrientList';
import Analyzer from '../components/Analyzer';
import { getProfile, saveScannedFood } from '../utils/storage';
import FastImage from 'react-native-fast-image';


const Details = ({ route, navigation }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [label, setLabel] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [nutrients, setNutrients] = useState([]);
    const [debugInfo, setDebugInfo] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null)
    const [fadeAnim] = useState(new Animated.Value(0));
     const [lastApiCallTime, setLastApiCallTime] = useState(0);
      const apiCallTimeout = 1000; //1 second timeout
    const MAX_RETRIES = 3;
      const isMounted = useRef(true);
     useEffect(() => {
        isMounted.current = true;
         return () => {
             isMounted.current = false;
        }
    }, []);

    const processNutrients = (nutriments) => {
        const nutritionFacts = [];

        const nutrientMappings = {
            'energy_100g': { name: 'Energy', unit: 'kcal' },
            'proteins_100g': { name: 'Proteins', unit: 'g' },
            'carbohydrates_100g': { name: 'Carbohydrates', unit: 'g' },
            'fat_100g': { name: 'Fat', unit: 'g' },
            'fiber_100g': { name: 'Fiber', unit: 'g' },
            'sodium_100g': { name: 'Sodium', unit: 'mg', multiplier: 1000 },
            'sugars_100g': { name: 'Sugars', unit: 'g' },
            'saturated-fat_100g': { name: 'Saturated Fat', unit: 'g' },
            'cholesterol_100g': { name: 'Cholesterol', unit: 'mg', multiplier: 1000 },
            'potassium_100g': { name: 'Potassium', unit: 'mg', multiplier: 1000 },
            'calcium_100g': { name: 'Calcium', unit: 'mg', multiplier: 1000 },
            'iron_100g': { name: 'Iron', unit: 'mg', multiplier: 1000 }
        };

        Object.entries(nutrientMappings).forEach(([key, info]) => {
            if (nutriments[key]) {
                nutritionFacts.push({
                    nutrientName: info.name,
                    unit: info.multiplier ? nutriments[key] * info.multiplier : nutriments[key],
                    unitType: info.unit
                });
            }
        });

        return nutritionFacts;
    };

    const getFoodDetails = async () => {
       if(!isMounted.current) return;

        const upc = route.params.upc;
        const currentTime = Date.now();
        if(currentTime - lastApiCallTime < apiCallTimeout){
          console.log('Rate limiting the api call, please try again.');
          return
        }
            setLastApiCallTime(currentTime)

        try {
            // Log the API URL and barcode being processed
            const apiUrl = `${API_URL}/${upc}.json`;
            console.log('Calling API:', apiUrl);
            setDebugInfo(prev => `${prev}Scanning barcode: ${upc}\nAPI URL: ${apiUrl}\n`);
             const response = await axios.get(apiUrl, {
                params: {
                    fields: 'product_name,image_url,ingredients_text,nutriments'
                }
            });
             console.log('API Response:', JSON.stringify(response.data, null, 2));
            setDebugInfo(prev => `${prev}API Status: ${response.status}\n`);

             if(response.status >= 200 && response.status < 300){
                 const data = response.data;
                if (data.status === 1) {
                    const product = data.product;

                     // Set basic product information
                    setImageUri( product.image_url || '');
                    setLabel(product.product_name || 'Unknown Product');
                    setIngredients(product.ingredients_text || 'Ingredients not available');

                    // Process nutrition facts if available
                    if (product.nutriments) {
                        const nutritionFacts = processNutrients(product.nutriments);
                        setNutrients(nutritionFacts);
                        setDebugInfo(prev => `${prev}Successfully processed ${nutritionFacts.length} nutrients\n`);
                        const foodData = {
                             upc,
                            label: product.product_name || 'Unknown Product',
                             ingredients: product.ingredients_text || 'Ingredients not available',
                            nutrients: nutritionFacts,
                        }
                       const saved = await saveScannedFood(foodData);
                       if(saved){
                           console.log('Successfully saved the product.');
                       }else{
                           console.log('Failed to save the product.')
                       }
                    } else {
                        setDebugInfo(prev => `${prev}No nutriment data available\n`);
                        setNutrients([]);
                    }
                   if(isMounted.current) setLoading(false);
                } else {
                    throw new Error(`Product not found in database`);
                }
            }else{
                throw new Error(`API request failed with status: ${response.status}`)
            }
        } catch (err) {
            console.log('Error details:', err);
            setDebugInfo(prev => `${prev}Error: ${err.message}\n`);
           setError(err)
            if (err.response) {
                 console.log('Error response:', err.response.data);
                 setDebugInfo(prev => `${prev}API Error: ${JSON.stringify(err.response.data)}\n`);
             if (err.response.status === 504) {
                   setError(new Error('API Gateway Time-out, try again!'))
             }

            }

            // Implement retry logic
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
               setDebugInfo(prev => `${prev}Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}\n`);
                setTimeout(getFoodDetails, 1000); // Retry after 1, 3 and 5 seconds.
                 return;
            }
             if(isMounted.current)   setLoading(false);

        }
    };
    const loadProfile = async () => {
        const savedProfile = await getProfile();
         if(isMounted.current){
            if (savedProfile) {
                setProfile(savedProfile);
            }
        }
    }
    useEffect(() => {
        loadProfile();
        getFoodDetails();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    useEffect(() => {
        if (!loading && nutrients.length > 0 && ingredients && profile) {
            const foodData = { nutrients, ingredients };
             if(isMounted.current){
                 const analysisResult = Analyzer({ foodData, profile });
                  setAnalysis(analysisResult);
            }

        }
    }, [loading, nutrients, ingredients, profile]);


    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setRetryCount(0);
        setDebugInfo('Retrying scan...\n');
        getFoodDetails();
    };

    const handleGetSuggestion = () => {
        if (analysis && profile && !loading) {
            navigation.navigate('Analysis', {
                analysis,
                profile,
                label,
                imageUri,
                nutrients,
                ingredients
            });
        }
    };

    if (error) {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    backgroundColor="#1E3A8A"
                    centerComponent={{ text: 'Not Found', style: styles.heading }}
                    containerStyle={styles.headerStyle}
                />
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.errorText, { marginBottom: 20 }]}>
                            Sorry, we couldn't find any information about this product.
                        </Text>
                       {error.message === 'API Gateway Time-out, try again!' && <Text style={{ marginBottom: 10, color: '#666' }}>
                            The server is taking too long to respond
                         </Text>}
                        <Text style={{ marginBottom: 10, color: '#666' }}>
                            This could be because:
                        </Text>
                        <Text style={{ marginBottom: 5, color: '#666' }}>
                            • The product is not in our database
                        </Text>
                        <Text style={{ marginBottom: 5, color: '#666' }}>
                            • The barcode was not scanned correctly
                        </Text>
                        <Text style={{ marginBottom: 20, color: '#666' }}>
                            • There might be a connection issue
                        </Text>
                        {__DEV__ && (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>
                                    Debug Information:
                                </Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>
                                    {debugInfo}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button
                            buttonStyle={{
                                backgroundColor: '#1E3A8A',
                                marginRight: 10,
                            }}
                            title="Try Again"
                            onPress={handleRetry}
                        />
                        <Button
                            buttonStyle={{
                                backgroundColor: '#1E3A8A',
                            }}
                            title="Go Back"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView>
            <Header
                backgroundColor="#1E3A8A"
                centerComponent={{ text: 'Nutrition Facts', style: styles.heading }}
              containerStyle={styles.headerStyle}
            />
            <NutrientList
                loading={loading}
                imageUri={imageUri}
                label={label}
                nutrients={nutrients}
                ingredients={ingredients}
            />
            <Button
                buttonStyle={{
                    backgroundColor: '#1E3A8A',
                    marginVertical: 20,
                    marginHorizontal: 10,
                }}
                title="Get Suggestion"
                onPress={handleGetSuggestion}
            />
            <Button
                buttonStyle={{
                    backgroundColor: '#1E3A8A',
                    marginVertical: 20,
                    marginHorizontal: 10,
                }}
                title="Scan Another Product"
                onPress={() => navigation.goBack()}
            />
        </ScrollView>
        </Animated.View>
    );
};

export default Details;