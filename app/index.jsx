import {View, Text, ScrollView, Image, Alert} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {images} from "../constants";
import CustomButton from "../components/custombutton";
import {Redirect, useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import "react-native-polyfill-globals/auto";
import LottieView from "lottie-react-native";
import Logo from "../components/logo"

const Index = () => {
    const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
    const router = useRouter();
    const [tokenValid, setTokenValid] = useState(null);

    const animation = useRef(null);
    useEffect(() => {
        const testToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("Token");
                if (!token) {
                    setTokenValid(false);
                    return;
                }
                const response = await axios.get(`${API_HOST}/auth/verify`, {
                    headers: {
                        "Content-Type": "application/json", "Authorization": token,
                    },
                });
                if (response.status === 200) {
                    setTokenValid(true);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        Alert.alert("Error", "Credentials are not correct");
                    }
                    Alert.alert("Error", error.response.data.detail);
                } else {
                    Alert.alert("Error", "Could not connect to server");
                }
            }
        };
        testToken();
    }, []);

    if (tokenValid === true) {
        return <Redirect href={"/home"}/>;
    }

    return (<SafeAreaView className={"bg-primary h-full"}>
        <ScrollView
            contentContainerStyle={{
                height: "95%", display: "flex",
            }}>
            <View className="flex-1  justify-center items-center px-4">
                <Logo/>
                <LottieView
                    className={"mt-10"}
                    autoPlay
                    ref={animation}
                    style={{
                        width: 300, height: 300,
                    }}
                    source={require("../assets/chat_animation.json")}
                />

                <View className={"relative mt-10"}>
                    <Text className={"text-2xl font-pbold text-white text-center px-2"}>
                        Deciphering Conversations, One Enigma at a Time
                    </Text>
                </View>
                <View className={"mt-10 flex justify-around w-full flex-row"}>
                    <CustomButton
                        title={"Get Started"}
                        containerStyles={"h-1 w-[45%]"}
                        handlePress={() => {
                            router.push("/sign-up");
                        }}
                    />
                    <CustomButton
                        title={"Log in"}
                        containerStyles={"h-1 w-[45%]"}
                        handlePress={() => {
                            router.push("/sign-in");
                        }}
                    />
                </View>
            </View>
        </ScrollView>
        <StatusBar backgroundColor={"transparent"} style={"light"}/>
    </SafeAreaView>);
};
export default Index;
