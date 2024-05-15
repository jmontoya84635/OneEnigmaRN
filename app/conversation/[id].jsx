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
    const [chatLoading, setChatLoading] = useState(false);
    const [response, setResponse] = useState("");
    const ChatComponent = () => {
        return (
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                    return (
                        <>
                            <ChatBubble message={item.prompt} role={"user"}/>
                            <ChatBubble message={item.response} role={"bot"} />
                        </>
                    );
                }}
            />
        );
    };

    const submitResponse = async () => {
        try {
            setResponse("");
            setChatLoading(true);
            console.log(chats)
            const token = await SecureStore.getItemAsync("Token");
            const reply = await axios.post("http://192.168.50.93:8000/api/chat/", {
                conversation: id,
                prompt: response,
            }, {headers: {"Authorization": token}});
        } catch (e) {
            Alert.alert("Error", e.message);

        } finally {
            setChatLoading(false);
        }
    };

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            setChats({});
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
    }, [chatLoading]);

    return (
        <SafeAreaView className={"bg-primary h-full"}>
            {loading
                ? <Text className={"text-3xl"}>Loading...</Text>
                :
                <View className={"flex-1"}>
                    <Text className={"text-5xl text-secondary font-psemibold text-center pt-3 pb-3"}>Chat {id}</Text>
                    <ChatComponent/>
                    {chatLoading && <Text className={"text-3xl text-white text-center font-psemibold"}>Loading...</Text>}
                    <View className={"mt-1 justify-end mx-4"}>
                        <FormField placeholder={"Enter your response"} value={response}
                                   handleChangeText={(e) => setResponse(e)}/>
                        <CustomButton title={"Send"} containerStyles={"mt-2"} handlePress={submitResponse}/>
                    </View>
                </View>
            }
        </SafeAreaView>
    );
};
export default Conversation;
