import type { DayOfWeek } from "./availability"

export interface Slot {
    doctorId: number,
    clinicId: number,
    date: string,
    dayOfWeek: DayOfWeek,
    availabilityId: number,
    slots: [
        {
            time: string,
            endTime:string
        },
    ]    
}