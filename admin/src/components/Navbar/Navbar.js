import React from 'react';

// React-icons
import { AiOutlineHome } from 'react-icons/ai'
import { AiFillFileAdd } from 'react-icons/ai';

// React router dom NavLink
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, value, closed, Icon }) => {
    const commonClasses = "flex items-center space-x-2 w-full p-2 block whitespace-nowrap";
    const activeClass = commonClasses + " bg-blue-500 text-white";
    const inActiveClass = commonClasses + " tex-gray-500";

    return (
    <NavLink className={({ isActive }) => (isActive ? activeClass 
    : 
    inActiveClass)} to={to}>
        {Icon}
        <span 
        className={closed ? 'w-0 transition-width overflow-hidden' 
        : 
        'w-full transition-width overflow-hidden'}>{value}</span>
    </NavLink>
    );
}

export default function Navbar({ closed }){
    return (
       <nav>
        <div className="flex justify-center p-2">
            <img className="w-100" src="./favicon.ico" alt="logo"/>
        </div>
        <ul>
            <li>
                <NavItem closed={closed} to='/' value='Home' Icon={<AiOutlineHome size={30}/>} />
            </li>
            <li>
            <NavItem closed={closed} to='/create-post' value='Create Post' Icon=
            {<AiFillFileAdd size={30}/>} />
            </li>
        </ul>
       </nav>
    )
}