import {View, Text} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/custombutton";
import * as SecureStore from "expo-secure-store";
import {useRouter} from "expo-router";


const Profile = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const logout = async () => {
        setLoading(true);
        await SecureStore.deleteItemAsync("Token");
        setLoading(false)
        router.replace("/");
    }
    return (
        <SafeAreaView className={"bg-primary h-full justify-center px-4"}>
            <CustomButton isLoading={loading} title={"Logout"} handlePress={()=>logout()} />
        </SafeAreaView>
    );
};
export default Profile;
