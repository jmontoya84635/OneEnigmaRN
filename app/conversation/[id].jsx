import {View, Text, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {useLocalSearchParams} from "expo-router";

const Conversation = () => {
    const {id} = useLocalSearchParams();
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync("Token");
                const response = await axios.get("http://192.168.50.93:8000/api/chat/", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                    data: {
                        id: id,
                    },
                });
                if (response.status === 200) {
                    setChats(response.data);
                    console.log("Chats", response.data)
                } else {
                    Alert.alert("Error", "Could not get chats, Server error.");
                }
            } catch (e) {
                Alert.alert("Error", e.message);
            } finally {
                setLoading(false);
            }
        };
        getChats();
    }, []);

    return (
        <SafeAreaView className={"bg-primary h-full"}>
            {loading
                ? <Text>Loading...</Text>
                : <View>
                    <Text>Hello {id}</Text>
                </View>
            }
        </SafeAreaView>
    );
};
export default Conversation;
