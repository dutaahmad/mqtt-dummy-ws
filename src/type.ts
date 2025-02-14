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

/**
 * @description BMKG Weather API Response
 * @see https://data.bmkg.go.id/prakiraan-cuaca/
 * 
 * utc_datetime: Waktu dalam UTC-YYYY-MM-DD HH:mm:ss
 * 
 * local_datetime: Waktu lokal-YYYY-MM-DD HH:mm:ss
 * 
 * t: Suhu Udara dalam °C
 * 
 * hu: Kelembapan Udara dalam %
 * 
 * weather_desc: Kondisi Cuaca dalam Indonesia
 * 
 * weather_desc_en: Kondisi Cuaca dalam English
 * 
 * ws: Kecepatan Angin dalam km/jam
 * 
 * wd: Arah Angin dari
 * 
 * tcc: Tutupan Awan dalam %
 * 
 * vs_text: Jarak Pandang dalam km
 * 
 * analysis_date: Waktu produksi data prakiraan cuaca dalam UTC-YYYY-MM-DDTHH:mm:ss
 */
export interface BMKGWeatherResponse {
    lokasi: Lokasi;
    data: Datum[];
}

export interface Datum {
    lokasi: Lokasi;
    cuaca: Array<Cuaca[]>;
}

export interface Cuaca {
    datetime: Date;
    t: number;
    tcc: number;
    tp: number;
    weather: number;
    weather_desc: WeatherDesc;
    weather_desc_en: WeatherDescEn;
    wd_deg: number;
    wd: string;
    wd_to: string;
    ws: number;
    hu: number;
    vs: number;
    vs_text: VsText;
    time_index: string;
    analysis_date: Date;
    image: string;
    utc_datetime: Date;
    local_datetime: Date;
}

export enum VsText {
    The10KM = "> 10 km",
    The7KM = "< 7 km",
    The8KM = "< 8 km",
}

export enum WeatherDesc {
    Berawan = "Berawan",
    Cerah = "Cerah",
    HujanPetir = "Hujan Petir",
    HujanRingan = "Hujan Ringan",
}

export enum WeatherDescEn {
    LightRain = "Light Rain",
    MostlyCloudy = "Mostly Cloudy",
    Sunny = "Sunny",
    Thunderstorm = "Thunderstorm",
}

export interface Lokasi {
    adm1: string;
    adm2: string;
    adm3: string;
    adm4: string;
    provinsi: string;
    kotkab: string;
    kecamatan: string;
    desa: string;
    lon: number;
    lat: number;
    timezone: string;
    type?: string;
}


export type { WeatherStationData, WaveSensorData, CurrentSensorData };
