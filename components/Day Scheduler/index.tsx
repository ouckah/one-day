'use client'
export const DayScheduler = ({ }) => {

    const times = [
        "0:00",
        "0:30",
        "1:00",
        "1:30",
        "2:00",
        "2:30",
        "3:00",
        "3:30",
        "4:00",
        "4:30",
        "5:00",
        "5:30",
    ];

    return (
        <>
        
            <div className="flex flex-col w-full h-full bg-gray-200 rounded-2xl py-3">
                <div className="w-full h-full overflow-y-scroll no-scrollbar">
                    {
                        times.map((time, index) => (
                            <div className="flex flex-row w-full h-24 bg-green-500" key={index}>
                                <h1>{time}</h1>
                            </div>
                        ))
                    }
                </div>
            </div>
        
        </>
    )

}