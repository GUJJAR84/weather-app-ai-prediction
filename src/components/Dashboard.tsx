import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Activity, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { WeatherData, WeatherPrediction, ModelMetrics, ForecastResult } from '../types/weather.types';
import { WeatherAPIService } from '../services/weatherAPI.service';
import { MLModelService } from '../services/mlModel.service';
import WeatherChart from './WeatherChart';
import PredictionCard from './PredictionCard';
import MetricsPanel from './MetricsPanel';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [city, setCity] = useState<string>('London');
  const [searchCity, setSearchCity] = useState<string>('London');
  const [historicalData, setHistoricalData] = useState<WeatherData[]>([]);
  const [predictions, setPredictions] = useState<WeatherPrediction[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mlService] = useState(() => new MLModelService());
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Try to load saved model
      const modelLoaded = await mlService.loadModel();
      
      // Fetch initial data
      await fetchWeatherData(city);
      
      if (modelLoaded) {
        console.log('Loaded saved model successfully');
      }
    } catch (err) {
      setError('Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const current = await WeatherAPIService.getCurrentWeather(cityName);
      if (current) {
        setCurrentWeather(current);
      }

      // Fetch historical data
      const historical = await WeatherAPIService.getHistoricalWeather(cityName, 60);
      
      if (historical.length === 0) {
        throw new Error('No weather data available for this location');
      }

      setHistoricalData(historical);
      setCity(cityName);
    } catch (err) {
      setError(`Failed to fetch weather data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const trainAndPredict = async () => {
    if (historicalData.length === 0) {
      setError('No historical data available. Please fetch weather data first.');
      return;
    }

    setIsTraining(true);
    setError('');

    try {
      // Train the model
      const trainingMetrics = await mlService.trainModel(historicalData);
      setMetrics(trainingMetrics);

      // Save the trained model
      await mlService.saveModel();

      // Make predictions
      const forecastPredictions = await mlService.predict(historicalData, 7);
      setPredictions(forecastPredictions);

    } catch (err) {
      setError(`Failed to train model: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWeatherIcon = (temp: number) => {
    if (temp > 25) return '☀️';
    if (temp > 15) return '⛅';
    if (temp > 5) return '🌤️';
    return '🌧️';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <Activity className="logo-icon" size={32} />
            <h1>AI Weather Forecast</h1>
          </div>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <MapPin className="search-icon" size={20} />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city name..."
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Current Weather Section */}
        {currentWeather && (
          <section className="current-weather-section">
            <div className="section-header">
              <h2>
                <MapPin size={24} />
                Current Weather - {city}
              </h2>
              <span className="current-date">
                <Calendar size={16} />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="current-weather-grid">
              <div className="weather-card temperature">
                <div className="card-icon">
                  <Thermometer size={32} />
                </div>
                <div className="card-content">
                  <h3>Temperature</h3>
                  <p className="value">{currentWeather.temperature.toFixed(1)}°C</p>
                  <span className="weather-emoji">{getWeatherIcon(currentWeather.temperature)}</span>
                </div>
              </div>

              <div className="weather-card humidity">
                <div className="card-icon">
                  <Droplets size={32} />
                </div>
                <div className="card-content">
                  <h3>Humidity</h3>
                  <p className="value">{currentWeather.humidity.toFixed(0)}%</p>
                </div>
              </div>

              <div className="weather-card wind">
                <div className="card-icon">
                  <Wind size={32} />
                </div>
                <div className="card-content">
                  <h3>Wind Speed</h3>
                  <p className="value">{currentWeather.windSpeed.toFixed(1)} m/s</p>
                </div>
              </div>

              <div className="weather-card rainfall">
                <div className="card-icon">
                  <Cloud size={32} />
                </div>
                <div className="card-content">
                  <h3>Rainfall</h3>
                  <p className="value">{currentWeather.rainfall.toFixed(1)} mm</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Model Section */}
        <section className="ai-model-section">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              AI Weather Prediction Model
            </h2>
          </div>

          <div className="model-controls">
            <button
              onClick={trainAndPredict}
              disabled={isTraining || isLoading || historicalData.length === 0}
              className="train-button"
            >
              {isTraining ? (
                <>
                  <div className="spinner"></div>
                  Training Model...
                </>
              ) : (
                <>
                  <Activity size={20} />
                  Train AI Model & Predict
                </>
              )}
            </button>

            <p className="model-info">
              {historicalData.length > 0 
                ? `${historicalData.length} days of historical data loaded`
                : 'No data loaded'}
            </p>
          </div>

          {/* Model Metrics */}
          {metrics && <MetricsPanel metrics={metrics} />}
        </section>

        {/* Historical Data Visualization */}
        {historicalData.length > 0 && (
          <section className="chart-section">
            <div className="section-header">
              <h2>Historical Weather Data</h2>
            </div>
            <WeatherChart 
              historicalData={historicalData} 
              predictions={predictions}
            />
          </section>
        )}

        {/* Predictions Section */}
        {predictions.length > 0 && (
          <section className="predictions-section">
            <div className="section-header">
              <h2>7-Day Weather Forecast</h2>
            </div>
            <div className="predictions-grid">
              {predictions.map((prediction, index) => (
                <PredictionCard
                  key={index}
                  prediction={prediction}
                  day={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="info-section">
          <div className="info-card">
            <h3>About This Application</h3>
            <p>
              This AI-powered weather forecasting system uses machine learning algorithms 
              to predict future weather conditions based on historical data. The neural 
              network model analyzes patterns in temperature, humidity, rainfall, and wind 
              speed to provide accurate forecasts.
            </p>
          </div>
          
          <div className="info-card">
            <h3>How It Works</h3>
            <ul>
              <li>Fetches real-time weather data for any location</li>
              <li>Analyzes historical weather patterns using deep learning</li>
              <li>Trains a neural network model on time-series data</li>
              <li>Generates 7-day weather forecasts with confidence scores</li>
              <li>Continuously improves predictions with more data</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 AI Weather Forecast | Powered by TensorFlow.js & React</p>
      </footer>
    </div>
  );
};

export default Dashboard;
