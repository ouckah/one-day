'use client'
import { useState, MouseEvent, useEffect } from "react";
import { X, Trash2, Clock, MapPin, AlignLeft } from 'lucide-react';

export const DayScheduler = () => {
    enum Status {
        Empty = 0,
        Red,
        Orange,
        Yellow,
        Blue,
        Green,  
    }
    interface Appointment {
        start: string,
        end: string, 
        location: string, 
        description: string, 
    }
    const NULL_APPOINTMENT_KEY = "NULL";

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
    const [slots, setSlots] = useState([
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
        { status: Status.Empty, appointmentKey: NULL_APPOINTMENT_KEY },
    ])

    const [selected, setSelected] = useState<Appointment>();
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");

    const [state, setState] = useState<{ appointments: { [key: string]: Appointment }; }>({
        appointments: {
            "0:00": {
                start: "0:00",
                end: "1:00",
                location: "Somewhere, US",
                description: "Test appointment."
            }
        },
    });

    const handleAppointment = (e: MouseEvent, key: number) => {
        e.preventDefault();

        const slot = slots[key];
        
        // check if slot is occupied
        if (slots[key].status == Status.Empty) {
            const startTime = times[key];
            const endTime = key != times.length - 1 ? times[key + 1] : times[0];

            const newAppointment: { [appointmentKey: string]: Appointment } = {};
            newAppointment[startTime] = {
                start: startTime,
                end: endTime,
                location: "",
                description: "",
            };

            addAppointment(newAppointment);
        } else {
            const time = slot.appointmentKey
            selectAppointment(time);
        }
    }

    const renderAppointments = () => {
        const keys = Object.keys(state.appointments);

        // loop through each appointment in appointments
        for (const key of keys) {
            const appointment = state.appointments[key];

            const startTime = appointment.start;
            const endTime = appointment.end;
            const startIndex = times.indexOf(startTime);
            const endIndex = times.indexOf(endTime);
            
            // loop through each slot index and set
            // slot status to active color
            for (let i = startIndex; i < endIndex; i++) {
                slots[i].status = Status.Orange;
                slots[i].appointmentKey = startTime;
            }
        }
    }
    renderAppointments();

    const addAppointment = (appointment: { [appointmentKey: string]: Appointment }) => {
        const startTime = Object.keys(appointment)[0]; // Extract the start time from the keys of the appointment object
        const appointmentContent = appointment[startTime];
        
        // update the slot statuses
        const startIndex = times.indexOf(appointment[startTime].start);
        const endIndex = times.indexOf(appointment[startTime].end);

        let updatedSlots = slots;
        for (let i = startIndex; i < endIndex; i++) {
            updatedSlots[i].status = Status.Orange;
            updatedSlots[i].appointmentKey = startTime;
        }
        setSlots(updatedSlots);
    
        // Create a new copy of the appointments object with the new appointment added
        const updatedAppointments = {
            ...state.appointments,
            ...appointment,
        };
    
        setState({
            ...state,
            appointments: updatedAppointments,
        });

        setSelected(appointmentContent);
    };

    const selectAppointment = (appointmentKey: string) => {
        const appointment = state.appointments[appointmentKey];
        setSelected(appointment);
        setAppointmentFields(appointment);
    }

    const setAppointmentFields = (data: Appointment) => {
        setSelectedStartTime(data.start);
        setSelectedEndTime(data.end);
        setSelectedLocation(data.location);
        setSelectedDescription(data.description);
    }
     
    const clearSelectedAppointment = () => {
        if (!selected) return;
        setSelected({start: '', end: '', location: '', description: ''});
    }

    const deleteSelectedAppointment = () => {
        if (!selected) return;
        const appointmentKey = selected.start;
        const appointment = state.appointments[appointmentKey];

        // delete from appointments
        let updatedAppointments = state.appointments;
        delete updatedAppointments[appointmentKey];

        // delete slots (update slot statuses)
        let updatedSlots = slots;
        const startTime = appointment.start;
        const endTime = appointment.end;
        const startIndex = times.indexOf(startTime);
        const endIndex = times.indexOf(endTime);

        // set slot range of appointment to empty
        for (let i = startIndex; i < endIndex; i++) {
            updatedSlots[i].status = Status.Empty;
        }

        // update slots state
        setSlots(updatedSlots);

        // update state
        setState({
            ...state,
            appointments: updatedAppointments,
        });

        // clear selection
        clearSelectedAppointment();
    }

    const saveSelectedAppointment = () => {
        if (!selected) return;
        const appointmentKey = selected.start;

        // update selected appointment
        const updatedAppointments = state.appointments;
        updatedAppointments[appointmentKey] = {
            start: selectedStartTime,
            end: selectedEndTime,
            location: selectedLocation,
            description: selectedDescription
        };

        // update statuses
        // get original start and end time
        const startTime = selected.start;
        const endTime = selected.end;
        const startIndex = times.indexOf(startTime);
        const endIndex = times.indexOf(endTime);

        // get new start and end time
        const newStartIndex = times.indexOf(selectedStartTime);
        const newEndIndex = times.indexOf(selectedEndTime);

        let updatedSlots = slots;

        // clear old appointment statuses
        for (let i = startIndex; i < endIndex; i++) {
            updatedSlots[i].status = Status.Empty;
            updatedSlots[i].appointmentKey = NULL_APPOINTMENT_KEY;
        }
        // add new appointment statuses
        for (let i = newStartIndex; i < newEndIndex; i++) {
            updatedSlots[i].status = Status.Orange;
            updatedSlots[i].appointmentKey = selectedStartTime;
        }

        // update status state
        setSlots(updatedSlots);

        // update state
        setState({
            ...state,
            appointments: updatedAppointments,
        });

    }

    useEffect(() => {
        selected?.start ? selectAppointment(selected.start) : null
    }, [selected])

    return (
        <>
            <div className="flex flex-row w-full h-full bg-black">
                
                <div className="flex flex-col w-1/2 h-full bg-gray-200 rounded-2xl py-3">
                    <div className="w-full h-full overflow-y-scroll no-scrollbar">
                        {
                            times.map((time, index) => {
                                const slot = slots[index];

                                let appointmentKey, appointment, startTime, endTime;
                                if (slot.status != Status.Empty) {
                                    appointmentKey = slot.appointmentKey;
                                    appointment = state.appointments[appointmentKey];
                                    startTime = appointment.start;

                                    // have to get time before this time, since
                                    // end time is exclusive in appointment range
                                    const end = appointment.end;
                                    const endIndex = times.indexOf(end);
                                    endTime = times[endIndex - 1];
                                }

                                const appointmentBodyStyle = "w-5/6 h-24 self-start bg-" + "orange" + "-500";
                                const appointmentHeaderStyle = "w-5/6 h-24 self-start bg-" + "orange" + "-500" + " rounded-t-2xl";
                                const appointmentFooterStyle = "w-5/6 h-20 self-start bg-" + "orange" + "-500" + " rounded-b-2xl";
                                const appointmentSingleStyle = "w-5/6 h-20 self-start bg-" + "orange" + "-500" + " rounded-t-2xl" + " rounded-b-2xl"

                                return (
                                    <button 
                                        className="flex flex-row justify-start items-start w-full h-24 p-5 gap-5 bg-green-500" 
                                        onClick={(e) => handleAppointment(e, index)} key={index}
                                    >
                                        <h1>{time}</h1> 
                                        {
                                            slot.status != Status.Empty ? 
                                            (

                                                // single appointment (full rounded)
                                                time == startTime && time == endTime ? 
                                                (
                                                    <div className={appointmentSingleStyle}>
                                                        
                                                    </div>
                                                ) : (
                                                    
                                                    // header
                                                    time == startTime ? 
                                                    (
                                                        <div className={appointmentHeaderStyle}>
                                                            
                                                        </div>
                                                    ) : (

                                                        // footer
                                                        time == endTime ? 
                                                        (
                                                            <div className={appointmentFooterStyle}>
                                                                
                                                            </div>
                                                        ) : 

                                                        // body
                                                        (
                                                            <div className={appointmentBodyStyle}>
                                                                
                                                            </div>
                                                        )

                                                    )
                                                )

                                            ) : (<></>)
                                        }
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="flex flex-col justify-start items-start w-1/2 h-full bg-gray-200 rounded-2xl p-3">
                    {
                        selected?.start ? (
                            <>

                                <div className="flex flex-row justify-between items-center w-full h-24 px-5">
                                    <X className="cursor-pointer" onClick={clearSelectedAppointment}/>
                                    <input className="w-1/2 h-12 bg-gray-200 border-b-gray-500 border-b-2 text-gray-500 text-lg font-bold p-3 focus:outline-none"/>
                                    <Trash2 className="cursor-pointer" onClick={deleteSelectedAppointment}/>
                                </div>

                                <div className="flex flex-col w-full h-full px-24 py-10 gap-10">
                                    <div className="flex flex-row items-center w-full h-16 gap-4">
                                        <Clock />
                                        <input 
                                            className="flex text-center w-1/4 h-full rounded-2xl focus:outline-none" 
                                            placeholder={selected.start}
                                            onChange={(e) => setSelectedStartTime(e.target.value)}
                                            value={selectedStartTime}
                                        />
                                        <h1>to</h1>
                                        <input 
                                            className="flex text-center w-1/4 h-full rounded-2xl focus:outline-none"
                                            placeholder={selected.end} 
                                            onChange={(e) => setSelectedEndTime(e.target.value)}
                                            value={selectedEndTime}
                                        />
                                    </div>

                                    <div className="flex flex-row items-center w-full h-16 gap-4">
                                        <MapPin />
                                        <input 
                                            className="flex w-full h-full rounded-2xl p-8 focus:outline-none"
                                            placeholder={selected.location}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            value={selectedLocation}
                                        />
                                    </div>

                                    <div className="flex flex-row items-start w-full h-16 gap-4">
                                        <AlignLeft />
                                        <input 
                                            className="flex w-full h-full rounded-2xl p-8 focus:outline-none"
                                            placeholder={selected.description}
                                            onChange={(e) => setSelectedDescription(e.target.value)}
                                            value={selectedDescription}
                                        />
                                    </div>

                                    <div className="flex flex-row justify-evenly items-center w-full h-16 gap-4">
                                        <button onClick={saveSelectedAppointment}>Save</button>
                                        <button>Cancel</button>
                                    </div>
                                </div>
                            
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