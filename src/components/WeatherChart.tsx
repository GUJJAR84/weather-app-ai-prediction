import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { WeatherData, WeatherPrediction } from '../types/weather.types';
import './WeatherChart.css';

interface WeatherChartProps {
  historicalData: WeatherData[];
  predictions: WeatherPrediction[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ historicalData, predictions }) => {
  // Prepare chart data
  const prepareChartData = () => {
    // Take last 30 days of historical data
    const recentHistorical = historicalData.slice(-30);
    
    const chartData = recentHistorical.map(data => ({
      date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: parseFloat(data.temperature.toFixed(1)),
      humidity: parseFloat(data.humidity.toFixed(1)),
      rainfall: parseFloat(data.rainfall.toFixed(1)),
      windSpeed: parseFloat(data.windSpeed.toFixed(1)),
      type: 'historical'
    }));

    // Add predictions
    predictions.forEach(pred => {
      chartData.push({
        date: new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temperature: parseFloat(pred.temperature.toFixed(1)),
        humidity: parseFloat(pred.humidity.toFixed(1)),
        rainfall: parseFloat(pred.rainfall.toFixed(1)),
        windSpeed: parseFloat(pred.windSpeed.toFixed(1)),
        type: 'prediction'
      });
    });

    return chartData;
  };

  const chartData = prepareChartData();
  const splitIndex = chartData.findIndex(item => item.type === 'prediction');

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPrediction = payload[0].payload.type === 'prediction';
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-type">{isPrediction ? '📊 Prediction' : '📈 Historical'}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'Temperature' && '°C'}
              {entry.name === 'Humidity' && '%'}
              {entry.name === 'Rainfall' && ' mm'}
              {entry.name === 'Wind Speed' && ' m/s'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="weather-chart-container">
      {/* Temperature Chart */}
      <div className="chart-wrapper">
        <h3 className="chart-title">🌡️ Temperature Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {splitIndex > 0 && (
              <ReferenceLine 
                x={chartData[splitIndex - 1].date} 
                stroke="#666" 
                strokeDasharray="3 3"
                label={{ value: 'Forecast Start', position: 'top' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#ff6b6b"
              strokeWidth={2}
              fill="url(#colorTemp)"
              name="Temperature"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity Chart */}
      <div className="chart-wrapper">
        <h3 className="chart-title">💧 Humidity Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {splitIndex > 0 && (
              <ReferenceLine 
                x={chartData[splitIndex - 1].date} 
                stroke="#666" 
                strokeDasharray="3 3"
              />
            )}
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#4ecdc4"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Humidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rainfall Chart */}
      <div className="chart-wrapper">
        <h3 className="chart-title">🌧️ Rainfall Amount</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4a90e2" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {splitIndex > 0 && (
              <ReferenceLine 
                x={chartData[splitIndex - 1].date} 
                stroke="#666" 
                strokeDasharray="3 3"
              />
            )}
            <Area
              type="monotone"
              dataKey="rainfall"
              stroke="#4a90e2"
              strokeWidth={2}
              fill="url(#colorRain)"
              name="Rainfall"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Wind Speed Chart */}
      <div className="chart-wrapper">
        <h3 className="chart-title">💨 Wind Speed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {splitIndex > 0 && (
              <ReferenceLine 
                x={chartData[splitIndex - 1].date} 
                stroke="#666" 
                strokeDasharray="3 3"
              />
            )}
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="#95e1d3"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Wind Speed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
