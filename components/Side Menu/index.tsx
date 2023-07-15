'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, CalendarPlus, Settings } from 'lucide-react';

export const SideMenu = () => {

    // tabs for the nav bar
    const options = [
        {
            name: "home",
            icon: <Home size={36} />,
        }, 
        {
            name: "days", 
            icon: <CalendarPlus size={36} />,
        },
        {
            name: "settings",
            icon: <Settings size={36} />,
        },
    ];

    // get the current route
    const currentRoute = usePathname();

    const inactiveStyle = "flex flex-row w-full h-16 bg-orange-400 justify-center items-center gap-3 transition-all duration-300 hover:bg-orange-500"
    const activeStyle = "flex flex-row w-full h-16 bg-orange-500 justify-center items-center gap-3 transition-all duration-300 hover:bg-orange-500"

    return (
        <>
            <div className="flex flex-col w-1/5 bg-orange-400 justify-start items-center">
                
                {/* Logo */}
                <div className="w-20 h-20 bg-white m-10"/>

                {/* Nav Buttons */}
                {
                    options.map((option) => (
                        <Link className="w-full" href={option.name === "home" ? ("/") : (option.name)} key={option.name}>
                            <button className={((currentRoute === "/" && option.name === "home") || (currentRoute === "/" + option.name)) ? (activeStyle) : (inactiveStyle)}>
                                {option.icon}
                                <h1 className='text-white text-xl font-bold uppercase hidden md:inline'>{option.name}</h1>
                            </button>
                        </Link>
                    ))
                }

            </div>
        </>
    )
}

