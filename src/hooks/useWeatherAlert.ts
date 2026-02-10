import { useState, useEffect } from 'react';

/**
 * WEATHER-ADAPTIVE PHASE ALERT
 * Fetches weather data from Open-Meteo (free, no API key) for Rockdale County, GA.
 * Detects frost warnings (<= 34°F / 1.1°C) and extreme heat (>= 100°F / 37.8°C).
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

export interface WeatherData {
  currentTempF: number;
  minTempF: number;
  maxTempF: number;
  alerts: WeatherAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const celsiusToFahrenheit = (c: number): number => Math.round((c * 9 / 5) + 32);

export const useWeatherAlert = (): WeatherData => {
  const [data, setData] = useState<WeatherData>({
    currentTempF: 0,
    minTempF: 0,
    maxTempF: 0,
    alerts: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${ROCKDALE_LAT}&longitude=${ROCKDALE_LON}&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&temperature_unit=celsius&timezone=America/New_York&forecast_days=3`
        );
        
        if (!res.ok) throw new Error('Weather API unavailable');
        
        const json = await res.json();
        
        const currentC = json.current?.temperature_2m ?? 0;
        const minCs: number[] = json.daily?.temperature_2m_min ?? [];
        const maxCs: number[] = json.daily?.temperature_2m_max ?? [];
        
        const currentF = celsiusToFahrenheit(currentC);
        const minF = minCs.length > 0 ? celsiusToFahrenheit(Math.min(...minCs)) : currentF;
        const maxF = maxCs.length > 0 ? celsiusToFahrenheit(Math.max(...maxCs)) : currentF;
        
        const alerts: WeatherAlert[] = [];
        
        // Frost warning: any daily min <= 34°F in next 3 days
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
        
        // Heat alert: any daily max >= 100°F
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
        
        setData({
          currentTempF: currentF,
          minTempF: minF,
          maxTempF: maxF,
          alerts,
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
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
};
