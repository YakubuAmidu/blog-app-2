import React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";

// Expo-vector-icon
import { Feather } from '@expo/vector-icons'; 

const NoInternet = ({ onRefreshPress }) => {
    return (
        <View style={styles.container}>
           <Feather name="wifi-off" size={35} color="#383838" />
           <Text
            style={{ 
                fontSize: 18, 
                color: "#383838", 
                paddingVertical: 5 
                   }}>
            No Internet connection...
           </Text>
           <Pressable onPress={onRefreshPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
           <Feather name="refresh-cw" size={18} color="black" />
           <Text
            style={{ 
                fontSize: 18, 
                paddingVertical: 5 ,
                marginLeft: 10,
                   }}>
            Try again...
           </Text>
           </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default NoInternet;