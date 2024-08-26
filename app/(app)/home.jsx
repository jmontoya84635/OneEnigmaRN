import {View, Text, Alert, FlatList} from "react-native";
import React, {useEffect, useState, useCallback, useRef} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import ConversationCard from "../../components/ConversationCard";
import EmptyState from "../../components/EmptyState";
import {useFocusEffect, usePathname, useRouter} from "expo-router";
import LottieView from "lottie-react-native";

const Home = () => {
    const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
    const [conversations, setConversations] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [username, setUsername] = useState("");
    useEffect(() => {
        SecureStore.getItemAsync("Username").then((value) => {
            setUsername(value);
        });
    }, []);
    const Chats = () => {
        const animation = useRef(null);
        return (<FlatList
                showsVerticalScrollIndicator={false}
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (<>
                        <View className="mt-4 mx-4">
                            <ConversationCard prompt={item.prompt} title={item.title} handleClick={() => {
                                router.push(`/conversation/${item.id}?title=${item.title}`);
                            }}/>
                        </View>
                    </>)}
                ListHeaderComponent={() => (<View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-3xl text-gray-100">
                                    Welcome Back
                                </Text>
                                <Text className="text-4xl font-psemibold text-white pt-2">
                                    {username}
                                </Text>
                            </View>
                            <View>
                                <LottieView
                                    autoPlay
                                    ref={animation}
                                    style={{
                                        width: 85, height: 85,
                                    }}
                                    source={require("../../assets/Chatbot.json")}
                                />
                            </View>
                        </View>
                    </View>)}
                ListEmptyComponent={() => (<EmptyState
                        subtitle="No chats created yet"
                    />)}
            />);
    };

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
            const response = await axios.get(`${API_HOST}/chat/conversation/`, {
                headers: {
                    "content-type": "application/json", "Authorization": token,
                },
            });
            if (response.status === 200) {
                const reversedConversations = [...response.data].reverse();
                setConversations(reversedConversations);
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
    useFocusEffect(useCallback(() => {
        getChats();
    }, []));
    return (<SafeAreaView className={"bg-primary h-full flex-1"}>
            {loading ? <Text className={"font-pextrabold text-secondary text-5xl"}>Loading...</Text> : error ? <Text>Error...</Text> : <Chats/>}
        </SafeAreaView>);
};
export default Home;
