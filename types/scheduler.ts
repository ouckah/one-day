export interface Appointment {
    title: string,
    start: string,
    end: string,
    location: string,
    description: string,
}
export interface SlotState {
    status: Status,
    appointmentKey?: string;
}

export enum Status {
    Empty = "empty",
    Red = "red",
    Orange = "orange",
    Yellow = "yellow",
    Blue = "blue",
    Green = "green",
}