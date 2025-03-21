import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native';
import type { GeoPosition } from 'react-native-geolocation-service';
import MapComponent from '../components/MapComponent';
import { useItinerary } from '../context/ItineraryContext';
import locationService from '../services/locationService';

const TrackingScreen: React.FC = () => {
  const { state, dispatch } = useItinerary();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (state.isTracking) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [state.isTracking]);

  useEffect(() => {
    if (state.currentRoute.length >= 2) {
      const lastIndex = state.currentRoute.length - 1;
      const newDistance = locationService.calculateDistance(
        state.currentRoute[lastIndex - 1].latitude,
        state.currentRoute[lastIndex - 1].longitude,
        state.currentRoute[lastIndex].latitude,
        state.currentRoute[lastIndex].longitude
      );
      setDistance((prev) => prev + newDistance);
    }
  }, [state.currentRoute]);

  const requestLocationPermission = async () => {
    try {
      const granted = await locationService.requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to track your itinerary.'
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleStartTracking = async () => {
    try {
      dispatch({ type: 'START_TRACKING' });
      await locationService.startTracking((position: GeoPosition) => {
        dispatch({
          type: 'ADD_LOCATION',
          payload: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          },
        });
      });
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Error', 'Failed to start tracking. Please try again.');
    }
  };

  const handleStopTracking = () => {
    locationService.stopTracking();
    dispatch({ type: 'STOP_TRACKING' });
    
    if (state.currentRoute.length > 0) {
      const itinerary = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        route: state.currentRoute,
        distance: distance,
        duration: elapsedTime,
      };
      dispatch({ type: 'SAVE_ITINERARY', payload: itinerary });
    }
    
    setElapsedTime(0);
    setDistance(0);
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapComponent
          currentLocation={
            state.currentRoute[state.currentRoute.length - 1]
          }
          routeCoordinates={state.currentRoute}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.trackingButton,
          { backgroundColor: state.isTracking ? '#ff4444' : '#4CAF50' },
        ]}
        onPress={state.isTracking ? handleStopTracking : handleStartTracking}
      >
        <Text style={styles.buttonText}>
          {state.isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingButton: {
    margin: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TrackingScreen;