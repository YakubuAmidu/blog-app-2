import React, { useState, useEffect } from 'react';

// React-navigation
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { useNetInfo } from "@react-native-community/netinfo";

// Imported components
import TabNavigator from './app/navigation/tabNavigator/TabNavigator';
import NoInternet from './app/components/NoInternet/NoInternet';

const CUSTOM_THEME = {...DefaultTheme, colors: {...DefaultTheme.colors, backgroundColor: "#fff" }}

const App = () => {
   const [noInternet, setNoInternet] =  useState(false);

  const netInfo = useNetInfo();

  const fetchNetInfo = () => {
    const { isConnected, isInternetReachable} = netInfo;
    if(isConnected === false && isInternetReachable === false)
    setNoInternet(true)
    else setNoInternet(false);
  }

  useEffect(() => {
     fetchNetInfo();
  }, [netInfo]);

  if(noInternet) return <NoInternet onRefreshPress={fetchNetInfo}/>

    return (
    <NavigationContainer theme={CUSTOM_THEME}>
      <TabNavigator />
    </NavigationContainer>
  )
}

export default App;