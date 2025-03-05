import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = ({ children }) => {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    // Ensure children is always an array
    const childrenArray = React.Children.toArray(children);

    // Get left and right children, or defaults to null if not available
    const leftChild = childrenArray[0] || null;
    const rightChild = childrenArray[1] || null;

    return (
        <>
            {/* Full Navbar */}
            <div className="fixed top-0 left-0 w-full z-30 flex items-center justify-between bg-white p-4">
                {/* Left Side (Menu Button) */}
                <div className="flex items-center space-x-4">
                    <button onClick={handleNav} className="text-2xl bg-white p-2">
                        {!nav ? <Menu /> : <X />}
                    </button>
                </div>

                {/* Middle (Children) */}
                <div className="flex-1 flex justify-between mx-4">
                    {/* Left-aligned child */}
                    <div className="flex items-center">
                        {leftChild}
                    </div>

                    {/* Right-aligned child */}
                    <div className="flex items-center justify-end">
                        {rightChild}
                    </div>
                </div>

                {/* Right Side (Account) */}
                <div className="flex items-center space-x-4">
                    <Link to="/home" className="hover:opacity-75">
                        <CircleUser size={32} />
                    </Link>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <div className={`fixed pt-2 top-0 left-0 h-full w-72 md:w-96 bg-white border-r transition-transform duration-300 ${nav ? 'translate-x-0' : '-translate-x-96'}`}>
                <ul className='w-full text-center pt-16'>
                    <Link to="/home"><li className='p-4 border-b border-t border-gray-300 hover:text-gray-500 cursor-pointer'>My Dashboard</li></Link>
                    <Link to="/public-cards"><li className='p-4 border-b border-gray-300 hover:text-gray-500 cursor-pointer'>Public Cards</li></Link>
                    <Link to="#"><li className='p-4 border-b border-gray-300 hover:text-gray-500 cursor-pointer'>My Account</li></Link>
                </ul>
            </div>
        </>
    );
};


const NavbarTitle = ({ children }) => {
    return <h1 className="text-3xl font-bold">{children}</h1>;
};

const NavbarButton = ({ children, onClick }) => {
    return (
      <Button onClick={onClick}>
        {children}
      </Button>
    );
  };

export { Navbar, NavbarTitle, NavbarButton };
