import {View, Text} from "react-native";
import React from "react";

const ChatBubble = ({message, role}) => {
    let color = role === "user" ? "bg-blue-300" : "bg-gray-300";
    let alignment = role === "user" ? "justify-end" : "justify-start";
    return (
        <View className={`mt-2 p-2 rounded-xl flex-row justify-start ${(color + " " + alignment)}`}>
            <Text className={"text-white font-psemibold text-lg p-2"}>{message}</Text>
        </View>
    );
};
export default ChatBubble;
