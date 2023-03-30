import React, { useState } from 'react'
import { Text, View, StyleSheet, TextInput, ScrollView, ImageBackground } from 'react-native';

// Expo constants
import Constants from 'expo-constants';

// UseNavigation
import { useNavigation } from '@react-navigation/native';

// Imported components
import { getSinglePost, searchPosts } from '../../../api/post';
import PostListItem from '../../PostListItem/PostListItem';

const Search  = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const navigation = useNavigation();

    const handleOnSubmit = async () => {
        if(!query.trim()) return;

        // submit the form
        const { error, posts } = await searchPosts(query);
        if(error) return console.log(error);

      if(!posts.length) return setNotFound(true);
      setResults([...posts]);
    }

    const handlePostPress = async (slug) => {
       const { error, post } = await getSinglePost(slug);
       if(error) return console.log(error);

       navigation.navigate("PostDetail", { post });
    }

    return (
        <View style={styles.container}>
            <TextInput 
            placeholder="Search..." 
            style={styles.searchInput}
            value={query}
            onChangeText={(text) => setQuery(text)}
            onSubmitEditing={() => handleOnSubmit}
            />
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                {
                 notFound 
                 ? 
                 (
                    <Text 
                    style={{ 
                        fontWeight: "bold", 
                        textAlign: "center", 
                        marginTop: 30, 
                        fontSize: 22,
                        color: "rgba(0,0,0,0.5)" 
                            }}>
                        Result not found...😔
                    </Text>
                 )  
                 : 
                        results.map((post) => {
                            return (
                                <View key={post.id} style={{ marginTop: 10 }}>
                                    <PostListItem 
                                     post={post} 
                                     onPress={() => handlePostPress(post.slug)}/>
                                </View>
                            )
                        })
                    } 
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        padding: 10,
        flex: 1,
    },
    searchInput: {
         borderWidth: 2,
         borderColor: "#383838",
         borderRadius: 5,
         padding: 5,
         fontSize: 15
    }
})

export default Search;