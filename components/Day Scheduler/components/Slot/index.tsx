'use client'

import { Status } from "@/types/dist";

export const Slot = ({ title, color, header, footer }: {
    title: string,
    color: Status,
    header?: Boolean,
    footer?: Boolean,
}) => {

    // dont render if no appointment status
    if (color === Status.Empty) return null

    const backgroundColor = color as string;
    return (
        <>
            
            {/* Single Appointment (full rounded) */}
            {
                header && footer &&
                <>
                    <div className="w-5/6 h-20 self-start rounded-t-2xl">
                        <div className={`flex flex-row justify-start w-full h-1/5 bg-${backgroundColor}-800 rounded-t-2xl`}>
                            <h1 className="text-white font-bold px-5">
                                {title}
                            </h1>
                        </div>
                        <div className={`w-full h-4/5 bg-${backgroundColor}-200 rounded-b-2xl`}>

                        </div>
                    </div>
                </>
            }

            {/* Header */}
            {
                header && !footer &&
                <>
                    <div className="w-5/6 h-24 self-start rounded-t-2xl">
                        <div className={`flex flex-row justify-start w-full h-1/5 bg-${backgroundColor}-800 rounded-t-2xl`}>
                            <h1 className="text-white font-bold px-5">
                                {title}
                            </h1>
                        </div>
                        <div className={`w-full h-4/5 bg-${backgroundColor}-200`}>

                        </div>
                    </div>
                </>
            }

            {/* Footer */}
            {
                !header && footer &&
                <>
                    <div className={`flex flex-row justify-start w-5/6 h-20 bg-${backgroundColor}-200 rounded-b-2xl`}>
                        
                    </div>
                </>
            }

            {/* Body */}
            {
                !header && !footer &&
                <>
                    <div className={`flex flex-row justify-start w-5/6 h-24 bg-${backgroundColor}-200`}>

                    </div>
                </>
            }
        </>
    )
}