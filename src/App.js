import React, { useState, useEffect } from "react";
import "./App.css"; // We'll create this file for styling

const API_KEY = "ba795d8bee6a3e29ea661f7b16354c3b"; // Your actual API key

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgClass, setBgClass] = useState("default-bg");

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      const trimmedCity = city.trim();
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}&units=metric`
      );

      const text = await res.text(); // Get raw response
      console.log("API raw response:", text); // Log for debugging

      if (!res.ok) throw new Error("City not found");

      const data = JSON.parse(text);
      setWeatherData(data);
      setError("");
      
      // Set background based on weather condition
      setBackgroundByWeather(data.weather[0].main);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setBackgroundByWeather = (weatherMain) => {
    const weatherType = weatherMain.toLowerCase();
    if (weatherType.includes("clear")) {
      setBgClass("clear-bg");
    } else if (weatherType.includes("cloud")) {
      setBgClass("cloudy-bg");
    } else if (weatherType.includes("rain") || weatherType.includes("drizzle")) {
      setBgClass("rainy-bg");
    } else if (weatherType.includes("snow")) {
      setBgClass("snowy-bg");
    } else if (weatherType.includes("thunderstorm")) {
      setBgClass("storm-bg");
    } else if (weatherType.includes("mist") || weatherType.includes("fog")) {
      setBgClass("misty-bg");
    } else {
      setBgClass("default-bg");
    }
  };

  return (
    <div className={`app-container ${bgClass}`}>
      <div className="glass-card">
        <h1 className="app-title">
          <span className="weather-icon">🌤️</span> Weather App
        </h1>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button 
            onClick={fetchWeather} 
            className="search-button"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Get Weather"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {weatherData && (
          <div className="weather-info fade-in">
            <h2 className="city-name">{weatherData.name}</h2>
            
            <div className="weather-icon-large">
              {getWeatherIcon(weatherData.weather[0].main)}
            </div>
            
            <div className="temperature">
              <span className="temp-value">{Math.round(weatherData.main.temp)}</span>
              <span className="temp-unit">°C</span>
            </div>
            
            <p className="weather-description">{weatherData.weather[0].description}</p>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-value">{weatherData.main.humidity}%</span>
                <span className="detail-label">Humidity</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🌬️</span>
                <span className="detail-value">{weatherData.wind.speed}</span>
                <span className="detail-label">Wind (m/s)</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <span className="detail-value">{weatherData.main.feels_like}°C</span>
                <span className="detail-label">Feels Like</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get appropriate weather icon
function getWeatherIcon(weatherMain) {
  const weather = weatherMain.toLowerCase();
  if (weather.includes("clear")) return "☀️";
  if (weather.includes("cloud")) return "☁️";
  if (weather.includes("rain") || weather.includes("drizzle")) return "🌧️";
  if (weather.includes("snow")) return "❄️";
  if (weather.includes("thunderstorm")) return "⛈️";
  if (weather.includes("mist") || weather.includes("fog")) return "🌫️";
  return "🌤️";
}

export default App;
