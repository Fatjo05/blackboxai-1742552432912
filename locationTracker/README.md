# Location Tracker App

A React Native application for tracking and recording travel routes with real-time location tracking, history viewing, and route visualization.

## Features

- Real-time location tracking
- Route visualization on map
- Travel history with distance and duration
- Route replay functionality
- Settings management

## Prerequisites

- Node.js >= 14
- React Native development environment setup
- Android Studio (for Android development)
- Xcode (for iOS development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd locationTracker
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (iOS only):
```bash
cd ios
pod install
cd ..
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── MapComponent.tsx
│   └── ErrorBoundary.tsx
├── context/           # React Context for state management
│   └── ItineraryContext.tsx
├── screens/           # Main screen components
│   ├── TrackingScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── services/          # Business logic and services
│   └── locationService.ts
└── utils/            # Utility functions and helpers
```

## Permissions

The app requires the following permissions:

### Android
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

### iOS
- Location When In Use

## Technologies Used

- React Native
- React Navigation
- React Native Maps
- React Native Geolocation Service
- React Native Vector Icons
- TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
