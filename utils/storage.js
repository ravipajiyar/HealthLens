import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@health_lens_profile';
const SCANNED_FOODS_KEY = '@health_lens_scanned_foods';


export const saveProfile = async (profileData) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const getProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};
export const saveScannedFood = async (foodData) => {
    try {
        const existingFoods = await getScannedFoods() || [];
         const newFoods = [...existingFoods, foodData];
       await AsyncStorage.setItem(SCANNED_FOODS_KEY, JSON.stringify(newFoods));
        return true;
    } catch (error) {
        console.error('Error saving scanned food:', error);
        return false;
    }
};

export const getScannedFoods = async () => {
    try {
        const foods = await AsyncStorage.getItem(SCANNED_FOODS_KEY);
        return foods ? JSON.parse(foods) : null;
    } catch (error) {
        console.error('Error getting scanned foods:', error);
        return null;
    }
};