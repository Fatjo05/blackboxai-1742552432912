import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import locationService from '../services/locationService';

const SettingsScreen: React.FC = () => {
  const handleRequestPermission = async () => {
    try {
      const granted = await locationService.requestLocationPermission();
      if (granted) {
        Alert.alert('Success', 'Location permission granted!');
      } else {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to track your itinerary. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openSettings();
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const renderSettingItem = (title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        {renderSettingItem(
          'Location Permission',
          handleRequestPermission
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem(
          'Version',
          () => Alert.alert('Version', '1.0.0')
        )}
        {renderSettingItem(
          'Privacy Policy',
          () => Alert.alert('Privacy Policy', 'Your location data is stored locally on your device and is not shared with any third parties.')
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This app helps you track your travel routes and maintain a history of your journeys.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#444',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 'auto',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;