import express from 'express';
import mqtt, { type IClientOptions } from 'mqtt';
import { getEnv } from './env';
import { CurrentSensorData, WaveSensorData, WeatherStationData } from './type';
import { cachedWeatherData, fetchWeatherData } from './datasource/getWeatherData';

const app = express();
const port = getEnv().APP_PORT;

/**
 * @constant {mqttConfig}
 * @description default mqtt client options to publish topics and will use the ws protocol
 * @example
 * // MQTT Setup
 * const mqttClient = mqtt.connect(mqttConfig);
 */
const mqttConfig: IClientOptions = {
    host: getEnv().MQTT_BROKER_URL,
    port: Number(getEnv().MQTT_BROKER_PORT_WS),
    username: getEnv().MQTT_ACCESS_USERNAME,
    password: getEnv().MQTT_ACCESS_PASSWORD,
    protocol: 'ws'
}

/**
 * @constant {MQTT_URL}
 * @description The MQTT URL to connect to. using this url will make the mqtt client connect to the broker using the mqtt protocol. or version mqttv311
 * @example
 * // MQTT Setup
    const mqttClient = mqtt.connect(MQTT_URL, {
        username: mqttConfig.username,
        password: mqttConfig.password,
    });
*/
const MQTT_URL = `mqtt://${mqttConfig.host}:1883`

// MQTT Setup
const mqttClient = mqtt.connect(mqttConfig);

// Function to publish cached weather data every second
const publishCachedWeatherData = () => {
    if (!cachedWeatherData) return;
    const windSpeed = 0 // filter value from BMKGWeatherResponse.cachedWeatherData.data[0].cuaca.element > currentTimestamp and cachedWeatherData.data[0].cuaca.element < tomorrow, when filter done get the value of ws
    const windDirection = 'N' // filter value from BMKGWeatherResponse.cachedWeatherData.data[0].cuaca.element > currentTimestamp and cachedWeatherData.data[0].cuaca.element < tomorrow, when filter done get the value of wd
    const temperature = 0 // filter value from BMKGWeatherResponse.cachedWeatherData.data[0].cuaca.element > currentTimestamp and cachedWeatherData.data[0].cuaca.element < tomorrow, when filter done get the value of t
    const humidity = 0 // filter value from BMKGWeatherResponse.cachedWeatherData.data[0].cuaca.element > currentTimestamp and cachedWeatherData.data[0].cuaca.element < tomorrow, when filter done get the value of hu
    const dummyWeatherStationData: WeatherStationData = {
        timestamp: new Date().toISOString(),
        windSpeed,
        windDirection: windDirection,
        temperature: temperature, // Random value between 0 and 10
        humidity: humidity, // Random value between 0 and 100
    };
    mqttClient.publish('sensor/weather-station', JSON.stringify(dummyWeatherStationData));
    console.log('PUBLISHED CACHED DATA|', {
        topic: 'sensor/weather-station',
        cachedWeatherData,
        mqttConfig
    });
};

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Publish current dummy data every second
    setInterval(() => {
        const dummyCurrentSensorData: CurrentSensorData = {
            timestamp: new Date().toISOString(),
            speed: Math.random() * 5, // Random value between 0 and 5
        };
        mqttClient.publish('sensor/current', JSON.stringify(dummyCurrentSensorData));
        console.log('PUBLISHED DUMMY DATA|', { topic: 'sensor/current', dummyCurrentSensorData, mqttConfig });
    }, 1000); // every second

    // Publish dummy wave and tide sensor data every second
    setInterval(() => {
        const dummyWaveSensorData: WaveSensorData = {
            timestamp: new Date().toISOString(),
            waveHeight: Math.random() * 10, // Random value between 0 and 10,
            tideLevel: Math.random() * 10, // Random value between 0 and 10,
        };
        mqttClient.publish('sensor/wave-tide', JSON.stringify(dummyWaveSensorData));
        console.log('PUBLISHED DUMMY DATA|', { topic: 'sensor/wave-tide', dummyWaveSensorData, mqttConfig });
    }, 1000); // every second

    // publish dummy weather station data every second
    // setInterval(() => {
    //     const dummyWeatherStationData: WeatherStationData = {
    //         timestamp: new Date().toISOString(),
    //         windSpeed: Math.random() * 10, // Random value between 0 and 10
    //         windDirection: Math.random() < 0.5 ? 'N' : 'S', // Random value between 0 and 10
    //         temperature: Math.random() * 10, // Random value between 0 and 10
    //         humidity: Math.random() * 100, // Random value between 0 and 100
    //     };
    //     mqttClient.publish('sensor/weather-station', JSON.stringify(dummyWeatherStationData));
    //     console.log('Published dummy weather station data:', { topic: 'sensor/weather-station', dummyWeatherStationData, mqttConfig });
    // }, 1000); // every second
    fetchWeatherData(); // Initial fetch
    setInterval(fetchWeatherData, 5 * 60 * 1000); // Fetch every 5 minutes
    setInterval(publishCachedWeatherData, 1000); // Send cached data every second
});

mqttClient.on('error', (err) => {
    console.error('MQTT CONNECTION ERROR|', err);
});

// Basic Express server
app.get('/', (req, res) => {
    res.send('Hello from the Express server! MQTT dummy data is being published every second.');
});

// Start the Express server
app.listen(port, () => {
    console.log('SERVER RUNNING STATUS|', {
        host: 'http://localhost',
        port,
        app_meta_data: {
            mqttClientStatus: mqttClient.connected ? 'CONNECTED' : 'DISCONNECTED',
            appStatus: 'RUNNING'
        }
    });
});
