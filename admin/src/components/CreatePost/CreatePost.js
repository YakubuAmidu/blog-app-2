import React, { useEffect, useState  } from 'react';

// React-router-dom
import { useNavigate } from "react-router-dom";

// Imported components
import { createPost } from '../../api/post';
import { useNotification } from '../../context/NotificationProvider';
import PostForm, { defaultPost } from '../PostForm/PostForm';

export default function CreatePost(){
    const [postInfo, setPostInfo] = useState(null);
    const [resetAfterSubmit, setResetAfterSubmit] = useState(false);
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const navigate = useNavigate();

    const handleSubmit = async (data) => {
      setBusy(true);
      const { error, post } = await createPost(data);
      setBusy(false);
      if(error) return updateNotification(error);
      
      setResetAfterSubmit(true);
      navigate(`/update-post/${post.slug}`);
    }

    useEffect(() => {
      const result = localStorage.getItem('blogPost');

      if(!result) return;

      const oldPost = JSON.parse(result);
        setPostInfo({ defaultPost, ...oldPost });
    }, []);

    return (
        <div>
            <PostForm 
            onSubmit={handleSubmit} 
            initialPost={postInfo} 
            busy={busy}
            postBtnTitle="Post"
            resetAfterSubmit={resetAfterSubmit}
            />
        </div>
    )
}