import {View, Text} from "react-native";
import React from "react";

const ChatBubble = ({prompt, response}) => {
    return (
        <View className={"px-4 flex-1 h-full justify-between"}>
            <View className={"mt-2 p-2 bg-blue-300 rounded-xl flex-row justify-end w-auto"}>
                <Text className={"text-white font-psemibold text-lg px-4 py-2"}>{prompt}</Text>
            </View>
            <View className={"mt-2 p-2 bg-green-300 rounded-xl flex-row justify-start"}>
                <Text className={"text-white font-psemibold text-lg px-4 py-2"}>{response}</Text>
            </View>
        </View>
    );
};
export default ChatBubble;
