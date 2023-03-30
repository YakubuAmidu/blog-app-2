import React from 'react';
import { View } from 'react-native';

const Separator = ({
     width = "100%", 
     height = 1, 
     backgroundColor = "#d3d3d3", 
     alignSelf = "center",
     style
    }) => {
    return (
        <View style={[{ width, height, backgroundColor, alignSelf }, style]} />
    )
}

export default Separator;