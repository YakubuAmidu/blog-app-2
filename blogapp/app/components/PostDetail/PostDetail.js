import React from 'react'
import { Text, StyleSheet, View, Image, Dimensions, ScrollView } from 'react-native';

// Imported component
import { getSinglePost } from '../../api/post';
import RelatedPosts from '../RelatedPosts/RelatedPosts';
import Separator from '../Separator/Separator';

// Date-format
import dateFormat from 'dateformat';

// React-native-markdown
import Markdown from 'react-native-markdown-display';

// Expo linking
import * as Linking from "expo-linking";

const { width } = Dimensions.get("window");

const MY_WEBSITE_LINK = "myblog.com/blog";

const PostDetail = ({ route, navigation }) => {
  const post = route.params?.post;

  const getImage = (uri) => {
    if (uri) return { uri };

  //   const rules = {
  //     paragraph: (node, children, parent, styles) =>
  //       <Text key={node.key} style={styles.paragraph} selectable>{children}</Text>
  // };

    return require("../../../assets/blank.jpg");
  };

  const handleSinglePostFetch = async (slug) => {
    const { error, post } = await getSinglePost(slug);

    if(error) return console.log(error);

     navigation.push("/PostDetail", { post } );

  }

  const handleOnLinkPress = async (url) => {
   if(url.includes(MY_WEBSITE_LINK)){
    const slug = url.split(MY_WEBSITE_LINK + "/")[1];

    if(!slug) return false;
     handleSinglePostFetch(slug);
    return false;
   }

   const res = await Linking.canOpenURL(url)
   if(res) Linking.openURL(url)
   else Alert.alert("Invalid URL", "Cannot open broken link");
  }

  if(!post) return null;

  const { title, content, author, createdAt, tags, thumbnail } = post;


  return (
    <ScrollView style={styles.container}>
      <Image 
      source={getImage(thumbnail)} style={{ width, height: width / 1.7 }}/>
      <View style={{ padding: 10 }}>
      <Text 
        style={{ 
        fontWeight: "700", 
        color: "#383838", 
        fontSize: 22
        }}>
          {title}
      </Text>

      <View 
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 3,
      }}>
      <Text style={{ color: "#827E7E"}}>By {author}</Text>
      <Text style={{ color: "#827E7E"}}>{dateFormat(createdAt, "mediumDate")}</Text>
      </View>

     <View style={{ flexDirection: "row", alignItems: "center"}}>
      <Text style={{ color: "#827E7E" }}>Tags</Text>
     <View 
      style={{ 
        flexDirection: "row", 
        alignItems: "center"}}
        >
      {
        tags.map((tag, index) => {
          <Text selectable style={{ marginLeft: 5, color: "blue" }} key={tag + index}>#{tag}</Text>
        })
      }
      </View>
     </View>
     <Markdown
    //  rules={rules}
     style={styles}
     onLinkPress={handleOnLinkPress}
     >
      {content}
     </Markdown>
      </View>
    <View 
    style={{
      padding: 10
    }}>
      <Text 
      style={{
        fontWeight: "bold",
        fontSize: 22,
        color: "#383838",
        marginBottom: 10,
      }}>
      Related Posts
      </Text>
      <Separator width="100%"/>
       <RelatedPosts onPostPress={handleSinglePostFetch} postId={post.id}/>  
    </View>    
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  paragraph: {
    lineHeight: 22,
    color: "#545050",
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 16
  },
  link: {
    color: "#7784f8"
  },
  list_item: {
    color: "#545050",
    paddingVertical: 5,
  }
});

export default PostDetail;
