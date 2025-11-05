# AI Weather Forecasting System 🌤️

A professional, fully-functional weather forecasting application that uses artificial intelligence and machine learning to predict future weather conditions including temperature, humidity, rainfall, and wind speed.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-Latest-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Project Overview

This intelligent weather forecasting system leverages deep learning neural networks to analyze historical weather patterns and generate accurate 7-day weather predictions. The application provides real-time weather data, interactive visualizations, and AI-powered forecasts with confidence scores.

### Key Features

✨ **Real-time Weather Data**
- Fetches current weather conditions for any city worldwide
- Displays temperature, humidity, rainfall, and wind speed
- Beautiful weather cards with gradient designs

🤖 **AI-Powered Predictions**
- Deep neural network with LSTM-like architecture
- Time-series analysis with 7-day lookback window
- Confidence scoring for each prediction
- Model performance metrics (Accuracy, MAE, RMSE)

📊 **Interactive Data Visualization**
- Historical weather trends with Recharts
- Separate charts for temperature, humidity, rainfall, and wind speed
- Clear distinction between historical data and predictions
- Responsive and mobile-friendly design

💾 **Model Persistence**
- Save trained models to browser local storage
- Load previously trained models automatically
- No need to retrain on each visit

🎨 **Professional UI/UX**
- Modern gradient design with smooth animations
- Responsive layout for all screen sizes
- Intuitive user interface
- Loading states and error handling

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Machine Learning**: TensorFlow.js for browser-based neural networks
- **Data Visualization**: Recharts for interactive charts
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Lucide React for beautiful SVG icons
- **HTTP Client**: Axios for API requests
- **Date Handling**: date-fns for date manipulation

### Project Structure

```
weather-ai-forecast/
├── public/
│   ├── index.html              # Main HTML file
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico             # App icon
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── WeatherChart.tsx    # Chart visualization component
│   │   ├── WeatherChart.css    # Chart styles
│   │   ├── PredictionCard.tsx  # Prediction card component
│   │   ├── PredictionCard.css  # Prediction card styles
│   │   ├── MetricsPanel.tsx    # Model metrics display
│   │   └── MetricsPanel.css    # Metrics panel styles
│   ├── services/
│   │   ├── weatherAPI.service.ts   # Weather API integration
│   │   └── mlModel.service.ts      # ML model service
│   ├── types/
│   │   └── weather.types.ts    # TypeScript type definitions
│   ├── App.tsx                 # Root component
│   ├── App.css                 # Global app styles
│   ├── index.tsx               # App entry point
│   └── index.css               # Global CSS reset
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A modern web browser with JavaScript enabled

### Step 1: Clone or Extract Project

If you received this as a zip file, extract it. Otherwise:

```bash
git clone <repository-url>
cd weather-ai-forecast
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React-DOM
- TypeScript
- TensorFlow.js
- Recharts
- Axios
- Lucide React
- date-fns

### Step 3: Configure Weather API (Optional)

The application includes a demo mode with simulated data. For real weather data:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Open `src/services/weatherAPI.service.ts`
3. Replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
const API_KEY = 'your_actual_api_key_here';
```

### Step 4: Start Development Server

```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### Step 5: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 📖 How to Use

### 1. Search for a Location

- Enter a city name in the search bar (e.g., "London", "New York", "Tokyo")
- Click the "Search" button
- The app will fetch current weather data and historical patterns

### 2. Train the AI Model

- Once data is loaded, click the "Train AI Model & Predict" button
- The neural network will train on historical data (takes 10-30 seconds)
- Training progress is displayed
- Model metrics (Accuracy, MAE, RMSE) are shown after training

### 3. View Predictions

- After training, 7-day weather forecasts are displayed
- Each prediction card shows:
  - Day number and date
  - Weather condition with emoji
  - Temperature, humidity, rainfall, and wind speed
  - Confidence score with color-coded bar

### 4. Analyze Trends

- Scroll down to view interactive charts
- Charts show historical data (last 30 days) and predictions
- Different colors distinguish between past data and forecasts
- Hover over data points to see exact values

### 5. Model Persistence

- Trained models are automatically saved to browser storage
- On next visit, the app loads the saved model
- No need to retrain unless you want updated predictions

## 🧠 Machine Learning Model

### Model Architecture

The application uses a custom deep neural network built with TensorFlow.js:

```
Input Layer (46 neurons)
    ↓
Dense Layer (128 neurons, ReLU activation)
    ↓
Dropout (20%)
    ↓
Dense Layer (64 neurons, ReLU activation)
    ↓
Dropout (20%)
    ↓
Dense Layer (32 neurons, ReLU activation)
    ↓
Dropout (10%)
    ↓
Output Layer (4 neurons, Linear activation)
```

### Features Used

**Input Features (per time step):**
- Temperature (°C)
- Humidity (%)
- Rainfall (mm)
- Wind Speed (m/s)
- Atmospheric Pressure (hPa)
- Cloud Cover (%)

**Temporal Features:**
- Normalized month (0-1)
- Normalized day (0-1)
- Seasonal sine component
- Seasonal cosine component

**Lookback Window:** 7 days

### Training Process

1. **Data Preparation**
   - Historical weather data is collected (30-60 days)
   - Time-series sequences are created with 7-day windows
   - Features are normalized using z-score normalization

2. **Model Training**
   - Optimizer: Adam (learning rate: 0.001)
   - Loss function: Mean Squared Error
   - Metrics: Mean Absolute Error
   - Epochs: 50
   - Batch size: 16
   - Validation split: 20%

3. **Prediction**
   - Model predicts next day's weather
   - Prediction is added to historical data
   - Process repeats for 7 days
   - Confidence scores decrease with forecast distance

### Model Metrics Explained

- **Accuracy**: Overall model performance (0-100%)
  - 90%+ : Excellent (Grade A+)
  - 80-90% : Very Good (Grade A)
  - 70-80% : Good (Grade B)
  - 60-70% : Fair (Grade C)

- **MAE (Mean Absolute Error)**: Average prediction error
  - Lower is better
  - Represents typical deviation from actual values

- **RMSE (Root Mean Square Error)**: Prediction variance
  - Penalizes larger errors more heavily
  - Indicates prediction consistency

## 🎨 Customization

### Changing Colors

Edit the gradient colors in CSS files:

```css
/* Dashboard.css - Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your preferred colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Adjusting Prediction Days

In `Dashboard.tsx`, change the prediction length:

```typescript
const forecastPredictions = await mlService.predict(historicalData, 7);
// Change 7 to your desired number of days (1-30 recommended)
```

### Modifying Model Architecture

In `mlModel.service.ts`, adjust the neural network:

```typescript
model.add(tf.layers.dense({
  units: 128,  // Change number of neurons
  activation: 'relu',
  // ... other parameters
}));
```

### Adding More Weather Parameters

1. Update `weather.types.ts` to include new parameters
2. Modify `weatherAPI.service.ts` to fetch additional data
3. Update `mlModel.service.ts` to process new features
4. Add visualizations in `WeatherChart.tsx`

## 🔧 Configuration

### Model Hyperparameters

Adjust in `src/services/mlModel.service.ts`:

```typescript
// Training epochs
epochs: 50,  // Increase for better accuracy (slower training)

// Learning rate
tf.train.adam(0.001),  // Lower = slower but more stable

// Lookback window
lookback: 7,  // Days of history to consider

// Dropout rates
rate: 0.2,  // Higher = more regularization
```

### API Configuration

Modify in `src/services/weatherAPI.service.ts`:

```typescript
// API base URL
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Historical data days
days: 60,  // Increase for more training data
```

## 📱 Browser Compatibility

✅ **Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ **Partial Support:**
- Internet Explorer (not recommended)

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
npm run build
vercel --prod
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `build/` folder to [Netlify](https://app.netlify.com/)

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/weather-ai-forecast",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

## 🐛 Troubleshooting

### Issue: Model training is slow

**Solution:** This is normal for browser-based ML. Training typically takes 10-30 seconds. For faster training:
- Reduce epochs in `mlModel.service.ts`
- Use fewer historical data points
- Close other browser tabs

### Issue: API requests failing

**Solution:**
- Check if you've added a valid API key
- Verify internet connection
- Check browser console for error messages
- Try a different city name

### Issue: Charts not displaying

**Solution:**
- Ensure historical data is loaded before training
- Check browser console for errors
- Try refreshing the page
- Clear browser cache

### Issue: TypeScript errors

**Solution:**
```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

## 🔒 Security & Privacy

- All ML processing happens in your browser (client-side)
- No weather data is sent to external servers (except API calls)
- Trained models are stored locally in browser storage
- No user data is collected or tracked
- API keys should be kept secure (use environment variables in production)

## 📊 Performance Optimization

### Tips for Better Performance

1. **Reduce Chart Data Points**: Show only last 30 days instead of all data
2. **Lazy Loading**: Load components only when needed
3. **Memoization**: Use `React.memo()` for expensive components
4. **Web Workers**: Move ML training to a separate thread
5. **Code Splitting**: Split bundle using React.lazy()

### Current Bundle Size

- Main bundle: ~2.5 MB (development)
- Production build: ~800 KB (gzipped)
- TensorFlow.js: ~500 KB

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Improvement

- Add more weather parameters (UV index, visibility, etc.)
- Implement weather alerts and warnings
- Add historical weather comparison
- Create user accounts for saving preferences
- Add location-based automatic weather detection
- Implement PWA features for offline usage
- Add more ML models (LSTM, GRU, etc.)
- Create mobile app versions

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Weather AI Forecast

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Technical Documentation

### Component Hierarchy

```
App
└── Dashboard
    ├── SearchBar (integrated)
    ├── CurrentWeatherSection
    │   └── WeatherCard (x4)
    ├── AIModelSection
    │   └── MetricsPanel
    ├── ChartSection
    │   └── WeatherChart
    │       ├── TemperatureChart
    │       ├── HumidityChart
    │       ├── RainfallChart
    │       └── WindSpeedChart
    └── PredictionsSection
        └── PredictionCard (x7)
```

### State Management

The application uses React hooks for state management:

- `useState`: Local component state
- `useEffect`: Side effects and data fetching
- No external state management library needed (Redux, MobX, etc.)

### API Integration

Weather data is fetched from OpenWeatherMap API:

```typescript
// Current weather
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric

// Response includes:
// - Temperature, humidity, pressure
// - Wind speed and direction
// - Cloud cover
// - Rainfall data
// - Coordinates
```

## 🎓 Learning Resources

### Understanding the Code

- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **TensorFlow.js Guide**: https://www.tensorflow.org/js/guide
- **Recharts Documentation**: https://recharts.org/

### Machine Learning Concepts

- **Time Series Forecasting**: Understanding sequential data prediction
- **Neural Networks**: How layers and neurons work together
- **Normalization**: Why and how to scale data
- **Overfitting**: Understanding dropout and regularization

## 📞 Support & Contact

For questions, issues, or suggestions:

- Open an issue on GitHub
- Email: preetchechi100@gmail.com

## 🎉 Acknowledgments

- **OpenWeatherMap** for weather data API
- **TensorFlow.js** team for making ML accessible in browsers
- **React** team for the amazing framework
- **Recharts** for beautiful charting library
- All open-source contributors

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Multiple ML model comparison (LSTM, GRU, Transformer)
- [ ] Weather alerts and notifications
- [ ] Historical weather data export (CSV, JSON)
- [ ] Advanced statistical analysis
- [ ] Multi-location comparison
- [ ] Weather radar integration
- [ ] Hourly forecasts
- [ ] Seasonal trends analysis

### Version 3.0 (Future)

- [ ] Mobile app (React Native)
- [ ] User accounts and preferences
- [ ] API for third-party integrations
- [ ] Premium features (extended forecasts, etc.)
- [ ] Community weather reports
- [ ] AI chatbot for weather queries

---

## 📝 Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open browser to http://localhost:3000

# 4. Enter a city name and search

# 5. Click "Train AI Model & Predict"

# 6. View predictions and charts

# 7. Build for production
npm run build
```

---

**Made with ❤️ using React, TypeScript, and TensorFlow.js**

**Version:** 1.0.0  
**Last Updated:** 2025

---
