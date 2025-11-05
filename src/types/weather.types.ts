// Type definitions for the Weather Forecasting Application

export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  cloudCover: number;
}

export interface WeatherPrediction {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  confidence: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  cloudCover: number;
}

export interface ModelMetrics {
  accuracy: number;
  mae: number;
  rmse: number;
  trainingTime: number;
}

export interface ForecastResult {
  predictions: WeatherPrediction[];
  metrics: ModelMetrics;
  timestamp: string;
}

export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}
