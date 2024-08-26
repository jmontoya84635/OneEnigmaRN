import {View, Text, Alert} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {router, useRouter} from "expo-router";

const Newchat = () => {
    const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
    const router = useRouter();
    const [form, setForm] = React.useState({
        title: "", context: "", prompt: "",
    });
    const createChat = async () => {
        if (form.title === "") {
            Alert.alert("Error", "Please enter a title");
            return false;
        }
        try {
            const token = await SecureStore.getItemAsync("Token");
            const response = await axios.post(`${API_HOST}/chat/conversation/`, {
                title: form.title, prompt: form.context,
            }, {
                headers: {
                    "Authorization": token,
                },
            });
            if (response.status !== 201) {
                console.error("Error", "Could not create chat");
                return false;
            } else {
                setForm({
                    title: "", context: "", prompt: "",
                });
                router.replace("/home");
            }
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };
    return (<SafeAreaView className={"bg-primary h-full"}>
            <Text className="text-4xl text-white font-psemibold mx-auto mt-5 pt-2">Create new Chat</Text>
            <View className={"px-4"}>
                <FormField
                    title="Chat Title"
                    value={form.title}
                    placeholder="Enter Chat Title"
                    handleChangeText={(e) => setForm({...form, title: e})}
                    otherStyles="mt-10"
                />
                <FormField
                    title={"Chat context"}
                    value={form.context}
                    placeholder="Enter Chat context (optional)"
                    handleChangeText={(e) => setForm({...form, context: e})}
                    otherStyles="mt-10"
                />
                <CustomButton
                    title="Create Chat"
                    containerStyles="mt-20"
                    handlePress={createChat}
                />
            </View>
        </SafeAreaView>);
};
export default Newchat;
