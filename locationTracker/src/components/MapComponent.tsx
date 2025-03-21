import React, { useRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Region } from 'react-native-maps';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface MapComponentProps {
  currentLocation?: Location;
  routeCoordinates: Location[];
  onRegionChange?: (region: Region) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentLocation,
  routeCoordinates,
  onRegionChange,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      showsUserLocation
      showsMyLocationButton
      showsCompass
      onRegionChange={onRegionChange}
      initialRegion={{
        latitude: currentLocation?.latitude || 0,
        longitude: currentLocation?.longitude || 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {routeCoordinates.length > 0 && (
        <>
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
          
          {/* Start Marker */}
          <Marker
            coordinate={routeCoordinates[0]}
            title="Start"
            pinColor="green"
          />
          
          {/* End Marker */}
          <Marker
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            title="Current"
            pinColor="red"
          />
        </>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default MapComponent;