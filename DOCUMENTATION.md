# Weather Forecasting AI - Complete Technical Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Machine Learning Model](#machine-learning-model)
3. [API Integration](#api-integration)
4. [Component Documentation](#component-documentation)
5. [Service Layer](#service-layer)
6. [Data Flow](#data-flow)
7. [Deployment Guide](#deployment-guide)
8. [Testing Guide](#testing-guide)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application Layer                  │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Dashboard  │  │  Charts    │  │ Prediction │     │  │
│  │  │ Component  │  │ Component  │  │   Cards    │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │                                                        │  │
│  │  ┌────────────────┐      ┌──────────────────┐       │  │
│  │  │ Weather API    │      │  ML Model        │       │  │
│  │  │ Service        │      │  Service         │       │  │
│  │  └────────────────┘      └──────────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
│                     ↕                    ↕                   │
│  ┌──────────────────────┐  ┌────────────────────────────┐ │
│  │  OpenWeatherMap API  │  │  TensorFlow.js Engine      │ │
│  │  (External)          │  │  (Browser ML Processing)   │ │
│  └──────────────────────┘  └────────────────────────────┘ │
│                                          ↕                   │
│                     ┌──────────────────────────┐           │
│                     │  Browser Local Storage   │           │
│                     │  (Model Persistence)     │           │
│                     └──────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 18.2.0 | UI component management |
| Language | TypeScript | 4.9.5 | Type safety and better DX |
| ML Engine | TensorFlow.js | 4.x | Neural network processing |
| Charting | Recharts | 2.x | Data visualization |
| HTTP Client | Axios | 1.x | API requests |
| Icons | Lucide React | Latest | SVG icon library |
| Date Utils | date-fns | 2.x | Date formatting |
| Build Tool | Create React App | 5.x | Build configuration |

---

## 2. Machine Learning Model

### 2.1 Model Architecture

The neural network is a fully connected deep learning model designed for time-series forecasting:

```
Layer Type          Output Shape       Activation    Parameters
─────────────────────────────────────────────────────────────────
Input               (batch, 46)        -             0
Dense               (batch, 128)       ReLU          6,016
Dropout (0.2)       (batch, 128)       -             0
Dense               (batch, 64)        ReLU          8,256
Dropout (0.2)       (batch, 64)        -             0
Dense               (batch, 32)        ReLU          2,080
Dropout (0.1)       (batch, 32)        -             0
Dense               (batch, 4)         Linear        132
─────────────────────────────────────────────────────────────────
Total Parameters: 16,484
Trainable Parameters: 16,484
```

### 2.2 Input Features

**Time-Series Window Features (7 days × 6 features = 42 features):**
```javascript
For each day in the 7-day lookback window:
  1. Temperature (°C)
  2. Humidity (%)
  3. Rainfall (mm)
  4. Wind Speed (m/s)
  5. Atmospheric Pressure (hPa)
  6. Cloud Cover (%)
```

**Temporal Features (4 features):**
```javascript
7. Normalized Month: month / 12
8. Normalized Day: day / 31
9. Seasonal Sine: sin(2π × month / 12)
10. Seasonal Cosine: cos(2π × month / 12)
```

**Total Input Features: 46**

### 2.3 Output Predictions

The model predicts 4 key weather parameters for the next day:

```javascript
1. Temperature (°C)
2. Humidity (%)
3. Rainfall (mm)
4. Wind Speed (m/s)
```

### 2.4 Training Process

**Step-by-Step Training:**

```typescript
1. Data Preparation
   ├── Fetch 60 days of historical weather data
   ├── Create sliding windows (7-day lookback)
   ├── Extract features for each window
   └── Normalize data using z-score normalization

2. Model Compilation
   ├── Optimizer: Adam (learning rate: 0.001)
   ├── Loss Function: Mean Squared Error (MSE)
   └── Metrics: Mean Absolute Error (MAE)

3. Training Loop (50 epochs)
   ├── Batch Size: 16
   ├── Validation Split: 20%
   ├── Shuffle: True
   └── Early stopping: None (runs full 50 epochs)

4. Model Evaluation
   ├── Calculate final MSE
   ├── Calculate final MAE
   ├── Calculate RMSE
   └── Convert metrics to accuracy percentage

5. Model Persistence
   ├── Save model to browser LocalStorage
   ├── Save normalization parameters
   └── Set training status flag
```

### 2.5 Prediction Process

**Multi-Step Forecasting (7 days):**

```typescript
For each prediction day (1 to 7):
  1. Take last 7 days of data (historical + previous predictions)
  2. Extract features from the 7-day window
  3. Add temporal features for target date
  4. Normalize input features
  5. Feed into neural network
  6. Get normalized prediction
  7. Denormalize prediction to actual values
  8. Calculate confidence score (decreases with distance)
  9. Add prediction to data pool for next iteration
  10. Repeat for next day
```

### 2.6 Normalization

**Z-Score Normalization Formula:**

```
normalized_value = (value - mean) / std_deviation

Where:
- mean: Average of all values in training data
- std_deviation: Standard deviation of training data
```

**Why Normalization?**
- Ensures all features are on similar scales
- Prevents features with larger values from dominating
- Improves training stability and convergence speed
- Results in better model performance

### 2.7 Model Metrics

**Accuracy Calculation:**
```javascript
accuracy = max(0, min(100, 100 - MAE × 10))

Example:
- If MAE = 1.5, accuracy = 85%
- If MAE = 2.0, accuracy = 80%
- If MAE = 3.0, accuracy = 70%
```

**Metric Definitions:**

- **MAE (Mean Absolute Error)**: Average absolute difference between predicted and actual values
  - Lower is better
  - Easy to interpret (same units as target variable)
  
- **RMSE (Root Mean Square Error)**: Square root of average squared differences
  - Penalizes larger errors more heavily
  - Useful for identifying outliers
  
- **Accuracy**: Custom metric representing model performance as percentage
  - Based on MAE
  - More intuitive for users

### 2.8 Confidence Scoring

```javascript
confidence = max(60, min(95, 85 - (dayIndex × 3)))

Day 1: 85% confidence
Day 2: 82% confidence
Day 3: 79% confidence
Day 4: 76% confidence
Day 5: 73% confidence
Day 6: 70% confidence
Day 7: 67% confidence
```

---

## 3. API Integration

### 3.1 OpenWeatherMap API

**Base URL:**
```
https://api.openweathermap.org/data/2.5
```

**Endpoints Used:**

1. **Current Weather**
```http
GET /weather?q={city}&appid={API_KEY}&units=metric

Response:
{
  "main": {
    "temp": 15.5,
    "humidity": 72,
    "pressure": 1013
  },
  "wind": {
    "speed": 3.5
  },
  "clouds": {
    "all": 40
  },
  "rain": {
    "1h": 0.5
  }
}
```

### 3.2 API Service Implementation

```typescript
class WeatherAPIService {
  // Fetch current weather for a city
  static async getCurrentWeather(city: string): Promise<WeatherData>

  // Generate historical data (simulated for demo)
  static async getHistoricalWeather(city: string, days: number): Promise<WeatherData[]>

  // Get location coordinates
  static async getLocationData(city: string): Promise<LocationData>
}
```

### 3.3 Error Handling

```typescript
try {
  const data = await WeatherAPIService.getCurrentWeather(city);
  // Process data
} catch (error) {
  if (error.response?.status === 404) {
    // City not found
  } else if (error.response?.status === 401) {
    // Invalid API key
  } else {
    // Network or other error
  }
}
```

---

## 4. Component Documentation

### 4.1 Dashboard Component

**Purpose:** Main container component managing application state and data flow

**Props:** None (root component)

**State Variables:**

```typescript
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
```

**Key Methods:**

```typescript
// Fetch weather data for a city
fetchWeatherData(cityName: string): Promise<void>

// Train model and generate predictions
trainAndPredict(): Promise<void>

// Handle search form submission
handleSearch(e: React.FormEvent): void

// Load initial data on mount
loadInitialData(): Promise<void>
```

### 4.2 WeatherChart Component

**Purpose:** Visualize historical and predicted weather data

**Props:**
```typescript
interface WeatherChartProps {
  historicalData: WeatherData[];
  predictions: WeatherPrediction[];
}
```

**Features:**
- 4 separate charts (Temperature, Humidity, Rainfall, Wind Speed)
- Interactive tooltips
- Reference line separating historical vs predicted data
- Responsive design

### 4.3 PredictionCard Component

**Purpose:** Display individual day prediction

**Props:**
```typescript
interface PredictionCardProps {
  prediction: WeatherPrediction;
  day: number;
}
```

**Features:**
- Weather emoji based on conditions
- All 4 weather parameters
- Color-coded confidence bar
- Formatted dates

### 4.4 MetricsPanel Component

**Purpose:** Display model performance metrics

**Props:**
```typescript
interface MetricsPanelProps {
  metrics: ModelMetrics;
}
```

**Features:**
- 4 metric cards (Accuracy, MAE, RMSE, Training Time)
- Color-coded grades
- Hover effects
- Explanatory text

---

## 5. Service Layer

### 5.1 MLModelService

**Purpose:** Manage neural network model lifecycle

**Public Methods:**

```typescript
// Create and train the model
async trainModel(historicalData: WeatherData[]): Promise<ModelMetrics>

// Generate predictions
async predict(historicalData: WeatherData[], days: number): Promise<WeatherPrediction[]>

// Save trained model to storage
async saveModel(): Promise<void>

// Load model from storage
async loadModel(): Promise<boolean>

// Check if model is ready
isModelReady(): boolean
```

**Private Methods:**

```typescript
// Create neural network architecture
private createModel(inputShape: number): tf.LayersModel

// Normalize data
private normalizeData(data: number[][]): { normalized, mean, std }

// Denormalize predictions
private denormalize(data: number[], mean: number[], std: number[]): number[]

// Prepare training data
private prepareTrainingData(historicalData, lookback): { features, labels }
```

### 5.2 WeatherAPIService

**Purpose:** Interface with weather data API

**Public Methods:**

```typescript
// Get current weather
static async getCurrentWeather(city: string): Promise<WeatherData | null>

// Get historical weather
static async getHistoricalWeather(city: string, days: number): Promise<WeatherData[]>

// Get location data
static async getLocationData(city: string): Promise<LocationData | null>
```

**Private Methods:**

```typescript
// Generate simulated historical data
private static generateHistoricalData(current: WeatherData, days: number): WeatherData[]
```

---

## 6. Data Flow

### 6.1 Application Initialization

```
1. App Component Mounts
   ↓
2. Dashboard Component Mounts
   ↓
3. useEffect Hook Triggers
   ↓
4. loadInitialData() Called
   ↓
5. Try to Load Saved Model
   ├── Success → Model Ready
   └── Fail → Model Needs Training
   ↓
6. Fetch Default City Weather (London)
   ↓
7. Display Initial Data
```

### 6.2 User Search Flow

```
1. User Enters City Name
   ↓
2. Clicks Search Button
   ↓
3. handleSearch() Called
   ↓
4. fetchWeatherData(cityName) Called
   ↓
5. API Request to OpenWeatherMap
   ├── Success → Update State
   └── Fail → Show Error
   ↓
6. Display Current Weather
   ↓
7. Generate Historical Data
   ↓
8. Update Charts
```

### 6.3 Model Training Flow

```
1. User Clicks "Train AI Model & Predict"
   ↓
2. trainAndPredict() Called
   ↓
3. Check Historical Data Available
   ↓
4. Initialize MLModelService
   ↓
5. Prepare Training Data
   ├── Create time series windows
   ├── Extract features
   └── Normalize data
   ↓
6. Train Neural Network
   ├── 50 epochs
   ├── Batch size 16
   └── Validation split 20%
   ↓
7. Calculate Metrics
   ↓
8. Save Model to LocalStorage
   ↓
9. Generate 7-Day Predictions
   ├── Day 1 prediction
   ├── Day 2 prediction (uses Day 1 result)
   ├── ... (iterative)
   └── Day 7 prediction
   ↓
10. Display Predictions
   ↓
11. Update Charts with Forecast Data
```

### 6.4 State Management Flow

```
Parent State (Dashboard)
├── city → Current city name
├── historicalData → Past weather records
├── predictions → Future predictions
├── metrics → Model performance
├── currentWeather → Latest weather
└── Various flags (isLoading, isTraining, error)
    ↓
Props Passed to Children
├── WeatherChart
│   ├── historicalData
│   └── predictions
├── PredictionCard
│   ├── prediction (individual)
│   └── day
└── MetricsPanel
    └── metrics
```

---

## 7. Deployment Guide

### 7.1 Production Build

```bash
# Install dependencies
npm install

# Create optimized build
npm run build

# Output directory: build/
# Contains: HTML, CSS, JS, and assets
```

### 7.2 Environment Variables

Create `.env` file in root:

```bash
REACT_APP_WEATHER_API_KEY=your_api_key_here
REACT_APP_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

Update `weatherAPI.service.ts`:

```typescript
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
```

### 7.3 Deployment Platforms

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Custom domain
vercel domains add yourdomain.com
```

#### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### AWS S3 + CloudFront

```bash
# Build project
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload build
aws s3 sync build/ s3://your-bucket-name

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html

# Create CloudFront distribution
aws cloudfront create-distribution --origin-domain-name your-bucket-name.s3.amazonaws.com
```

### 7.4 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
# Build Docker image
docker build -t weather-ai-forecast .

# Run container
docker run -p 80:80 weather-ai-forecast
```

---

## 8. Testing Guide

### 8.1 Unit Testing

Create test file `src/services/mlModel.service.test.ts`:

```typescript
import { MLModelService } from './mlModel.service';

describe('MLModelService', () => {
  let service: MLModelService;

  beforeEach(() => {
    service = new MLModelService();
  });

  test('should create model instance', () => {
    expect(service).toBeDefined();
  });

  test('should normalize data correctly', () => {
    const data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const result = service['normalizeData'](data);
    expect(result.normalized).toBeDefined();
    expect(result.mean).toHaveLength(3);
    expect(result.std).toHaveLength(3);
  });
});
```

Run tests:

```bash
npm test
```

### 8.2 Integration Testing

Test full workflow:

```typescript
describe('Weather Forecast Integration', () => {
  test('should fetch weather and train model', async () => {
    const city = 'London';
    
    // Fetch weather
    const weather = await WeatherAPIService.getCurrentWeather(city);
    expect(weather).toBeDefined();
    
    // Get historical data
    const historical = await WeatherAPIService.getHistoricalWeather(city, 30);
    expect(historical.length).toBeGreaterThan(0);
    
    // Train model
    const mlService = new MLModelService();
    const metrics = await mlService.trainModel(historical);
    expect(metrics.accuracy).toBeGreaterThan(0);
    
    // Generate predictions
    const predictions = await mlService.predict(historical, 7);
    expect(predictions).toHaveLength(7);
  });
});
```

### 8.3 Manual Testing Checklist

- [ ] Search for different cities
- [ ] Train model with various data amounts
- [ ] Check predictions accuracy
- [ ] Test responsive design on mobile
- [ ] Verify charts display correctly
- [ ] Test error handling (invalid city, no internet)
- [ ] Check model persistence (reload page)
- [ ] Test with slow network
- [ ] Verify all animations work
- [ ] Check accessibility (keyboard navigation)

---

## 9. Performance Optimization

### 9.1 Code Splitting

```typescript
// Lazy load heavy components
const WeatherChart = React.lazy(() => import('./components/WeatherChart'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <WeatherChart data={historicalData} />
</Suspense>
```

### 9.2 Memoization

```typescript
// Memoize expensive calculations
const chartData = useMemo(() => {
  return prepareChartData(historicalData, predictions);
}, [historicalData, predictions]);

// Memoize components
const PredictionCard = React.memo(({ prediction, day }) => {
  // Component code
});
```

### 9.3 TensorFlow.js Optimization

```typescript
// Use WebGL backend for faster training
await tf.setBackend('webgl');

// Dispose tensors to prevent memory leaks
const tensor = tf.tensor([1, 2, 3]);
// Use tensor
tensor.dispose();

// Batch predictions
const predictions = model.predict(tf.tensor2d(features));
```

### 9.4 Bundle Size Optimization

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Run analysis
npm run build
npm run analyze
```

---

## 10. Troubleshooting

### 10.1 Common Issues

**Issue: Model training very slow**

Solution:
- Reduce epochs from 50 to 20
- Decrease batch size
- Use smaller historical dataset
- Close other browser tabs

**Issue: Memory errors during training**

Solution:
```typescript
// Dispose tensors properly
tf.tidy(() => {
  // Training code here
  // Automatic cleanup
});
```

**Issue: Predictions not accurate**

Solution:
- Increase training epochs
- Add more historical data
- Check data quality
- Verify normalization is working

**Issue: Charts not rendering**

Solution:
- Check console for errors
- Verify data format
- Ensure Recharts is installed
- Check responsive container width

### 10.2 Debug Mode

Enable debug logging:

```typescript
// In mlModel.service.ts
const DEBUG = true;

if (DEBUG) {
  console.log('Training data:', features);
  console.log('Model summary:', model.summary());
  console.log('Predictions:', predictions);
}
```

### 10.3 Performance Monitoring

```typescript
// Measure training time
console.time('Model Training');
await mlService.trainModel(historicalData);
console.timeEnd('Model Training');

// Measure prediction time
console.time('Prediction');
await mlService.predict(historicalData, 7);
console.timeEnd('Prediction');
```

---

## Conclusion

This documentation covers all aspects of the Weather Forecasting AI application. For additional support:

- Check inline code comments
- Review React DevTools for component state
- Use TensorFlow.js debugger for model issues
- Monitor network tab for API problems

**Version:** 1.0.0  
**Last Updated:** 2025
