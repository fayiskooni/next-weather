import { WeatherData } from "@/types/weather";
import { z } from "zod";

const weatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
    feels_like: z.number(),
  }),
  weather: z.array(
    z.object({
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
  }),
});

export async function getWeatherData(
  city: string
): Promise<{ data?: WeatherData; error?: string }> {
  try {
    if (!city.trim()) {
      return { error: "City name is required" };
    }
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${"c5d10d9679c11de2d79b300ef55e494c"}`
    );
    const place = await res.json();
    const lat = place[0].lat;
    const lon = place[0].lon;
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${"c5d10d9679c11de2d79b300ef55e494c"}`
    );
    if (!result.ok) {
      throw new Error("city not found");
    }
    const rawData = await result.json();
    const data = weatherSchema.parse(rawData);
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid weather data received" };
    }
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch weather data",
    };
  }
}
