import {View, Text} from "react-native";
import React from "react";

const ChatBubble = ({message, role}) => {
    let color = "";
    color = role === "user" ? "bg-blue-300" : "bg-green-300";
    let alignment = "";
    alignment = role === "user" ? "justify-end" : "justify-start";
    return (
        <View className={`px-4 flex-1 h-full`}>
            <View className={`mt-2 p-2 rounded-xl flex-row justify-end ${(color + " " + alignment)}`}>
                <Text className={"text-white font-psemibold text-lg p-2"}>{message}</Text>
            </View>
        </View>
    );
};
export default ChatBubble;
