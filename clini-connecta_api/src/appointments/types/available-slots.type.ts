import { Slot } from "../interfaces/slots.interface";
import { DayOfWeek } from "../../enums/db-enum.enum";

export type AvailableSlotsResult = {
  doctorId: number;
  clinicId: number;
  date: Date;
  dayOfWeek: DayOfWeek;
  availabilityId: number;
  slots: Slot[];
};
