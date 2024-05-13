import {View, Text, Alert, FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {useLocalSearchParams} from "expo-router";
import ChatBubble from "../../components/ChatBubble";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";


const Conversation = () => {
    const {id} = useLocalSearchParams();
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const ChatComponent = () => {
        return (
            <FlatList
                data={chats}
                renderItem={({item}) => {
                    return (
                        <ChatBubble prompt={item.prompt} response={item.response}/>
                    );
                }}
                keyExtractor={(item) => item.id}
            />
        );
    };

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            setChats({})
            try {
                const token = await SecureStore.getItemAsync("Token");
                const response = await axios.get("http://192.168.50.93:8000/api/chat/", {
                    headers: {
                        "Authorization": token,
                    },
                    params: {
                        id: id,
                    },
                });
                if (response.status === 200) {
                    setChats(response.data);
                    console.log("Chats", response.data);
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
                ? <Text className={"text-3xl"}>Loading...</Text>
                : <View clsssName={"px-4 h-full flex-1 justify-around"}>
                    <Text className={"text-5xl text-secondary font-psemibold text-center pt-4"}>Chat {id}</Text>
                    <ChatComponent/>
                    <View className={"mt-10"}>
                        <FormField title={"Enter your response"} placeholder={"Enter your response"} value={response}/>
                        <CustomButton title={"Send"} containerStyles={"mt-2"}/>
                    </View>

                </View>
            }
        </SafeAreaView>
    );
};
export default Conversation;
