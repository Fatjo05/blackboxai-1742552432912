import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ErrorBoundary from './src/components/ErrorBoundary';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ItineraryProvider } from './src/context/ItineraryContext';
import TrackingScreen from './src/screens/TrackingScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ItineraryProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Track':
                    iconName = focused ? 'location-on' : 'location-searching';
                    break;
                  case 'History':
                    iconName = focused ? 'history' : 'history';
                    break;
                  case 'Settings':
                    iconName = focused ? 'settings' : 'settings';
                    break;
                  default:
                    iconName = 'error';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4CAF50',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                paddingBottom: 5,
                height: 60,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                paddingBottom: 5,
              },
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen 
              name="Track" 
              component={TrackingScreen}
              options={{
                title: 'Track Location',
              }}
            />
            <Tab.Screen 
              name="History" 
              component={HistoryScreen}
              options={{
                title: 'Travel History',
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                title: 'Settings',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        </ItineraryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
