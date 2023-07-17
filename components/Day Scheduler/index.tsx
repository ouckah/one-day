'use client'
import { useState, MouseEvent, useEffect } from "react";

export const DayScheduler = () => {

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

    const [selected, setSelected] = useState<{
        start: string; end: string 
    }>();
    const [state, setState] = useState<{
        appointments: { [key: string]: { start: string; end: string } };
        startTimes: string[];
    }>({
        appointments: {
            "0:00": {
                start: "0:00",
                end: "1:00",
            }
        },
        startTimes: [
            "0:00",
        ]
    });

    const handleAppointment = (e: MouseEvent, key: number) => {
        e.preventDefault();

        const time = times[key];

        // check if new appointment
        if (!state.startTimes.includes(time)) {
            const startTime = times[key];
            const endTime = key != times.length - 1 ? times[key + 1] : times[0];

            const newAppointment: { [appointmentKey: string]: { start: string, end: string } } = {};
            newAppointment[startTime] = {
                start: startTime,
                end: endTime,
            };

            addAppointment(newAppointment);
        } else {
            selectAppointment(time);
        }
    }

    // TODO: when a new appointment is added, selected state does not change in time
    // TODO: to reflect the changes on the right side of component.
    const addAppointment = (appointment: { [key: string]: { start: string; end: string } }) => {
        const startTime = Object.keys(appointment)[0]; // Extract the start time from the keys of the appointment object
      
        // Update the startTimes array with the new start time
        const updatedStartTimes = [...state.startTimes, startTime];
      
        // Create a new copy of the appointments object with the new appointment added
        const updatedAppointments = {
          ...state.appointments,
          ...appointment,
        };
      
        setState({
          ...state,
          appointments: updatedAppointments,
          startTimes: updatedStartTimes,
        });

        selectAppointment(startTime);
      };

    const selectAppointment = (key: string) => {
        const appointment = state.appointments[key];
        setSelected(appointment);
    }

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    return (
        <>
            <div className="flex flex-row w-full h-full bg-black">
                
                <div className="flex flex-col w-1/2 h-full bg-gray-200 rounded-2xl py-3">
                    <div className="w-full h-full overflow-y-scroll no-scrollbar">
                        {
                            times.map((time, index) => (
                                <button 
                                    className="flex flex-row justify-start items-center w-full h-24 p-5 gap-5 bg-green-500" 
                                    onClick={(e) => handleAppointment(e, index)} key={index}
                                >
                                    <h1>{time}</h1>
                                    {
                                        state.startTimes.includes(time) ? (
                                            <div className="w-5/6 h-full bg-orange-500">

                                            </div>
                                        ) : (<></>)
                                    }
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col w-1/2 h-full bg-gray-200 rounded-2xl py-3">
                    {
                        selected ? (
                            <>
                            
                                <h1>{selected.start}</h1>
                                <h1>{selected.end}</h1>
                            
                            </>
                        ) : (
                            <>
                            
                                <h1>none.</h1>
                            
                            </>
                        )
                    }
                </div>
            
            </div>
        </>
    )

}