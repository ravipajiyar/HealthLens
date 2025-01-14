import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Details from '../screens/Details';
import Home from '../screens/Home';
import ProfileSetup from '../screens/ProfileSetup';
import ProfileEdit from '../screens/ProfileEdit';
import Analysis from '../screens/Analysis';
import PersonalizedSuggestions from "../screens/PersonalizedSuggestions";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ initialRouteName }) => {

  const HomeButton = ({ navigation }) => (
      <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate('Home')}
      >
           <Ionicons name="ios-home" size={24} color="white" />
      </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
        screenOptions={({ navigation, route }) => ({
            headerShown: true,
            headerStyle: styles.headerStyle,
          headerTitleStyle: styles.heading,
            headerLeft: () => {
                if (route.name === 'Home' || route.name === 'ProfileSetup') {
                    return null;
                }
                return <HomeButton navigation={navigation} />;
            },
            headerTitleAlign: 'center',
            headerTintColor: 'white'
        })}
    >
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetup} options={{headerShown: false}} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Product Details" component={Details} />
        <Stack.Screen name="Analysis" component={Analysis} />
        <Stack.Screen name="PersonalizedSuggestions" component={PersonalizedSuggestions} options={{ title: 'Personalized Suggestions' }} />
    </Stack.Navigator>
  );
};
export default StackNavigator;