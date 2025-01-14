import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './components/StackNavigator';
import { useEffect, useState } from 'react';
import { getProfile } from './utils/storage';
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
        const profile = await getProfile();
      if (profile) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('ProfileSetup');
      }
    };
    checkProfile();
  }, []);

  if (initialRoute === null) {
    return null; // or a loading indicator
  }
  return (
      <ErrorBoundary>
            <NavigationContainer>
              <StackNavigator initialRouteName={initialRoute} />
            </NavigationContainer>
      </ErrorBoundary>

  );
}