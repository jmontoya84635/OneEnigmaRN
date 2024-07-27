import {View, Text} from "react-native";
import React, {useRef} from "react";
import LottieView from "lottie-react-native";

const Logo = () => {
    const animation = useRef(null);
    return (<View className="flex-row items-center">
        <LottieView
            autoPlay
            ref={animation}
            style={{
                width: 75, height: 75,
            }}
            source={require("../assets/Chatbot.json")}
        />
        <Text className={"text-5xl font-pextrabold text-secondary border-8 border-white pt-6"}>One Enigma</Text>
    </View>);
};
export default Logo;
