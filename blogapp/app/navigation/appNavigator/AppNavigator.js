import React from 'react'

import Home from '../../components/Screens/HomeScreen/Home';
import PostDetail from '../../components/PostDetail/PostDetail';

// React-navigation-stack
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableWithoutFeedback, View } from 'react-native';

// React-navigation
import { useNavigation } from '@react-navigation/native';

// React-native-vector-icons
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
 const navigation = useNavigation();

  return (
        <Stack.Navigator>
          <Stack.Screen 
          options={{ 
            headerShown: false }} component={Home} name="Home" />
          <Stack.Screen 
          options={{
            title: "",
            headerTransparent: true,
            headerShadowVisible: false,
            headerLeft: (props) => {
              <TouchableWithoutFeedback 
              {...props} 
              onPress={navigation.goBack}>
                <View 
                style={{ 
                  width: 40, 
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 20
                }}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </TouchableWithoutFeedback>
            }
          }} component={PostDetail} name="PostDetail" />
        </Stack.Navigator>
  )
}

export default AppNavigator;
