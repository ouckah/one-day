export const SideMenu = () => {
    return (
        <>
            <div className="flex flex-col w-1/5 bg-orange-400 items-center justify-start">
                
                {/* Logo */}
                <div className="w-20 h-20 bg-black m-10"/>

                {/* Nav Buttons */}
                <button className="w-full h-16 bg-orange-400 transition-all duration-300 hover:bg-orange-500">Home</button>
                <button className="w-full h-16 bg-orange-400 transition-all duration-300 hover:bg-orange-500">Days</button>
                <button className="w-full h-16 bg-orange-400 transition-all duration-300 hover:bg-orange-500">Settings</button>

            </div>
        </>
    )
}

