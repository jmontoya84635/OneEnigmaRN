import {View, Text, ScrollView, Image, Alert} from "react-native";
import React from "react";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {images} from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";
import {Link, router} from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {StatusBar} from "expo-status-bar";

const SignIn = () => {

    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "", password: "",
    });

    const login = async () => {
        try {
            const response = await axios.post("http://192.168.50.15:8000/auth/token", {
                username: form.username, password: form.password,
            }, {
                withCredentials: false, headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.status !== 200) {
                Alert.alert("Error", "Credentials are not correct");
                return false;
            }
            console.log("response", response.data);
            console.log("Token", response.data["access_token"]);
            await SecureStore.setItemAsync("Token", ("Bearer " + response.data["access_token"]));
            return true;
        } catch (error) {
            console.log(error)
            if (error.message === "Request failed with status code 400") {
                Alert.alert("Error", "Invalid credentials");
                return;
            }
            Alert.alert("Error", "Server error");
        }
    };

    const submit = async () => {
        setSubmitting(true);
        if (form.username === "" || form.password === "") {
            Alert.alert("Error", "Please fill out all forms");
            setSubmitting(false);
            return;
        }
        const created = await login();
        if (created && await SecureStore.getItemAsync("Token")) {
            router.replace("/");
        }
        setSubmitting(false);
    };

    return (<SafeAreaView className={"bg-primary h-full"}>
        <ScrollView style={{display: "flex"}}>
            <View className="w-full flex justify-center h-full px-4 my-6">
                <Image source={images.horizontal} resizeMode={"cover"} className={"w-full h-[100px]"}/>
                <Text className={"text-2xl text-white mt-10 font-psemibold"}>Sign in</Text>
                <FormField title={"Username"} value={form.username}
                           handleChangeText={(e) => setForm({...form, username: e})}
                           otherStyles={"mt-7"} placeholder={"Type your username here"}/>
                <FormField title={"Password"} value={form.password}
                           handleChangeText={(e) => setForm({...form, password: e})}
                           otherStyles={"mt-7"} keyboardType={"visible-password"}
                           placeholder={"Type your password here"}/>
                <CustomButton title={"Sign in"} handlePress={submit} containerStyles={"w-full mt-7"}
                              isLoading={submitting}/>
            </View>
            <View className={"flex justify-center pt-5 flex-row gap-2"}>
                <Text className={"text-lg text-gray-100 font-pregular"}>
                    Don't have an account?
                </Text>
                <Link href={"/sign-up"}
                      className={"text-lg font-psemibold text-secondary"}>
                    Signup
                </Link>
            </View>
        </ScrollView>
        <StatusBar style={"light"}/>
    </SafeAreaView>);
};
export default SignIn;
