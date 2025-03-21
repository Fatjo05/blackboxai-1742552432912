import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

class LocationService {
  private watchId: number | null = null;

  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result === RESULTS.DENIED) {
        const permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return permissionResult === RESULTS.GRANTED;
      }
      return result === RESULTS.GRANTED;
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to track your itinerary.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting location permission:', err);
        return false;
      }
    }

    return false;
  }

  startTracking(onLocationUpdate: (position: GeoPosition) => void): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const hasPermission = await this.requestLocationPermission();
        if (!hasPermission) {
          reject(new Error('Location permission not granted'));
          return;
        }

        this.watchId = Geolocation.watchPosition(
          onLocationUpdate,
          (error) => {
            console.error('Location tracking error:', error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10, // Minimum distance (in meters) before triggering update
            interval: 5000, // Minimum time interval between updates (ms)
            fastestInterval: 3000, // Fastest rate at which app can handle updates (ms)
          }
        );

        resolve(true);
      } catch (error) {
        console.error('Error starting location tracking:', error);
        reject(error);
      }
    });
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getCurrentPosition(): Promise<GeoPosition> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}

export default new LocationService();