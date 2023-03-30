import React from 'react';

// Markdown
import Markdown from 'markdown-to-jsx';

export default function DeviceView({ visible, thumbnail, title, onClose, content }){
    if(!visible) return null;

    const handleOnClose = (e) => {
        if(e.target.id === "container") return onClose();
    }

    return (
            <div id="container" onClick={handleOnClose} className='bg-gray-500 bg-opacity-50 fixed inset-0 backdrop-blur-sm flex justify-center items-center'>
              <div className="bg-white w-device-width h-device-height rounded overflow-auto">
              <img src={thumbnail} alt="" className="aspect-video" />
              <div className="px-2">
              <h1 className="font-semibold text-xl text-gray-700 py-2">{title}</h1>
              <div className="prose prose-sm">
              <Markdown>{content}</Markdown>
              </div>
              </div>
              </div>
            </div>
    )
}