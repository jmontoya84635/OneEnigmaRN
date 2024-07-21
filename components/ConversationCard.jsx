import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {icons} from "../constants";

const ConversationCard = ({containerStyles, title, titleStyles, prompt, handleClick}) => {
    return (
        <TouchableOpacity onPress={handleClick}>
            <View className={`max-w-sm min-h-fit rounded-xl overflow-hidden shadow-2xl ${containerStyles}`}>
                <View className={`bg-black-100 p-4 flex-row justify-between items-center flex-1 ${containerStyles}`}>
                    <View>
                        <Text className={`text-white font-pmedium text-lg w-72 ${titleStyles}`}>{title}</Text>
                        {prompt
                            ? <>
                                <Text className="text-gray-400 font-pregular text-sm w-72">{prompt}</Text>
                            </>
                            :   null
                        }
                    </View>
                    <Image source={icons.rightArrow} className="w-6 h-12" tintColor={"#FF9C01"} resizeMode="contain"/>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default ConversationCard;
