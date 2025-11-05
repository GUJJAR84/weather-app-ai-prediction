import React from 'react';
import { Thermometer, Droplets, Cloud, Wind } from 'lucide-react';
import { WeatherPrediction } from '../types/weather.types';
import './PredictionCard.css';

interface PredictionCardProps {
  prediction: WeatherPrediction;
  day: number;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, day }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const getWeatherCondition = (temp: number, rainfall: number) => {
    if (rainfall > 5) return { emoji: '🌧️', text: 'Rainy' };
    if (rainfall > 2) return { emoji: '🌦️', text: 'Showers' };
    if (temp > 30) return { emoji: '☀️', text: 'Hot' };
    if (temp > 20) return { emoji: '⛅', text: 'Sunny' };
    if (temp > 10) return { emoji: '🌤️', text: 'Mild' };
    return { emoji: '🌥️', text: 'Cool' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4caf50';
    if (confidence >= 60) return '#ff9800';
    return '#f44336';
  };

  const { day: dayName, date: dateStr } = formatDate(prediction.date);
  const condition = getWeatherCondition(prediction.temperature, prediction.rainfall);

  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <div className="date-info">
          <span className="day-name">Day {day}</span>
          <span className="day-of-week">{dayName}</span>
          <span className="date-str">{dateStr}</span>
        </div>
        <div className="weather-emoji">{condition.emoji}</div>
      </div>

      <div className="weather-condition">
        <span className="condition-text">{condition.text}</span>
      </div>

      <div className="prediction-details">
        <div className="detail-item temperature-detail">
          <Thermometer size={18} />
          <div className="detail-content">
            <span className="detail-label">Temperature</span>
            <span className="detail-value">{prediction.temperature.toFixed(1)}°C</span>
          </div>
        </div>

        <div className="detail-item humidity-detail">
          <Droplets size={18} />
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{prediction.humidity.toFixed(0)}%</span>
          </div>
        </div>

        <div className="detail-item rainfall-detail">
          <Cloud size={18} />
          <div className="detail-content">
            <span className="detail-label">Rainfall</span>
            <span className="detail-value">{prediction.rainfall.toFixed(1)} mm</span>
          </div>
        </div>

        <div className="detail-item wind-detail">
          <Wind size={18} />
          <div className="detail-content">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{prediction.windSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
      </div>

      <div className="confidence-section">
        <span className="confidence-label">Confidence</span>
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ 
              width: `${prediction.confidence}%`,
              backgroundColor: getConfidenceColor(prediction.confidence)
            }}
          ></div>
        </div>
        <span className="confidence-value">{prediction.confidence.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default PredictionCard;
