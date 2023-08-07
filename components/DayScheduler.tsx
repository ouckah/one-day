'use client'
//using immutable to help with not causing state side affects with updating state
// spread operator doesn't work if spreading reference types (anything outside a primitive)
import { Map as ImmutableMap } from "immutable";
import { useState, useEffect, MouseEvent } from "react";
import { Appointment, SlotState, Status } from "@/types/scheduler";
import { isNull, notNull } from "@/utils";
import { X, Trash2, Clock, MapPin, AlignLeft, CalendarCheck } from 'lucide-react';
import Slot from "./Slot";

export default function DayScheduler(): JSX.Element {
    const NULL_APPOINTMENT_KEY = "NULL";

    const DEFAULT_APPOINTMENT: Appointment = {
        title: "Title",
        start: "",
        end: "",
        location: "",
        description: "",
    };

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

    const [slots, setSlots] = useState<ImmutableMap<string, SlotState>>(ImmutableMap(times.map(time => ([time, {
        status: Status.Empty,
    }]))));

    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
    const [state, setState] = useState<ImmutableMap<string, Appointment>>(ImmutableMap());

    function onSlotClick(time: string) {
        const slot = slots.get(time)!;
        
        // if we don't have an appointment set in this slot, lets make one.
        if (slot.status == Status.Empty) {
            const index = times.indexOf(time);
            // TODO: discuss why you are using beginning time if we chose the end, I would expect to set end time to the start time.
            // seems like edge case of selecting 5:30 causes problems. Might make it so 5:30 can't be a start time?
            // changed to current time to indicate that block and that block only since that is what makes the most sense.
            let end = index !== -1 || index !== times.length - 1 ? times[index + 1]! : time!; // times[0]!;

            // if the block after is already committed to an appointment, default this one to
            end = slots.get(end)!.status !== Status.Empty ? time : end;
            const newAppointment: Appointment = {
                ...DEFAULT_APPOINTMENT,
                start: time,
                end,
            }
            
            // important: I am making new objects for both sets to ensure that they don't
            // both reference the same object. (this could lead to side affects if you accidentally modify the state in either reference)
            // this usually isn't a problem as long as functions don't violate react hook rules, but its pretty easy to accidentally do.
            // so I am doing it deliberately so I have a chance to explain it.
            setSelectedAppointment({ ...newAppointment });
            setState(state.set(time, { ...newAppointment }));

            // utilizing the benefits of immutable allowing us to set the statuses.
            // it returns new map so we don't have to worry about side affects due to ref types.
            // otherwise using normal map i would have had to make a new map then modify that.
            setSlots(slots
                .set(time, { status: Status.Orange, appointmentKey: time })
                .set(end, { status: Status.Orange, appointmentKey: time }));
        } else {
            const appointment = state.get(time);
            if (appointment == undefined) {
                console.warn("Selected a slot whose status indicates it has an appointment but no appointment was found.")
                return;
            } else setSelectedAppointment({ ...appointment });
        }
    }

    function onTrayUseDay() {
        // TODO implement behavior
    }

    function onTraySave() {
        // TODO implement behavior
    }
     
    function onAppointmentDelete() {
        if (isNull(selectedAppointment)) return;

        const startIndex = times.indexOf(selectedAppointment.start);
        const endIndex = times.indexOf(selectedAppointment.end);
        let newSlots = slots;
        
        // technically this will "set" twice if start and end are the same time but eh not a big concern
        for (let i = startIndex; i <= endIndex; i++) {
            // don't try to set a slot for -1, means no start. this is probably a bug
            // so log a warning
            if (i === -1) {
                console.warn(`Appointment: ${selectedAppointment.start} has negative index for delete: ${selectedAppointment.start}: ${startIndex}, ${selectedAppointment.end}: ${endIndex}`);
                continue;
            }
            const time = times[i];
            newSlots = newSlots.set(time, { status: Status.Empty });
        }

        // update the slots
        setSlots(newSlots);
        setSelectedAppointment(undefined);
        setState(state.remove(selectedAppointment.start));
    }

    function onAppUpdate(update: Appointment) {
        if (isNull(selectedAppointment)) return;

        const oldStartIndex = times.indexOf(selectedAppointment.start);
        const newStartIndex = times.indexOf(update.start);
        const startIndex = Math.max(oldStartIndex, newStartIndex);

        const oldEndIndex = times.indexOf(selectedAppointment.end);
        const newEndIndex = times.indexOf(update.end);
        const endIndex = Math.max(oldEndIndex, newEndIndex);


        let newSlots = slots;
        // technically this will "set" twice if start and end are the same time but eh not a big concern
        for (let i = startIndex; i <= endIndex; i++) {
            // don't try to set a slot for -1, means no start. this is probably a bug
            // so log a warning
            if (i === -1) {
                console.warn(`Appointment: ${selectedAppointment.start} has negative index for delete: ${selectedAppointment.start}: ${startIndex}, ${selectedAppointment.end}: ${endIndex}`);
                continue;
            }
            const time = times[i];
            newSlots = newSlots.set(time, i < newStartIndex || i > newEndIndex ? { status: Status.Empty } : { status: Status.Orange, appointmentKey: update.start });
        }

        setSlots(newSlots);
        setSelectedAppointment(undefined); // may not want to deselect on update 🤷‍♂️ if so remove this line
        setState(state.set(update.start, { ...update }));
    }

    return (
        <>
            <div className="flex flex-row w-full h-full bg-black">

                {/* Main Appointment Display */}
                <div className="w-full h-full bg-white overflow-y-scroll no-scrollbar">
                    {slots.toArray().sort().map(([time, slotState]) => {
                        const app = notNull(slotState.appointmentKey) ? state.get(slotState.appointmentKey) : undefined;
                        //instead of a confusing ternary operator, move the conditional to the component so its easier to read what is actually happening
                        // again, we identifying what actually needs to be be conditional and limiting the complexity of our branching logic.
                        return (
                            <button
                                className="flex flex-row justify-start items-start w-full h-24 p-2 gap-5 white border-dashed border-black border-y border-collapse"
                                onClick={() => onSlotClick(time)}
                                key={time}
                            >
                                <h1>{time}</h1>
                                <Slot status={slotState.status} header={time === app?.start} footer={time === app?.end} title={app?.title} />
                            </button>
                        );
                    })}
                </div>

                {/* Tray Holder */}
                <div className="flex flex-col justify-start items-start w-1/2 h-full bg-gray-200 p-3">
                    {notNull(selectedAppointment) ?
                        <EditTray
                            app={selectedAppointment}
                            onDeselect={() => setSelectedAppointment(undefined)}
                            onDelete={onAppointmentDelete}
                            onSave={onAppUpdate}
                        /> :
                        <DefaultTray onUseDate={onTrayUseDay} onSave={onTraySave} />
                    }
                </div>
            </div>
        </>
    )

}

interface EditTrayProps {
    app: Appointment,
    onDeselect: () => void,
    onDelete: () => void,
    onSave: (app: Appointment) => void
}

function EditTray({ app, onDeselect, onDelete, onSave }: EditTrayProps): JSX.Element {
    const [title, setTitle] = useState(app.title);
    const [start, setStart] = useState(app.start);
    const [end, setEnd] = useState(app.end);
    const [description, setDescription] = useState(app.description);
    const [location, setLocation] = useState(app.location);

    /*
      TODO: input validation should probably happen to make sure the times are valid times.
      could do some sort of autocomplete system or do a select/dropdown to select a time.

      should also make sure you don't allow selecting an end time before the start time.

      you could do validation on the "onSave" onClick and display an invalid message with the issue
      just some thoughts.
      another validation would be to make sure you don't overlap an existing appointment since that isn't supported currently.
     */

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full h-24 px-5">
                <X className="cursor-pointer" onClick={onDeselect} />
                <input
                    className="w-1/2 h-12 bg-gray-200 border-b-gray-500 border-b-2 text-gray-500 text-lg font-bold p-3 focus:outline-none"
                    onChange={e => setTitle(e.currentTarget.value)}
                    value={title}
                />
                <Trash2 className="cursor-pointer" onClick={onDelete} />
            </div>
            <div className="flex flex-col w-full h-full px-24 py-10 gap-10">
                <div className="flex flex-row items-center w-full h-16 gap-4">
                    <Clock />
                    <input
                        className="flex text-center w-1/4 h-full rounded-2xl focus:outline-none"
                        onChange={e => setStart(e.currentTarget.value)}
                        value={start}
                    />
                    <h1>to</h1>
                    <input
                        className="flex text-center w-1/4 h-full rounded-2xl focus:outline-none"
                        onChange={e => setEnd(e.currentTarget.value)}
                        value={end}
                    />
                </div>
                <div className="flex flex-row items-center w-full h-16 gap-4">
                    <MapPin />
                    <input
                        className="flex w-full h-full rounded-2xl p-8 focus:outline-none"
                        onChange={e => setLocation(e.currentTarget.value)}
                        value={location}
                    />
                </div>

                <div className="flex flex-row items-start w-full h-16 gap-4">
                    <AlignLeft />
                    <input
                        className="flex w-full h-full rounded-2xl p-8 focus:outline-none"
                        onChange={e => setDescription(e.currentTarget.value)}
                        value={description}
                    />
                </div>

                <div className="flex flex-row justify-evenly items-center w-full h-16 gap-4">
                    <button onClick={() => onSave({
                        description,
                        end,
                        location,
                        start,
                        title
                    })}>Save</button>
                    <button onClick={onDeselect}>Cancel</button>
                </div>
            </div>
        </>
    );
}

function DefaultTray({ onUseDate, onSave }: { onUseDate: () => void, onSave: () => void }): JSX.Element {
    return (
        <>
            <div className="flex flex-col justify-center items-center text-center font-light text-gray-600 gap-16 w-full h-full">
                <div className="flex flex-col">
                    <CalendarCheck size={256} color="gray" />
                    <h1>Schedule your day, or bring <br /> in a pre-made template!</h1>
                </div>
                <div className="flex flex-row justify-evenly items-center gap-5">
                    <button className="bg-orange-300 text-white text-xl font-bold uppercase rounded-2xl py-3 px-5" onClick={onUseDate}>
                        Use Day
                    </button>
                    <button className="bg-white text-gray-600 text-xl font-bold uppercase rounded-2xl py-3 px-8" onClick={onSave}>
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}