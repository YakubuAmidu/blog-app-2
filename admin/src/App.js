import React, { useState } from 'react'
import { AiOutlineMenuFold } from 'react-icons/ai';
import { AiOutlineMenuUnfold } from 'react-icons/ai';

// React-router-dom
import { Routes, Route } from 'react-router-dom';

// Imported components
import Home from './components/Home/Home';
import CreatePost from './components/CreatePost/CreatePost';
import UpdatePost from './components/UpdatePost/UpdatePost';
import NotFound from './components/NotFound/NotFound';
import Navbvar from './components/Navbar/Navbar';
import  SearchForm from './components/SearchForm/SearchdForm';

export default function App(){
  const [closedNav, setClosedNav] = useState(false);

  const toggleNav = () => {
     setClosedNav(!closedNav);
  };

  const getNavWidth = () => closedNav ? 'w-16' : 'w-56';

  return (
    <div className='flex'>
      {/* Nav section */}
        <div className={getNavWidth() + " min-h-screen bg-red-100 transition-width border border-r"}>

          <div className='sticky top-0'>
           <Navbvar closed={closedNav}/>
          </div>
        </div>

      {/* Content section */}
      <div className='flex-1 min-h-screen bg-gray-100'>
        <div className='sticky top-0'>
        <div className='flex item-center p-2 space-x-2'>
        <button onClick={toggleNav}>
          { 
            closedNav ? 
            (
              <AiOutlineMenuFold size={40} />
            )
            : 
            (
              <AiOutlineMenuUnfold size={40} />
            )
          }
        </button>

        <SearchForm />
        </div>
        </div>
      
        <div className="max-w-screen-lg mx-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:slug' element={<UpdatePost />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
