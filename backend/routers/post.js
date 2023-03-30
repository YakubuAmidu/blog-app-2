// Router
const router = require('express').Router();

// Imported Posts
const { createPost } = require('../controllers/post');
const { updatePost } = require('../controllers/post');
const { getPost } = require('../controllers/post');
const { getPosts } = require('../controllers/post');
const { searchPost } = require('../controllers/post');
const { deletePost } = require('../controllers/post');
const { getFeaturedPosts } = require('../controllers/post');
const { getRelatedPosts } = require('../controllers/post');
const { uploadImage } = require('../controllers/post');

// Middleware
const { postValidator, validate } = require('../middleware/postValidator');

// Multer
const multer = require('../middleware/multer');

// Middleware
const { parseData } = require('../middleware');

// Created routes
router.post('/create', 
multer.single('thumbnail'), 
parseData, 
postValidator, 
validate, 
createPost
);

router.put('/:postId', 
multer.single('thumbnail'), 
parseData, 
postValidator, 
validate,
updatePost
);

router.get('/single/:slug', getPost);
router.get('/posts', getPosts);
router.get('/search', searchPost);
router.delete('/:postId', deletePost);
router.get('/featured-posts', getFeaturedPosts);
router.get('/related-posts/:postId', getRelatedPosts);
router.post('/upload-image', multer.single('image'), uploadImage);

module.exports = router;