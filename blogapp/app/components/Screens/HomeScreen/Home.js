import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

import constants from 'expo-constants';

// Imported components
import Slider from '../../Slider/Slider';
import Separator from '../../Separator/Separator';
import PostListItem from '../../PostListItem/PostListItem';
import { getFeaturedPosts, getLatestPosts, getSinglePost } from '../../../api/post';

let pageNo = 0;
const limit = 5;

export default function Home({ navigation }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchFeaturedPosts = async () => {
       const { error, posts } = await getFeaturedPosts();
       if(error) console.log(error);

       setFeaturedPosts(posts);
  }

  const fetchLatestPosts = async () => {
     const { error, posts } = await getLatestPosts(limit, pageNo);
     if(error) console.log(error);

     setLatestPosts(posts);
  }

  const fetchMorePosts = async () => {
    console.log("Running...😔");
    if(reachedToEnd || busy) return;

    pageNo += 1;
    setBusy(true);

    const { error, posts, postCount } = await getLatestPosts(limit, pageNo);
    setBusy(false);
    if(error) return console.log(error);
    
    if(postCount === latestPosts.length) return setReachedToEnd(true);

    setLatestPosts([...latestPosts, ...posts ]);
  }

  useEffect(() => {
    fetchFeaturedPosts();
    fetchLatestPosts();
  }, []);

  const ListHeaderComponent = () => {
    return (
     <View style={{ paddingTop: constants.statusBarHeight }}>
      {
        featuredPosts?.length 
        ? 
        (
        <Slider onSlidePress={fetchSinglePost} data={featuredPosts} title="Featured Posts"/>
        ) : null
      }
       <View style={{ marginTop: 15 }}>
         <Separator />
         <Text 
         style={{ fontWeight: "700", 
         fontSize: 22, 
         marginTop: 15, 
         color: "#383838" 
         }}>
           Latest Posts:
         </Text>
       </View>
     </View>
    )
 };

 const fetchSinglePost = async (postInfo) => {
   const slug = postInfo.slug || postInfo;
   const { error, post } = await getSinglePost(slug);

   if(error) console.log(error);
   navigation.navigate("PostDetail", { post });
 }

 const renderItem = ({ item }) => {
  return (
    <View style={{ marginTop: 15 }}>
      <PostListItem onPress={() => fetchSinglePost(item.slug)} post={item}/>
    </View>
  )
}

const ItemSeparatorComponent = () => <Separator width='90%' 
style={{ marginTop: 15 }} />

  return (
  <FlatList 
  data={latestPosts} 
  keyExtractor={(item) => item.id }
  contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
  ListHeaderComponent={ListHeaderComponent}
  ItemSeparatorComponent={ItemSeparatorComponent}
  renderItem={renderItem}
  onEndReached={async () => await fetchMorePosts()}
  onEndReachedThreshold={0}
  ListFooterComponent={() => 
    { 
      return reachedToEnd 
    ? 
    <Text 
    style={{ 
      fontWeight: "bold",
       color: "#383838", 
       textAlign: "center",
        paddingVertical: 15 
        }}>
      You reached to end!...😔
      </Text> : 
      null }}
  />
  );
}

