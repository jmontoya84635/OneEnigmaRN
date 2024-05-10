import {View, Text, ScrollView, Image, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {images} from "../constants";
import CustomButton from "../components/custombutton";
import {Redirect, useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import axios from "axios";


const Index = () => {
    const router = useRouter();
    const [tokenValid, setTokenValid] = useState(null);

    useEffect(() => {
        const testToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("Token");
                if (!token) {
                    console.error("Token not found in SecureStore");
                    setTokenValid(false);
                    return;
                }
                const response = await axios.get("http://192.168.50.93:8000/api/verify/", {
                    headers: {
                        "Authorization": token,
                    },
                });
                if (response.status === 200) {
                    console.log("Token is valid here");
                    setTokenValid(true);
                }
            } catch (error) {
                if (error.response && error.response.data["detail"] === "Invalid token.") {
                    Alert.alert("Error", "Your login token has expired please login again.");
                    setTokenValid(false);
                    return;
                }
                Alert.alert("Error", "Could not connect to server");
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
                <View className="flex-1 justify-center items-center px-4">
                    <Image source={images.horizontal} resizeMode={"cover"} className={"w-full h-[100px]"}/>
                    <View className={"relative mt-80"}>
                        <Text className={"text-2xl font-pbold text-white text-center px-2"}>
                            Deciphering Conversations, One Enigma at a Time
                        </Text>
                    </View>
                    <View className={"mt-10 flex justify-around w-full flex-row"}>
                        <CustomButton
                            title={"Get Started"}
                            containerStyles={"h-1 w-[175px]"}
                            handlePress={() => {
                                router.push("/sign-up");
                            }}
                        />
                        <CustomButton
                            title={"Log in"}
                            containerStyles={"h-1 w-[175px]"}
                            handlePress={() => {
                                router.push("/sign-in");
                            }}
                        />
                    </View>

                    {/* Additional information or features */}
                </View>
            </ScrollView>
            <StatusBar backgroundColor={"161622"} style={"light"}/>
        </SafeAreaView>);
};
export default Index;
