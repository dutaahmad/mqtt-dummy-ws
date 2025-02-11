import express from 'express';
import mqtt, { type IClientOptions } from 'mqtt';
import { getEnv } from './env';
import { CurrentSensorData, WaveSensorData, WeatherStationData } from './type';

const app = express();
const port = 8000;
const mqttConfig: IClientOptions = {
    host: getEnv().MQTT_BROKER_URL,
    port: Number(getEnv().MQTT_BROKER_PORT_WS),
    username: getEnv().MQTT_ACCESS_USERNAME,
    password: getEnv().MQTT_ACCESS_PASSWORD,
    protocol: 'ws',
}

// const MQTT_URL = 

// MQTT Setup
const mqttClient = mqtt.connect(mqttConfig);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Publish current dummy data every second
    setInterval(() => {
        const dummyCurrentSensorData: CurrentSensorData = {
            timestamp: new Date().toISOString(),
            speed: Math.random() * 5, // Random value between 0 and 5
        };
        mqttClient.publish('sensor/current', JSON.stringify(dummyCurrentSensorData));
        console.log('Published dummy data:', { dummyCurrentSensorData, mqttConfig });
    }, 1000); // every second

    // Publish dummy wave and tide sensor data every second
    setInterval(() => {
        const dummyWaveSensorData: WaveSensorData = {
            timestamp: new Date().toISOString(),
            waveHeight: Math.random() * 10, // Random value between 0 and 10,
            tideLevel: Math.random() * 10, // Random value between 0 and 10,
        };
        mqttClient.publish('sensor/wave-tide', JSON.stringify(dummyWaveSensorData));
        console.log('Published dummy wave and tide data:', { dummyWaveSensorData, mqttConfig });
    }, 1000); // every second

    // publish dummy weather station data every second
    setInterval(() => {
        const dummyWeatherStationData: WeatherStationData = {
            timestamp: new Date().toISOString(),
            windSpeed: Math.random() * 10, // Random value between 0 and 10
            windDirection: Math.random() < 0.5 ? 'N' : 'S', // Random value between 0 and 10
            temperature: Math.random() * 10, // Random value between 0 and 10
            humidity: Math.random() * 100, // Random value between 0 and 100
        };
        mqttClient.publish('sensor/weather-station', JSON.stringify(dummyWeatherStationData));
        console.log('Published dummy weather station data:', { dummyWeatherStationData, mqttConfig });
    }, 1000); // every second
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

// Basic Express server
app.get('/', (req, res) => {
    res.send('Hello from the Express server! MQTT dummy data is being published every second.');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
});
