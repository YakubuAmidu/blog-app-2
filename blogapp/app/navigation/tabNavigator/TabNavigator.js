import React from 'react';

// Expo-vector-icons
import { AntDesign } from '@expo/vector-icons';

// React navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Imported components
import Home from '../../components/Screens/HomeScreen/Home';
import Search from '../../components/Screens/SearchScreen/Search';
import AppNavigator from '../appNavigator/AppNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
           <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
            options={{ tabBarIcon: ({ focused, color, size}) => {
                return <AntDesign name="home" size={size} color={color} />
            }, 
            }} name="HomeScreen" component={AppNavigator}/>
            <Tab.Screen 
            options={{ tabBarIcon: ({ focused, color, size }) => {
                return <AntDesign name="search1" size={size} color={color} />
            }}} name="Search" component={Search}/>
           </Tab.Navigator>
    )
}

export default TabNavigator;