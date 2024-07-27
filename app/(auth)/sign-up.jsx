import {View, Text, ScrollView, Image, Alert} from "react-native";
import React from "react";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {images} from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";
import {Link, router} from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Logo from "../../components/logo.jsx";


const SignUp = () => {
    const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "", password: "", password2: "", email: "",
    });

    const checkForm = () => {
        if (form.username === "" || form.password === "" || form.password2 === "" || form.email === "") {
            Alert.alert("Error", "Please fill out all forms");
            return false;
        } else if (form.password !== form.password2) {
            Alert.alert("Error", "Passwords must match");
            return false;
        } else if (form.password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters long");
            return false;
        } else if (!form.email.includes("@")) {
            Alert.alert("Error", "Email must be valid");
            return false;
        } else if (form.username.length < 4) {
            Alert.alert("Error", "Username must be at least 4 characters long");
            return false;
        } else if (form.username.length > 20) {
            Alert.alert("Error", "Username must be at most 20 characters long");
            return false;
        } else if (form.password.length > 20) {
            Alert.alert("Error", "Password must be at most 20 characters long");
            return false;
        } else if (form.email.length > 50) {
            Alert.alert("Error", "Email must be at most 50 characters long");
            return false;
        } else if (form.email.length < 5) {
            Alert.alert("Error", "Email must be at least 5 characters long");
            return false;
        } else if (form.username.includes(" ")) {
            Alert.alert("Error", "Username must not contain spaces");
            return false;
        } else if (form.password.includes(" ")) {
            Alert.alert("Error", "Password must not contain spaces");
            return false;
        } else if (form.email.includes(" ")) {
            Alert.alert("Error", "Email must not contain spaces");
            return false;
        }
        return true;
    };

    const createUser = async () => {
        try {
            const response = await axios.post(`${API_HOST}/auth/`, {
                username: form.username, email: form.email, password: form.password,
            }, {withCredentials: false});
            if (response.status === 201) {
                try {
                    const loginResponse = await axios.post(`${API_HOST}/auth/token`, {
                        username: form.username, password: form.password,
                    }, {
                        withCredentials: false, headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    });
                    await SecureStore.setItemAsync("Token", ("Bearer " + loginResponse.data["access_token"]));
                    await SecureStore.setItemAsync("Username", (response.data["username"]));
                    return true;
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 401) {
                            Alert.alert("Error", "Credentials are not correct");
                        } else {
                            Alert.alert("Error", error.response.data.detail);
                        }
                    } else {
                        Alert.alert("Error", `Could not connect to server ${error}`);
                    }
                    return false;
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    Alert.alert("Error", "Credentials are not correct");
                } else {
                    Alert.alert("Error", error.response.data.detail);
                }
            } else {
                Alert.alert("Error", "Could not connect to server" + error);
            }
            return false;
        } finally {
            setSubmitting(false);
        }
    };


    const submit = async () => {
        setSubmitting(true);
        if (!checkForm()) {
            setSubmitting(false);
            return;
        }
        const created = await createUser();
        if (created && await SecureStore.getItemAsync("Token")) {
            console.log(`Token: ${await SecureStore.getItemAsync("Token")}`);
            router.replace("/");
        }
    };

    return (<SafeAreaView className={"bg-primary h-full"}>
        <ScrollView>
            <View className="w-full flex justify-center h-full px-4">
                <Logo/>
                <Text className={"text-2xl font-semibold text-white mt-5"}>Sign Up</Text>
                <FormField title={"Username"} value={form.username}
                           handleChangeText={(e) => setForm({...form, username: e})}
                           otherStyles={"mt-3"} placeholder={"Type your username here"} keyboardType={"username"}/>
                <FormField title={"Email"} value={form.email}
                           handleChangeText={(e) => setForm({...form, email: e})}
                           otherStyles={"mt-3"} placeholder={"Type your username here"} keyboardType={"email"}/>
                <FormField title={"Password"} value={form.password}
                           handleChangeText={(e) => setForm({...form, password: e})}
                           otherStyles={"mt-3"} keyboardType={"visible-password"}
                           placeholder={"Type your password here"}/>
                <FormField title={"Confirm Password"} value={form.password2}
                           handleChangeText={(e) => setForm({...form, password2: e})}
                           otherStyles={`mt-3`} keyboardType={"visible-password"}
                           placeholder={"Retype your password here"}/>

                <CustomButton title={"Sign up"} handlePress={submit} containerStyles={"w-full mt-5"}
                              isLoading={submitting}/>
            </View>
            <View className={"flex justify-center mt-3 flex-row gap-2"}>
                <Text className={"text-lg text-gray-100 font-pregular"}>
                    Already have an account?
                </Text>
                <Link href={"/sign-in"}
                      className={"text-lg font-psemibold text-secondary"}>
                    Sign in
                </Link>
            </View>
        </ScrollView>
        <StatusBar backgroundColor={"transparent"} style={"light"}/>
    </SafeAreaView>);
};
export default SignUp;
