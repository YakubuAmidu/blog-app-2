import React from 'react';

// React router dom
import { Link } from 'react-router-dom';

// Date format
import dateFormat from 'dateformat';

// React-icons
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

export default function PostCard({ post, onDeleteClick }){
    if(!post) return null;

    const { title, tags, meta, slug, createdAt, thumbnail } = post;
      
  return (
    <div className="bg-white shadow-sm rounded flex flex-col">
        <img className="aspect-video" src={thumbnail || './blank.jpeg'} alt={title} />
        <div className="p-2 flex-1 flex flex-col justify-between">
        <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
        <p className="text-gray-500">{meta.substring(0, 80) + "..."}</p>
        
        <div className="flex justify-between py-2">
        <p className="text-gray-500 text-sm">
            {dateFormat(createdAt, 'mediumDate')}</p>
        <p className="text-gray-500 text-sm">{tags.join(', ')}</p>
        </div>

        <div className="flex space-x-3">
            <Link to={`/update-post/${slug}`} className="w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-600 flex justify-center items-center text-white p-2">
                <BsPencilSquare size={25} />
            </Link>
            <button 
            onClick={onDeleteClick} 
            className='w-8 h-8 rounded-full bg-red-400 hover:bg-red-600 flex justify-center items-center text-white p-2'>
                <BsTrash size={25} />
            </button>
        </div>
        </div>
    </div>
  )
}