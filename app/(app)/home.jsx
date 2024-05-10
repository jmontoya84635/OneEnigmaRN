import {View, Text, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const Home = () => {


    const [conversations, setConversations] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getChats = async () => {
            let token;
            try {
                token = await SecureStore.getItemAsync("Token");
            } catch (e) {
                Alert.alert("Error", "Could not get token, Please login again.");
                return null;
            }
            setLoading(true);
            try {
                const response = await axios.get("http://192.168.50.93:8000/api/conversations/", {
                    headers: {
                        "Authorization": token,
                    },
                });
                if (response.status === 200) {
                    console.log("Chats", response.data);
                    setConversations(response.data);
                } else {
                    Alert.alert("Error", "Could not get chats, Server error.");
                    setError(true);
                }
            } catch (e) {
                console.error("Error", e.message);
                Alert.alert("Error", "Could not get chats, Serer error.");
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        getChats()
    }, []);

    return (
        <SafeAreaView className={"bg-primary h-full flex-1"}>
            {loading
                ? <Text>Loading...</Text>
                : <Text>Loaded</Text>
            }
        </SafeAreaView>
    );
};
export default Home;
