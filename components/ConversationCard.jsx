import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {icons} from "../constants";

const ConversationCard = ({containerStyles, title, titleStyles, count}) => {
    return (
        <TouchableOpacity>
            <View className={`max-w-sm rounded-xl overflow-hidden shadow-2xl ${containerStyles}`}>
                <View className={`bg-black-100 p-4 flex-row justify-between ${containerStyles}`}>
                    <View>
                        <Text className={`text-white font-pmedium text-lg ${titleStyles}`}>{title}</Text>
                        <Text className="text-gray-400 font-pregular text-sm">{count} messages</Text>
                    </View>
                    <Image source={icons.rightArrow} className="w-6 h-12" tintColor={"#FF9C01"} resizeMode="contain"/>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default ConversationCard;
