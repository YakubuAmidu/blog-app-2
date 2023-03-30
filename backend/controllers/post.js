// Cloudinary API
const cloudinary = require('../cloud');

// isValidObhjectId from mongoose
const { isValidObjectId } =  require('mongoose');

// Multer
const multer = require('multer');

// Middleware
const { parseData } = require('../middleware');
const { postValidator } = require('../middleware/postValidator');
// const post = require('../models/post');

//Imported models
const Post = require('../models/post');
const FeaturedPost = require('../models/featuredPost');

const FEATURED_POST_COUNT = 4;

const addToFeaturedPost = async (postId) => {
  const isAlreadyExist = FeaturedPost.findOne({ post: postId });
  if(isAlreadyExist) return;

   const newFeaturedPost = new featuredPost({ post: postId });
   await newFeaturedPost.save();

   const featuredPosts = await FeaturedPost.find({}).sort({ createAt: -1 });

   featuredPosts.forEach(async (post, index) => {
     if(index >= FEATURED_POST_COUNT) {
        await FeaturedPost.findByIdAndDelete(post._id);
     }
   });
};

const removeFromFeaturedPost = async (postId) => {
  await FeaturedPost.findOneAndDelete({ post: postId });
}

const isFeaturedPost = async (postId) => {
  const post = await FeaturedPost.findOne({ post: postId });
  return post ? true : false;
}

exports.createPost = async (req, res) => {
    const { title, tags, author, content, meta, slug, featured } = req.body;

    const { file } = req;

    const isAlreadyExist = await Post.findOne({ slug });

    if(isAlreadyExist){
      return res.status(401).json({ error: 'Please use a unique slug!😉' });
    }

    const newPost = new Post({
        title,
        tags,
        author,
        content,
        meta,
        slug
    });

    if(file){
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path);
      newPost.thumbnail = { url, public_id };
    }

    await newPost.save();

    if(featured) await addToFeaturedPost(newPost._id);
    
    res.json({ 
      post: { 
        id: newPost._id, 
        title, 
        tags,
        content,
        meta, 
        slug, 
        thumbnail: newPost.thumbnail?.url, 
        author: newPost.author 
      }});
};

exports.updatePost = async (req, res) => {
  const { title, meta, author, content, slug, tags, featured } = req.body;
  const { file } = req;
  const { postId } = req.params;
  if(!isValidObjectId(postId)){
    return res.status(401).json({ error: 'Invalid request!' });
  }

  const post = await Post.findById(postId);
  if (!post){
    return res.status(404).json({ error: "Post not found!" });
  }

  const public_id = post.thumbnail?.public_id;
  if(public_id && file){
    const { result } = await cloudinary.uploader.destroy(public_id);
    if(result !== 'ok'){
      return res.status(404).json({ error: 'Could not remove thumbnail!' });
    };
  };

  if (file){
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path);

    post.thumbnail = { url, public_id };
  }

  post.title = title;
  post.meta = meta;
  post.content = content;
  post.author = author;
  post.slug = slug;
  post.tags = tags;

  if(featured) await addToFeaturedPost(post._id);
  else await removeFromFeaturedPost(post._id);

  await post.save();

  res.json({ 
    post: {
    id: post._id,
    title,
    meta,
    slug,
    thumbnail: post.thumbnail?.url,
     author: post.author,
     content,
     featured
  }})
};

exports.getPost = async (req, res) => {
  const { slug } = req.params;

  if(!slug){
    return res.status(401).json({ error: 'Invalid request!' });
  }

  const post = await Post.findOne({ slug });
  if(!post) return res.status(404).json({ error: "Post not found!" });

  const featured = await isFeaturedPost(post._id);

  const { title, meta, tags, author, content, createdAt } = post;

  res.json({
    post: {
      id: post._id,
      title,
      meta,
      tags,
      content,
      slug,
      featured,
      thumbnail: post.thumbnail?.url,
      author,
      createdAt
    }
  })
};

exports.getPosts = async (req, res) => {
 const { pageNo = 0, limit = 15 } = req.query;
  
  const posts = await Post.find({})
  .sort({ createdAt: -1 })
  .skip(parseInt(pageNo) * parseInt(limit))
  .limit(parseInt(limit));
  
  console.log(posts);

  const postCount = await Post.countDocuments();

  console.log(postCount);

  res.json({ 
    posts: posts.map(( post ) => ({
    id: post._id,
    title: post.title,
    tags: post.tags,
    slug: post.slug,
    meta: post.meta,
    author: post.author,
    thumbnail: post.thumbnail?.url,
    createdAt: post.createdAt
  })), 
  postCount,
});
};

exports.searchPost = async (req, res) => {
  const { title } = req.query;

  if(!title.trim()) 
  return res.status(401).json({ error: 'Search query is missing! '});

  const posts = await Post.find({ 
    title: {
    $regex: title, 
    $options: 'i'
  }});

  res.json({
    posts: posts.map(( post ) => ({
    id: post._id,
    title: post.title,
    tags: post.tags,
    slug: post.slug,
    meta: post.meta,
    author: post.author,
    thumbnail: post.thumbnail?.url,
    createdAt: post.createdAt
    }))
  })
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  if(!isValidObjectId(postId)){
    return res.status(401).json({ error: 'Invalid request!' });
  };

  const post = await Post.findById(postId);
  if(!post){
    return res.status(404).json({ error: 'Post not found!😁' });
  }

  const public_id = post.thumbnail?.public_id;
  if(public_id){
    const { result } = await cloudinary.uploader.destroy(public_id);
    if(result !== 'ok') return res.status(404).json({ error: "Could not remove thumbnail!"});
  }

  await Post.findByIdAndDelete(postId);
  await removeFromFeaturedPost(postId);
  res.json({ message: "Post removed successfully!😊" });
};

exports.getFeaturedPosts = async (req, res) => {
  const featuredPosts = await FeaturedPost.find({}).sort({ createAt: -1 }).limit(4).populate('post');
  res.json({ 
    posts: featuredPosts.map(({ post }) => ({
    id: post._id,
    title: post.title,
    meta: post.meta,
    content: post.content,
    author: post.author,
    slug: post.slug,
    thumbnail: post.thumbnail?.url
  })) });
};

exports.getRelatedPosts = async (req, res) => {
  const { postId } = req.params;
  if(!isValidObjectId(postId)) return res.status(401).json({ error: "Invalid request!" });

  const post = await Post.findById(postId);
  if(!post) return res.status(404).json({ error: "Post not found!" });

  const relatedPosts = await Post.find({
    tags: { $in: [...post.tags ]},
    _id: { $ne: post._id },
  }).sort({ createdAt: -1 }).limit(5);

  res.json({
    posts: relatedPosts.map((post) => ({
      id: post._id,
      meta: post.meta,
      title: post.title,
      slug: post.slug,
      author: post.author,
      thumbnail: post.thumbnail?.url
    }))
  })
};

exports.uploadImage = async (req, res) => {
  const { file } = req;

  if(!file) return res.status(401).json({ error: "Image file is missing!" });

  const { secure_url: url } = await cloudinary.uploader.upload(
    file.path
  );

  res.status(201).json({ image: url });
};