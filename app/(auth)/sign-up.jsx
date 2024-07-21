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
import * as SecureStore from 'expo-secure-store'

const SignUp = () => {
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
        }
        return true;
    };

    const createUser = async () => {
        try {
            const response = await axios.post("http://192.168.50.148:8000/auth/signup/", {
                username: form.username,
                email: form.email,
                password: form.password,
            }, {withCredentials: false});
            if (response.status !== 201) {
                Alert.alert("Error", "Could not create account");
                return false;
            }
            console.log("response", response.data)
            await SecureStore.setItemAsync("Token", ("Token " + response.data["token"]))
            return true;
        } catch (error) {
            console.error("Error:", error.message);
            Alert.alert("Error", "Could not create account");
            return false;
        }
    };


    const submit = async () => {
        setSubmitting(true);
        if (!checkForm()) {
            return;
        }
        const created = await createUser();
        if (created && await SecureStore.getItemAsync("Token")) {
            router.replace("/")
        }
        setSubmitting(false);
    };

    return (<SafeAreaView className={"bg-primary h-full"}>
        <ScrollView>
            <View className="w-full flex justify-center h-full px-4">
                <Image source={images.horizontal} resizeMode={"cover"} className={"w-full h-[100px]"}/>
                <Text className={"text-2xl font-semibold text-white mt-5"}>Sign Up</Text>
                <FormField title={"Username"} value={form.username}
                           handleChangeText={(e) => setForm({...form, username: e})}
                           otherStyles={"mt-3"} placeholder={"Type your username here"}/>
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
        <StatusBar style={"light"}/>
    </SafeAreaView>);
};
export default SignUp;
