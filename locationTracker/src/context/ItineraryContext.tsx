import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Itinerary {
  id: string;
  date: string;
  route: Location[];
  distance: number;
  duration: number;
}

interface ItineraryState {
  currentRoute: Location[];
  history: Itinerary[];
  isTracking: boolean;
}

type ItineraryAction =
  | { type: 'START_TRACKING' }
  | { type: 'STOP_TRACKING' }
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'SAVE_ITINERARY'; payload: Itinerary }
  | { type: 'CLEAR_HISTORY' };

const initialState: ItineraryState = {
  currentRoute: [],
  history: [],
  isTracking: false,
};

const ItineraryContext = createContext<{
  state: ItineraryState;
  dispatch: React.Dispatch<ItineraryAction>;
} | null>(null);

function itineraryReducer(state: ItineraryState, action: ItineraryAction): ItineraryState {
  switch (action.type) {
    case 'START_TRACKING':
      return {
        ...state,
        isTracking: true,
        currentRoute: [],
      };
    case 'STOP_TRACKING':
      return {
        ...state,
        isTracking: false,
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        currentRoute: [...state.currentRoute, action.payload],
      };
    case 'SAVE_ITINERARY':
      return {
        ...state,
        history: [action.payload, ...state.history],
        currentRoute: [],
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      };
    default:
      return state;
  }
}

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}