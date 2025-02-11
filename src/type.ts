type WeatherStationData = {
    timestamp: string;
    windSpeed: number;
    windDirection: string;
    temperature: number;
    humidity: number;
};

type WaveSensorData = {
    timestamp: string;
    waveHeight: number;
    tideLevel: number;
};

type CurrentSensorData = {
    timestamp: string;
    speed: number;
};

export type { WeatherStationData, WaveSensorData, CurrentSensorData };
