import {View, Text} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/custombutton";

const Newchat = () => {
    const [form, setForm] = React.useState({
        title: "",
        context: "",
        prompt: "",
    });
    return (
        <SafeAreaView className={"bg-primary h-full"}>
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
                    placeholder="Enter Chat context"
                    handleChangeText={(e) => setForm({...form, context: e})}
                    otherStyles="mt-10"
                />
                <FormField
                    title={"Chat prompt"}
                    value={form.context}
                    placeholder="Enter prompt for chat"
                    handleChangeText={(e) => setForm({...form, prompt: e})}
                    otherStyles="mt-10"
                />
                <CustomButton
                    title="Create Chat"
                    containerStyles="mt-20"
                />
            </View>
        </SafeAreaView>
    );
};
export default Newchat;
