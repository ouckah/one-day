import { Home, CalendarPlus, Settings } from 'lucide-react';

export const SideMenu = () => {
    return (
        <>
            <div className="flex flex-col w-1/5 bg-orange-400 justify-start items-center">
                
                {/* Logo */}
                <div className="w-20 h-20 bg-white m-10"/>

                {/* Nav Buttons */}
                <button className="flex flex-row w-full h-16 text-white text-xl font-bold uppercase bg-orange-400 justify-center items-center gap-3 transition-all duration-300 hover:bg-orange-500">
                    <Home size={36}/>
                    <h1 className='hidden md:inline'>Home</h1>
                </button>

                <button className="flex flex-row w-full h-16 text-white text-xl font-bold uppercase bg-orange-400 justify-center items-center gap-3 transition-all duration-300 hover:bg-orange-500">
                    <CalendarPlus size={36}/>
                    <h1 className='hidden md:inline'>Days</h1>
                </button>

                <button className="flex flex-row w-full h-16 text-white text-xl font-bold uppercase bg-orange-400 justify-center items-center gap-3 transition-all duration-300 hover:bg-orange-500">
                    <Settings size={36}/>
                    <h1 className='hidden md:inline'>Settings</h1>
                </button>

            </div>
        </>
    )
}

