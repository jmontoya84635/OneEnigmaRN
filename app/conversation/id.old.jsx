import {View, Text, Alert, FlatList, KeyboardAvoidingView, Platform} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {useLocalSearchParams} from "expo-router";
import ChatBubble from "../../components/ChatBubble";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";
import 'react-native-polyfill-globals/auto'

const Conversation = () => {
    const {id} = useLocalSearchParams();
    const [chats, setChats] = useState({});
    const [focus, setFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [streamingChat, setStreamingChat] = useState("")
    const [userMessage, setUserMessage] = useState("");
    const ChatComponent = () => {
        return (
            <FlatList
                inverted
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                    return (
                        // <View className={flex-row w-60 ${item.is_assistant ? "pe-0" : "ps-0"}}>
                        <View className={`flex-row px-6`}>
                            <ChatBubble message={item.content} role={item.is_assistant ? "bot" : "user"}/>
                        </View>
                    );
                }}
            />
        );
    };

    const submitResponse = async () => {
        try {
            const message = userMessage;
            setUserMessage("");
            setChatLoading(true);
            setStreamingChat("")
            const token = await SecureStore.getItemAsync("Token");
            const payload = {
                conversation_id: id,
                content: message,
            };
            const tempBotId = `temp_bot_${new Date().getTime()}`;
            const emptyBotMessage = {
                id: tempBotId,
                content: streamingChat, // Empty content initially
                is_assistant: true,
            };
            setChats((prevChats) => [...prevChats, emptyBotMessage]);
            await fetch("http://192.168.50.15:8000/chat", {
                method: 'POST',
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                reactNative: { textStreaming: true }
            })
                .then(response => response.body)
                .then(async (stream) => {
                    let combined = ""
                    const reader = stream.getReader();
                    const decoder = new TextDecoder();
                    const processStream = async () => {
                        const processChunk = async () => {
                            const { done, value } = await reader.read();
                            if (done) {
                                setChatLoading(false)
                                return;
                            }
                            const text = decoder.decode(value); // Convert the binary data to text
                            try{
                                combined = combined + text.slice(0, -2)
                                setStreamingChat(combined)
                            }catch (e) {
                                console.error(text, e)
                            }
                            setTimeout(processChunk); // Delay before processing the next chunk
                        };
                        processChunk();
                    };
                    processStream();
                })
        } catch (e) {
            console.error(e);
        }
    };


    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            setChats({});
            try {
                const token = await SecureStore.getItemAsync("Token");
                const response = await axios.get("http://192.168.50.15:8000/chat/conversation/", {
                    headers: {
                        "Authorization": token,
                    },
                    params: {
                        conversation_id: id,
                    },
                });
                if (response.status === 200) {
                    setChats(response.data);
                } else {
                    Alert.alert("Error", "Could not get chats, Server error.");
                }
            } catch (e) {
                Alert.alert("Error", e.message);
            } finally {
                setLoading(false);
            }
        };
        getChats().then(r => setChatLoading(false));
    }, []);

    return (
        <SafeAreaView className={"bg-primary h-full"}>
            {/*TODO: add better loading screen*/}
            {loading
                ? <Text className={"text-3xl"}>Loading...</Text>
                :
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                >
                    <View className={"flex-1"}>
                        <Text
                            className={"text-5xl text-secondary font-psemibold text-center pt-3 pb-3"}>Chat {id}</Text>
                        <ChatComponent/>
                        {chatLoading && <Text
                            className={"text-3xl text-white text-center font-psemibold py-4 justify-center"}>Loading...</Text>}
                        <View className={"mt-1 justify-end mx-4"}>
                            <FormField placeholder={"Enter your userMessage"} value={userMessage}
                                       handleChangeText={(e) => setUserMessage(e)} onFocus={() => setFocus(true)}/>
                            <CustomButton title={"Send"} containerStyles={"mt-2"} handlePress={submitResponse}/>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            }
        </SafeAreaView>
    );
};
export default Conversation;