import React from 'react';
import { Activity, Target, TrendingUp, Clock } from 'lucide-react';
import { ModelMetrics } from '../types/weather.types';
import './MetricsPanel.css';

interface MetricsPanelProps {
  metrics: ModelMetrics;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getAccuracyGrade = (accuracy: number) => {
    if (accuracy >= 90) return { grade: 'A+', color: '#4caf50' };
    if (accuracy >= 80) return { grade: 'A', color: '#8bc34a' };
    if (accuracy >= 70) return { grade: 'B', color: '#ffc107' };
    if (accuracy >= 60) return { grade: 'C', color: '#ff9800' };
    return { grade: 'D', color: '#f44336' };
  };

  const accuracyGrade = getAccuracyGrade(metrics.accuracy);

  return (
    <div className="metrics-panel">
      <h3 className="metrics-title">Model Performance Metrics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card accuracy-card">
          <div className="metric-icon" style={{ backgroundColor: `${accuracyGrade.color}20` }}>
            <Target size={24} style={{ color: accuracyGrade.color }} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Model Accuracy</span>
            <span className="metric-value">{metrics.accuracy.toFixed(2)}%</span>
            <span className="metric-grade" style={{ color: accuracyGrade.color }}>
              Grade: {accuracyGrade.grade}
            </span>
          </div>
        </div>

        <div className="metric-card mae-card">
          <div className="metric-icon" style={{ backgroundColor: '#2196f320' }}>
            <Activity size={24} style={{ color: '#2196f3' }} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Mean Absolute Error</span>
            <span className="metric-value">{metrics.mae.toFixed(4)}</span>
            <span className="metric-subtitle">Lower is better</span>
          </div>
        </div>

        <div className="metric-card rmse-card">
          <div className="metric-icon" style={{ backgroundColor: '#9c27b020' }}>
            <TrendingUp size={24} style={{ color: '#9c27b0' }} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Root Mean Square Error</span>
            <span className="metric-value">{metrics.rmse.toFixed(4)}</span>
            <span className="metric-subtitle">Prediction variance</span>
          </div>
        </div>

        <div className="metric-card time-card">
          <div className="metric-icon" style={{ backgroundColor: '#ff572220' }}>
            <Clock size={24} style={{ color: '#ff5722' }} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Training Time</span>
            <span className="metric-value">{formatTime(metrics.trainingTime)}</span>
            <span className="metric-subtitle">Model training duration</span>
          </div>
        </div>
      </div>

      <div className="metrics-info">
        <div className="info-item">
          <span className="info-icon">ℹ️</span>
          <span className="info-text">
            The model uses a deep neural network with LSTM layers to analyze time-series weather patterns
            and make accurate predictions for the next 7 days.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
