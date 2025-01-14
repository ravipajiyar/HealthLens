import { Button, Card, Header, Text } from '@rneui/themed';
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import { getProfile } from '../utils/storage';
import styles from '../styles';

const Home = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [profile, setProfile] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        getBarCodeScannerPermissions();
        loadProfile();
    }, [isFocused]);

    const loadProfile = async () => {
        const savedProfile = await getProfile();
        setProfile(savedProfile);
    };

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };


    const handleBarCodeScanned = ({ data }) => {
        navigation.navigate('Product Details', { upc: data });
    };

    if (!profile) {
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor="#1E3A8A"
                    centerComponent={{
                        text: 'Health Lens',
                        style: styles.heading,
                    }}
                />
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome to Health Lens</Text>
                    <Button
                        title="Setup Profile"
                        onPress={() => navigation.navigate('ProfileSetup')}
                        buttonStyle={{
                            backgroundColor: '#1E3A8A',
                            marginTop: 20,
                        }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#1E3A8A"
                centerComponent={{
                    text: 'Health Lens',
                    style: styles.heading,
                }}
            />
            <Card>
                <Text h4>Welcome, {profile.name}</Text>
                <Text>Goal: {profile.healthGoals}</Text>
                <Button
                    title="Edit Profile"
                    onPress={() => navigation.navigate('ProfileEdit')}
                     buttonStyle={{
                         backgroundColor: '#1E3A8A',
                         marginTop: 10,
                     }}
                />
            </Card>
            <View style={styles.container}>
                  <Button
                    title="Get Personalized Suggestions"
                    onPress={() => navigation.navigate('PersonalizedSuggestions')}
                    buttonStyle={{
                        backgroundColor: '#1E3A8A',
                        marginVertical: 20,
                    }}
                />
                <Button
                    title="Now Scan the Packaged Food"
                    onPress={() => {
                        if (hasPermission) {
                            // Open Barcode scanner
                            console.log('opening the barcode scanner.');

                        } else {
                            console.log('No Permission for barcode');
                        }
                    }}
                    buttonStyle={{
                        backgroundColor: '#1E3A8A',
                        marginVertical: 20,
                    }}
                />
                <View style={[styles.scannerBox, {overflow: 'hidden'}]}>
                    {isFocused && hasPermission && (
                        <BarCodeScanner
                            onBarCodeScanned={handleBarCodeScanned}
                            style={styles.scanner}
                        />
                    )}
                </View>
                <Text style={styles.title}>
                    Search over 700,000 unique UPC codes in our database
                </Text>
            </View>
        </View>
    );
};

export default Home;