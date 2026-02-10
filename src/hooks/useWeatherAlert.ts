import { useState, useEffect } from 'react';

/**
 * WEATHER-ADAPTIVE PHASE ALERT
 * Fetches weather data from Open-Meteo (free, no API key) for Rockdale County, GA.
 * Detects frost warnings (<= 34°F / 1.1°C) and extreme heat (>= 100°F / 37.8°C).
 * Includes precipitation, humidity, and water recommendations.
 */

// Rockdale County, GA coordinates (Conyers area)
const ROCKDALE_LAT = 33.6676;
const ROCKDALE_LON = -84.0188;

export interface WeatherAlert {
  type: 'frost' | 'heat' | 'storm';
  currentTempF: number;
  minTempF: number;
  maxTempF: number;
  message: string;
  actionNote: string;
}

export interface WaterRecommendation {
  level: 'low' | 'moderate' | 'high' | 'none';
  message: string;
  icon: string;
}

export interface WeatherData {
  currentTempF: number;
  minTempF: number;
  maxTempF: number;
  humidity: number;
  precipitationMm: number;
  precipitationChance: number;
  windMph: number;
  alerts: WeatherAlert[];
  waterRec: WaterRecommendation;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const celsiusToFahrenheit = (c: number): number => Math.round((c * 9 / 5) + 32);
const kmhToMph = (k: number): number => Math.round(k * 0.621371);

const getWaterRecommendation = (tempF: number, humidity: number, precipMm: number, precipChance: number): WaterRecommendation => {
  // Rain expected — skip watering
  if (precipMm > 5 || precipChance > 70) {
    return { level: 'none', message: 'Rain incoming — hold irrigation', icon: '🌧️' };
  }
  // Hot & dry — heavy water
  if (tempF >= 90 && humidity < 50) {
    return { level: 'high', message: 'Deep water early AM & mulch beds', icon: '💧💧' };
  }
  // Warm — standard water
  if (tempF >= 75) {
    return { level: 'moderate', message: 'Standard morning irrigation', icon: '💧' };
  }
  // Cool — light water
  if (tempF >= 50) {
    return { level: 'low', message: 'Light watering if soil is dry', icon: '🌱' };
  }
  // Cold — minimal
  return { level: 'none', message: 'Dormant phase — minimal water', icon: '❄️' };
};

export const useWeatherAlert = (): WeatherData => {
  const [data, setData] = useState<WeatherData>({
    currentTempF: 0,
    minTempF: 0,
    maxTempF: 0,
    humidity: 0,
    precipitationMm: 0,
    precipitationChance: 0,
    windMph: 0,
    alerts: [],
    waterRec: { level: 'moderate', message: 'Loading...', icon: '💧' },
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${ROCKDALE_LAT}&longitude=${ROCKDALE_LON}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,precipitation_probability_max&temperature_unit=celsius&timezone=America/New_York&forecast_days=3`
        );
        
        if (!res.ok) throw new Error('Weather API unavailable');
        
        const json = await res.json();
        
        const currentC = json.current?.temperature_2m ?? 0;
        const humidity = json.current?.relative_humidity_2m ?? 50;
        const currentPrecipMm = json.current?.precipitation ?? 0;
        const windKmh = json.current?.wind_speed_10m ?? 0;
        const minCs: number[] = json.daily?.temperature_2m_min ?? [];
        const maxCs: number[] = json.daily?.temperature_2m_max ?? [];
        const dailyPrecipSums: number[] = json.daily?.precipitation_sum ?? [];
        const dailyPrecipChance: number[] = json.daily?.precipitation_probability_max ?? [];
        
        const currentF = celsiusToFahrenheit(currentC);
        const minF = minCs.length > 0 ? celsiusToFahrenheit(Math.min(...minCs)) : currentF;
        const maxF = maxCs.length > 0 ? celsiusToFahrenheit(Math.max(...maxCs)) : currentF;
        const totalPrecipMm = dailyPrecipSums.length > 0 ? dailyPrecipSums[0] : currentPrecipMm;
        const precipChance = dailyPrecipChance.length > 0 ? dailyPrecipChance[0] : 0;
        const windMph = kmhToMph(windKmh);
        
        const alerts: WeatherAlert[] = [];
        
        if (minF <= 34) {
          alerts.push({
            type: 'frost',
            currentTempF: currentF,
            minTempF: minF,
            maxTempF: maxF,
            message: `Atmospheric Dissonance: Frost Warning (${minF}°F expected).`,
            actionNote: 'Deploy occultation tarps or row covers over Zone 4 Heart Chords immediately.',
          });
        }
        
        if (maxF >= 100) {
          alerts.push({
            type: 'heat',
            currentTempF: currentF,
            minTempF: minF,
            maxTempF: maxF,
            message: `Solar Overdrive: Extreme Heat Warning (${maxF}°F expected).`,
            actionNote: 'Increase Zone 2 Flow irrigation. Deploy shade cloth over Zone 3 Solar beds.',
          });
        }

        const waterRec = getWaterRecommendation(currentF, humidity, totalPrecipMm, precipChance);
        
        setData({
          currentTempF: currentF,
          minTempF: minF,
          maxTempF: maxF,
          humidity,
          precipitationMm: totalPrecipMm,
          precipitationChance: precipChance,
          windMph,
          alerts,
          waterRec,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch weather',
        }));
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
};
