import {Image, View, Text} from "react-native";
import React from "react";
import {Tabs} from "expo-router";
import {icons} from "../../constants";


const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className="flex items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text
                className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
                style={{color: color}}
            >
                {name}
            </Text>
        </View>
    );
};

const obj = (title, icon) => {
    return ({
        title: title,
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
            <TabIcon
                icon={icon}
                color={color}
                name={title}
                focused={focused}
            />
        ),
    });
};

const App_Layout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#FFA001",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 84,
                    },
                }}
            >
                <Tabs.Screen
                    name={"home"}
                    options={obj("Home", icons.home)}
                />
                <Tabs.Screen
                    name={"newchat"}
                    options={obj("New chat!", icons.plus)}
                />
                <Tabs.Screen
                    name={"profile"}
                    options={obj("Profile", icons.profile)}
                />
            </Tabs>
        </>
    );
};
export default App_Layout;
