import http from 'http';
import { BMKGWeatherResponse } from '../type';

export const WEATHER_API_URL = 'http://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.02.19.2013';

export let cachedWeatherData: BMKGWeatherResponse | null = null; // Store latest fetched data
let lastUpdated: number = 0; // Timestamp for last update

// Function to fetch new weather data
export const fetchWeatherData = () => {
    http.get(WEATHER_API_URL, (res) => {
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        try {
          cachedWeatherData = JSON.parse(data);
          lastUpdated = Date.now();
          console.log('Weather data updated:', cachedWeatherData);
        } catch (error) {
          console.error('Error parsing weather data:', error);
        }
      });
    }).on('error', (err) => {
      console.error('Error fetching weather data:', err);
    });
  };
