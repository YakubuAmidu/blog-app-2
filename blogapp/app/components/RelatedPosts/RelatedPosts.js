import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// imported components
import { getSimillarPosts } from '../../api/post';
import PostListItem from '../PostListItem/PostListItem';

const RelatedPosts = ({ postId, onPostPress }) => {
    const [posts, setPosts] = useState([]);

    const fetchSimillerPosts = async () => {
        const { error, posts } = await getSimillarPosts(postId);

       if(error) console.log(error);
       
       setPosts([...posts]);
    }

    useEffect(() => {
        fetchSimillerPosts();
    }, [postId])

    return posts.map((post) => {
        return (
            <View style={styles.container} key={post.id}>
                <PostListItem 
                post={post} onPress={() => onPostPress(post.slug)}/>
            </View>
        )
    })
}

const styles = StyleSheet.create({
 container: {
    marginBottom: 10
 }
});

export default RelatedPosts;