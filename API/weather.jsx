import {WEATHER_API_KEY} from "@env"
import axios from "axios";

const foreCastEndPoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${params.City}&days=${params.days}&aqi=no&alerts=no`;

const LocationEndPoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${params.City}`;

const apiCalls = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchWeatherForeCast = (params) => {
  return apiCalls(foreCastEndPoint(params));
};

export const fetchLocation = (params) => {
  return apiCalls(LocationEndPoint(params));
};
