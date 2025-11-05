import axios from 'axios';
import { WeatherData, LocationData } from '../types/weather.types';

// OpenWeatherMap API (Free tier - you'll need to get your own API key)
const API_KEY = '0cdd2fc15c94d750515173d7fe2297c9'; // Users should replace this
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherAPIService {
  /**
   * Fetch current weather data for a location
   */
  static async getCurrentWeather(city: string): Promise<WeatherData | null> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        date: new Date().toISOString(),
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        cloudCover: data.clouds.all
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  /**
   * Fetch historical weather data (simulated with current data for demo)
   */
  static async getHistoricalWeather(city: string, days: number = 30): Promise<WeatherData[]> {
    try {
      // In production, you'd use historical API or database
      // For demo, we'll simulate historical data
      const current = await this.getCurrentWeather(city);
      if (!current) return [];

      return this.generateHistoricalData(current, days);
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return [];
    }
  }

  /**
   * Generate simulated historical data based on current weather
   */
  private static generateHistoricalData(current: WeatherData, days: number): WeatherData[] {
    const data: WeatherData[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Add realistic variations
      const tempVariation = (Math.random() - 0.5) * 10;
      const humidityVariation = (Math.random() - 0.5) * 20;
      const rainfallVariation = Math.random() * 5;
      const windVariation = (Math.random() - 0.5) * 3;

      data.push({
        date: date.toISOString(),
        temperature: current.temperature + tempVariation,
        humidity: Math.max(0, Math.min(100, current.humidity + humidityVariation)),
        rainfall: Math.max(0, current.rainfall + rainfallVariation),
        windSpeed: Math.max(0, current.windSpeed + windVariation),
        pressure: current.pressure + (Math.random() - 0.5) * 20,
        cloudCover: Math.max(0, Math.min(100, current.cloudCover + (Math.random() - 0.5) * 30))
      });
    }

    return data;
  }

  /**
   * Geocode city name to coordinates
   */
  static async getLocationData(city: string): Promise<LocationData | null> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY
        }
      });

      return {
        city: response.data.name,
        country: response.data.sys.country,
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
}
