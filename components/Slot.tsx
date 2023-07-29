'use client'

import { Status } from "../types/scheduler";

// one of the only exceptions to putting all types in the types folder.
// react props are usually kept above the function declaration.
export interface SlotProps {
    title?: string;
    status: Status;
    header?: boolean;
    footer?: boolean;
}

// typically its one component per file so the component is marked as the default export.
// assigning values to nullable fields so they always have a value.
export default function Slot({ title = "", status, header = false, footer = false }: SlotProps): JSX.Element | null {
    if (status === Status.Empty) return null;
    // get the background color, allow tailwind to import the color.
    const [titleColor, bodyColor] = getColorStyle(status);
    const rounding = header ? "rounded-t-2xl" : footer ? "rounded-b-2xl" : "";
    const height = !footer ? "h-24" : "h-20";
    // by targeting the specific things that change in the component it makes it easier to shrink the complexity of the code
    // and improve readability (also helps remove bugs related to needing to copy paste and update 4 places)
    return (
        // TODO: test if the changing between h-20 and h-24 is needed I think its just a typo and all should be one or the other.
        <div className={`w-5/6 ${height} self-start ${rounding} ${!header ? bodyColor : ""}`}>
            {header &&
                <>
                    <div className={`flex flex-row justify-start w-full h-1/5 ${titleColor} ${rounding}`} >
                        <h1 className="text-white font-bold px-5">{title}</h1>
                    </div>
                    <div className={`w-full h-4/5 ${bodyColor} ${footer ? "rounded-b-2xl" : ""}`}></div>
                </>
            }
        </div>
    );
}

/**
 * get the tailwind css color for a given status.
 *
 * NOTE: doing this to ensure tailwind knows at build time css classes.
 *
 * @param status status to get color for
 * @returns tailwind css for background color
 */
function getColorStyle(status: Status): [title: string, body: string] {
    switch (status) {
        case Status.Red: return ["bg-red-800", "bg-red-200"];
        case Status.Orange: return ["bg-orange-800", "bg-orange-200"];
        case Status.Yellow: return ["bg-yellow-800", "bg-yellow-200"];
        case Status.Blue: return ["bg-blue-800", "bg-blue-200"];
        case Status.Green: return ["bg-green-800", "bg-green-200"];
        case Status.Empty:
        default: return ["", ""];
    }
}