import React, { useState, useEffect } from 'react';

// React-icons
import { ImSpinner11, ImEye, ImFilePicture, ImFileEmpty, ImSpinner3 } from 'react-icons/im';

// Imported components
import { uploadImage } from '../../api/post';
import { useNotification } from '../../context/NotificationProvider';
import MarkdownHint from '../MarkdownHint/MarkdownHint';
import DeviceView from "../DeviceView/DeviceView";

export const defaultPost = {
    title: "",
    content: "",
    tags: "",
    thumbnail: "",
    meta: "",
    featured: false
}

export default function PostForm({ initialPost, resetAfterSubmit, busy, postBtnTitle, onSubmit }){
    const [postInfo, setPostInfo] = useState({ ...defaultPost });
    const [selectedThumbnailURL, setSelectedThumbnailURL] = useState("");
    const [imageUrlToCopy, setImageUrlToCopy] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [displayMarkdownHint, setDisplayMarkdownHint] = useState(false);
    const [showDeviceView, setShowDeviceView] = useState(false);

    const { updateNotification } = useNotification();

    useEffect(() => {
     if(initialPost){
        setPostInfo({ ...initialPost });
        setSelectedThumbnailURL(initialPost?.thumbnail);
     }

        return () => {
            if (resetAfterSubmit) resetForm();
        }
    }, [initialPost, resetAfterSubmit]);


    const handleChange = ({ target }) => {
        const { value, name, checked } = target;

        if(name === "thumbnail"){
            const file = target.files[0];
            if(!file.type?.includes("image")){
                return updateNotification("error", "This is not an image...😔");
            }
            setPostInfo({ ...postInfo, thumbnail: file });
            return setSelectedThumbnailURL(URL.createObjectURL(file));
        }

        if(name === "featured"){
         localStorage.setItem("blogPost", JSON.stringify({ ...postInfo, featured: checked }));
         return setPostInfo({ ...postInfo, [name]: checked });
        };

        if(name === "tags"){
            const newTags = tags?.split(",");

            if(newTags?.length > 4) 
            updateNotification("Warning", "Only first four tags will be selected...👍");
        }

        if(name === "meta" && meta?.length >= 150){
            return setPostInfo({ ...postInfo, meta: value.substring(0, 149)});
        }

        const newPost = { ...postInfo, [name]: value };

         setPostInfo({ ...newPost });

        localStorage.setItem("blogPost", JSON.stringify(newPost));
    };

    const handleImageUpload = async ({ target }) => {
        if(imageUploading) return;

       const file = target.files[0];

       if(!file.type?.includes("image")){
        return updateNotification("error", "This is not an image...😔");
       }

       setImageUploading(true);

       const formData = new FormData();
       formData.append("image", file);

       const { error, image } = await uploadImage(formData);
       setImageUploading(false);
       if(error) return updateNotification("error", error);
       setImageUrlToCopy(image);
    };

    const handleOnCopy = () => {
        const textToCopy = `![Add image description](${imageUrlToCopy})`
        navigator.clipboard.writeText(textToCopy);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { title, content, tags, meta } = postInfo;

        if(!title?.trim()) return updateNotification("error", "Title is missing...😢");
        if(!content?.trim()) return updateNotification("error", "Content is missing...😢");
        if(!tags?.trim()) return updateNotification("error", "Tags are missing...😢");
        if(!meta?.trim()) return updateNotification("error", "Meta description is missing...😢");

        const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, " ")
        .split(" ")
        .filter(item => item.trim())
        .join("-");

        const newTags = 
        tags.split(",")
        .map(item => item.trim())
        .splice(0, 4);

        const formData = new FormData();
        const finalPost = {...postInfo, tags: JSON.stringify(newTags), slug };
        for(let key in finalPost){
            formData.append(key, finalPost[key]);
        }

        onSubmit(formData);
    }

    const resetForm = () => {
       setPostInfo({ ...defaultPost });
       localStorage.removeItem("blogPost");
    };

    const { title, content, featured, tags, meta } = postInfo;

    return (
        <>
        <form onSubmit={handleSubmit} className="p-2 flex">
            <div className="w-9/12 h-screen space-y-3 p-2 flex flex-col">
            {/* Title and submit */}
            <div className="flex items-center justify-between">
                <h1 className='text-xl font-semibold text-gray-700'>Create new Post</h1>

                <div className="flex items-center space-x-5">
                    <button 
                    onClick={resetForm}
                    type="button"
                    className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 text-blue-500 rounded h-10 hover:text-white hover:bg-blue-500 transition">
                         <ImSpinner11 /> 
                       <span>Reset</span> 
                    </button>
                    <button 
                    onClick={() => setShowDeviceView(true)}
                    type="button"
                    className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 text-blue-500 rounded h-10 hover:text-white hover:bg-blue-500 transition">
                        <ImEye />
                        <span>View</span>
                    </button>
                    <button className="h-10 w-36 hover:ring-1 bg-blue-500 rounded text-white hover:text-blue-500 hover:bg-transparent ring-blue-500 transition">
                        {
                            busy 
                            ? 
                            (
                            <ImSpinner3 className="animate-spin mx-auto text-xl" /> 
                            ) 
                            : 
                            (
                            postBtnTitle
                            )
                        }
                        </button>
                </div>
            </div>
              {/* Featured checkbox */}
            <div className="flex">
                <input name="featured" onChange={handleChange} id="featured" type="checkbox" value={featured} hidden/>
                <label className="select-none flex items-center space-x-2 text-gray-700 cursor-pointer group" htmlFor='featured'>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-blue-500">
                        {
                            featured && (
                                <div  className="w-2 h-2 rounded-full bg-gray-700 group-hover:border-blue-500"/>
                            )
                        }
                    </div>
                    <span className="group-hover:text-blue-500">Featured</span>
                </label>
            </div>

            {/* Title input */}
            <input onChange={handleChange} value={title} onFocus={() => setDisplayMarkdownHint(false)} name="title" type="text" className='text-xl outline-none focus:ring-1 rounded w-full p-2 font-semibold' placeholder='Post title...' />

            {/* Image input */}
            <div className="flex space-x-2">
                        <div>
                        <input onChange={handleImageUpload} id="image-input" type="file" hidden/>
                        <label 
                            htmlFor="image-input"
                            className="flex items-center space-x-2 px-3 ring-1 ring-gray-500 text-gray-700 rounded h-10 hover:text-white hover:bg-gray-500 transition cursor-pointer">
                          <span>Place image</span>
                          {
                            !imageUploading 
                            ? 
                            (
                              <ImFilePicture />
                            )
                             : 
                            (
                              <ImSpinner3 className='animate-spin'/>
                             )
                        }
                        </label>
                        </div>
        {
            imageUrlToCopy && (
                <div className='flex flex-1 bg-gray-400 justify-between overflow-hidden rounded'>
                <input type="text" value={imageUrlToCopy} className="bg-transparent p-2 text-white w-full" disabled/>
                <button onClick={handleOnCopy} type="button" className="text-xs flex flex-col items-center justify-center self-stretch p-1 bg-gray-700 text-white">
                    <ImFileEmpty />
                    <span>Copy</span>
                </button>
            </div>
            )
        }
            </div>

            <textarea onChange={handleChange} value={content} onFocus={() => setDisplayMarkdownHint(true)} name="content" className="text-xl resize-none outline-none focus:ring-1 rounded w-full p-2 flex-1 font-mono tracking-wide text-lg" placeholder='## Markdown...'></textarea>

            {/* Tags input */}
            <div>
                <label className="text-gray-500" htmlFor="tags">Tags</label>
                <input onChange={handleChange} value={tags} name="tags" type="text" id="tags" placeholder="Tag one, Tag two" className="outline-none focus:ring-1 rounded p-2 w-full"/>
            </div>

            {/* Meta description input */}
            <div>
                <label className="text-gray-500" htmlFor="meta">Meta Description {meta?.length} / 150</label>
                <textarea onChange={handleChange} value={meta} name="meta" id="meta" className="text-xl resize-none outline-none focus:ring-1 rounded w-full p-2 h-28" placeholder="Meta description..."></textarea>
            </div>
            </div>

            <div className="w-1/4 p-2 relative">
                <h1 className="text-xl font-semibold text-gray-700 mb-2">Thumbnail</h1>
                <div>
                    <input onChange={handleChange} name="thumbnail" type="file" id="thumbnail" hidden/>
                    <label className="cursor-pointer" htmlFor="thumbnail">
                        {
                            selectedThumbnailURL 
                            ? 
                            ( 
                            <img src={selectedThumbnailURL} alt="thumbnail" className="aspect-video shadow-sm rounded"/> 
                            )
                            : 
                            (
                                <div className="border border-dashed border-gray-500 aspect-video flex flex-col items-center justify-center 
                                text-gray-500">
                                 <span>Select thumbnail.</span>
                                 <span className="text-xs">Recommended size.</span>
                                 <span className="text-xs">1280 * 700.</span>
                                </div>
                            )
                        }
                    </label>
                </div>

                 {/* Markdown rules */}
                 <div className="absolute top-1/2 -translate-y-1/2">
                    {
                        displayMarkdownHint && <MarkdownHint />
                    }
                 </div>
            </div>
        </form>
       
       <DeviceView visible={showDeviceView} title={title} content={content} thumbnail={selectedThumbnailURL} onClose={() => setShowDeviceView(false)}/>
        </>
    )
}