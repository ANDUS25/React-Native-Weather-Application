import {
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome6,
  Fontisto,
} from "@expo/vector-icons";
import { debounce } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchLocation, fetchWeatherForeCast } from "../API/weather";

const Home = () => {
  const [showSearch, setShowSearch] = useState(true);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSpecificLocation = (loc) => {
    setLocations([]);
    setLoading(true);
    fetchWeatherForeCast({
      City: loc.name,
      days: "7",
    }).then((item) => setWeather(item));
    setLoading(false);
  };

  const handelTextSearch = (value) => {
    if (value.length > 2) {
      fetchLocation({ City: value }).then((item) => setLocations(item));
    }
  };

  const handleTextDebounce = useCallback(debounce(handelTextSearch, 1200), []);

  useEffect(() => {}, [locations]);

  return (
    <View className="flex-1 relative">
      <StatusBar hidden />

      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAFbxZO6nEHxbnNCPtx2NDxFt24f5eXZY4EN3dk9whZ9zKP6wHzkl601FMhbLvM6xaU_4&usqp=CAU",
        }}
        className="absolute h-full w-full"
        blurRadius={90}
      />

      {loading ? (
        <View className="flex-1 my-auto" style={{ height: 400 }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <ScrollView
          className="flex flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: "15%" }} className="mx-4 relative z-50">
            <View
              className="flex flex-row justify-end items-center rounded-full mt-4"
              style={{
                backgroundColor: showSearch ? "#eee7e7" : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  placeholder="Search City"
                  placeholderTextColor={"#424040"}
                  className="pl-6 h-10 flex-1 text-base"
                  onChangeText={handleTextDebounce}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => setShowSearch(!showSearch)}
                className="rounded-full p-3 m-1"
              >
                <FontAwesome name="search" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-1 mx-4">
              {locations && showSearch ? (
                <View className="absolute w-full bg-gray-200 rounded-3xl z-50 -top-8">
                  {locations.map((item, index) => {
                    const showBorder = locations.length !== index + 1;
                    const borderStyle = showBorder
                      ? "border-b-2 border-b-gray-400"
                      : "";
                    return (
                      <TouchableOpacity
                        key={index}
                        className={
                          "flex-row items-center border-0 p-3 px-4 mb-1 " +
                          borderStyle
                        }
                        onPress={() => handleSpecificLocation(item)}
                      >
                        <Feather name="map-pin" size={24} color="black" />
                        <Text className="text-black text-lg ml-2 flex-nowrap">
                          {item.country.length > 25
                            ? `${item.name}, ${item.country}... `
                            : `${item.name}, ${item.country}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}

              <View className="flex justify-around flex-1 my-8">
                <Text className="text-white text-center text-3xl font-bold">
                  {weather?.location?.name},
                  <Text className="text-lg font-semibold text-gray-300">
                    {weather?.location?.country}
                  </Text>
                </Text>
                <View className="flex-row justify-center">
                  <Image
                    source={{
                      uri: `https://${weather?.current?.condition?.icon}`,
                    }}
                    className="w-52 h-52"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-center font-bold text-white text-6xl ml-5">
                    {weather.current?.temp_c}°
                  </Text>
                  <Text className="text-center text-white text-xl tracking-widest">
                    {weather.current?.condition?.text}
                  </Text>
                </View>

                <View className="flex-row justify-between mx-4 my-8">
                  <View className="flex-row space-x-2 items-center">
                    <Feather name="wind" size={24} color="#545151" />
                    <Text className="text-white text-lg">
                      {weather?.current?.wind_kph}km
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <FontAwesome6 name="droplet" size={24} color="#545151" />
                    <Text className="text-white text-lg">
                      {weather?.current?.humidity}
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Fontisto name="day-sunny" size={24} color="#545151" />
                    <Text className="text-white text-lg">
                      {weather?.location?.localtime?.split(" ")[1]}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <EvilIcons name="calendar" size={32} color="#545151" />
                  <Text className="text-white text-base">Daily forecast</Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {weather?.forecast?.forecastday?.map((item, index) => {
                    return (
                      <View
                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-slate-500"
                        key={index}
                      >
                        <Image
                          source={{
                            uri: `https://${item?.day?.condition?.icon}`,
                          }}
                          className="h-11 w-11"
                        />
                        <Text className="text-white">
                          {moment(item?.date).format("dddd")}
                        </Text>

                        <Text className="text-white text-xl font-semibold">
                          {item.day?.avgtemp_c}°
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Home;
