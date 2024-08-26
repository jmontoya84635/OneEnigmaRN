import {
    View,
    Text,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import React, {useEffect, useState, useRef} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {router, useLocalSearchParams} from "expo-router";
import "react-native-polyfill-globals/auto";
import {icons} from "../../constants";
import * as Haptics from "expo-haptics";
// import Markdown, {MarkdownIt} from "react-native-markdown-display";
import Markdown from '@ronradtke/react-native-markdown-display';

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 18, marginTop: 4,
    },
    text: {
        color: "white",
    },
    bullet_list: {
        color: "white",
    },
    ordered_list: {
        color: "white",
    },
    blockquote: {
        backgroundColor: "black",
    },
    code_block: {
        color: "white",
        backgroundColor: "black",
    },
    heading1: {
        color: "black",
        backgroundColor: "black",
    }
});


const Conversation = () => {
    const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
    const {id, title} = useLocalSearchParams();
    const [loadingChats, setLoadingChats] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [history, setHistory] = useState([]);

    const scrollRef = useRef(null);
    const scrollDown = () => {
        scrollRef.current?.scrollToEnd({animated: false});
    };


    useEffect(() => {
        const getChats = async () => {
            setLoadingChats(true);
            try {
                const token = await SecureStore.getItemAsync("Token");
                const response = await axios.get(`${API_HOST}/chat/conversation/`, {
                    headers: {
                        "Authorization": token,
                    }, params: {
                        conversation_id: id,
                    },
                });
                if (response.status === 200) {
                    let chats = response.data;
                    const transformedChats = chats.map(chat => ({
                        author: chat.is_assistant ? "ChatBot" : "user", // Adjust according to your data structure
                        message: chat.content,
                    }));
                    setHistory(transformedChats);
                } else {
                    Alert.alert("Error", "Could not get chats, Server error.");
                }
            } catch (e) {
                Alert.alert("Error", e.message);
            } finally {
                setLoadingChats(false);
            }
        };
        getChats().then(r => setLoadingChats(false));
    }, []);

    const updateHistoryWithTyping = (newMessageContent) => {
        setHistory(currentHistory => {
            const historyLength = currentHistory.length;
            if (historyLength > 0 && currentHistory[historyLength - 1].author === "ChatBot") {
                let newHistory = [...currentHistory];
                newHistory[historyLength - 1].message = newMessageContent;
                return newHistory;
            } else {
                return [...currentHistory, {author: "ChatBot", message: newMessageContent}];
            }
        });
        scrollDown();
    };

    const ThinkingIndicator = () => {
        return (<View style={{alignItems: "center", justifyContent: "center", padding: 10}}>
                <ActivityIndicator size="large" color="white"/>
                <Text className={"font-pbold text-secondary text-xl"}>Thinking...</Text>
            </View>);
    };

    const avatar = (role) => {
        return <View className={"flex flex-row space-x-3 items-center"}>
            <View className={"p-1 rounded-full w-8 h-8 border border-white bg-white"}>
                <Text className={"text-sm font-pbold m-auto"}>{role === "ChatBot" ? "E" : "U"}</Text>
            </View>
            <View>
                <Text className={"text-secondary font-pbold text-[24px]"}>{role === "ChatBot" ? "Enigma" : "You"}</Text>
            </View>
        </View>;
    };

    const sendMessage = async () => {
        if (!currentMessage.length) {
            Alert.alert("Alert!", "Your message is empty!");
            return;
        }
        Keyboard.dismiss();
        scrollDown();
        setHistory([...history, {author: "user", message: currentMessage}]);
        let tmpMessage = currentMessage;
        setCurrentMessage("");
        setIsThinking(true);
        try {
            const token = await SecureStore.getItemAsync("Token");
            const payload = {
                conversation_id: id, content: tmpMessage,
            };
            await fetch(`${API_HOST}/chat`, {
                method: "POST", headers: {
                    Authorization: token, "Content-Type": "application/json",
                }, body: JSON.stringify(payload), reactNative: {textStreaming: true},
            })
                .then(response => response.body)
                .then(async (stream) => {
                    if (!isTyping) {
                        setIsTyping(true);
                        setIsThinking(false);
                    }
                    let combined = "";
                    const reader = stream.getReader();
                    const decoder = new TextDecoder();
                    const processStream = async () => {
                        const processChunk = async () => {
                            const {done, value} = await reader.read();
                            if (done) {
                                setIsThinking(false);
                                setIsTyping(false);
                                scrollDown();
                                return;
                            }
                            try {
                                const text = decoder.decode(value); // Convert the binary data to text
                                combined = combined + text;
                                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                await updateHistoryWithTyping(combined);
                            } catch (e) {
                                console.error(e);
                            }
                            setTimeout(processChunk); // Delay before processing the next chunk
                        };
                        processChunk();
                    };
                    processStream();
                });

        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setIsThinking(false);
            setIsTyping(false);
        }
    };

    const promptDeleteConversation = async () => {
        Alert.alert("Delete?", "Are you sure you want to delete this conversation?", [{
            text: "Cancel", onPress: () => console.log("Cancelled"), style: "cancel",
        }, {
            text: "DELETE", onPress: deleteConversation, style: "destructive",
        }]);
    };

    const deleteConversation = async () => {
        const token = await SecureStore.getItemAsync("Token");
        const response = await axios.delete(`${API_HOST}/chat/conversation/`, {
            headers: {
                "Authorization": token,
            }, params: {
                conversation_id: id,
            },
        });
        if (response.status === 200) {
            router.replace("/home");
        } else {
            Alert.alert("Error", `Could not delete conversation: status: ${response.status}`);
        }
    };

    return (<SafeAreaView className="px-1 bg-primary h-full">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <View className="px-4 py-2 rounded-2xl border-2 border-gray-700 flex flex-row justify-between items-center">
                    <Text className="text-xl font-pbold text-white flex-wrap w-[75%]">{title}</Text>
                    <TouchableOpacity onPress={promptDeleteConversation} className={"rounded-2xl border-red-700 border-2 p-3"}>
                        <Text className="text-red-700 font-pmedium pe-1">Delete</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView className="px-4 mt-2 mb-2 h-[90%]" ref={scrollRef} showsVerticalScrollIndicator={false}>
                    {history.map((msg, i) => {
                        return <View key={i} className={"my-2"}>
                            <View>
                                {avatar(msg.author)}
                                <Markdown style={markdownStyles}>
                                    {msg.message}
                                </Markdown>
                            </View>
                        </View>;
                    })}
                    {isThinking && <ThinkingIndicator/>}
                </ScrollView>
                <View className="flex flex-row justify-between items-center">
                    <View className="w-[90%]">
                        <TextInput className="rounded-md p-4 bg-gray-500"
                                   placeholder="Ask something.. " keyboardAppearance={"dark"}
                                   value={currentMessage} onChangeText={(text) => setCurrentMessage(text)}/>
                    </View>
                    <View>
                        <TouchableOpacity onPress={sendMessage} disabled={isThinking || isTyping}>
                            <Image
                                source={icons.play}
                                resizeMode="contain"
                                className={"w-8 h-8"}
                                aria-disabled={isThinking || isTyping}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>);
};
export default Conversation;
