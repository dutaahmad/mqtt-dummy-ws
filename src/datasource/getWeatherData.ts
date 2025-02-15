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
          console.log('RAW WEATHER DATA|', data);
          cachedWeatherData = JSON.parse(data);
          lastUpdated = Date.now();
          console.log('WEATHER DATA|', cachedWeatherData);
        } catch (error) {
          console.error('ERROR PARSING WEATHER DATA|', error);
        }
      });
    }).on('error', (err) => {
      console.error('ERROR FETCHING WEATHER DATA|', err);
    }).protocol = 'http:';
  };
