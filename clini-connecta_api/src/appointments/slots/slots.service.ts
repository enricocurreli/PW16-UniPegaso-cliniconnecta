import { Injectable } from "@nestjs/common";
import { Slot } from "../interfaces/slots.interface";

@Injectable()
export class SlotsService {
  private readonly BREAK_MINUTES = 10;

  //? Mi serve per poter iniziare a lavorare con le fasce orarie recuperate dalla disponibilità del medico (es. 09:00 alle 12:00). Mi restituisce quanti minuti sono passati dalla mezzanotte.

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  //? Ricavo l'orario fornendo i minuti, utilizzo la mezzonotte come punto di riferimento

  minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  //? Ora posso passare a calcolare gli slot possibili all interno della fascia oraria

  generateSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number,
    bookedAppointments: {
      appointmentTime: string;
      durationMinutes: number;
    }[] = []
  ): Slot[] {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    const slots: Slot[] = [];
    let currentMinutes = startMinutes;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const slotStart = this.minutesToTime(currentMinutes);
      const slotEnd = this.minutesToTime(currentMinutes + durationMinutes);

      if (this.isSlotAvailable(slotStart, slotEnd, bookedAppointments)) {
        slots.push({ time: slotStart, endTime: slotEnd });
      }

      currentMinutes += durationMinutes + this.BREAK_MINUTES;
    }

    return slots;
  }

  private isSlotAvailable (
    slotStart: string,
    slotEnd: string,
    bookedAppointments: {
      appointmentTime: string;
      durationMinutes: number;
    }[]
  ): boolean {
    const slotStartMin = this.timeToMinutes(slotStart);
    const slotEndMin = this.timeToMinutes(slotEnd);

    return bookedAppointments.every((appointment) => {
      const appointmentStart = this.timeToMinutes(appointment.appointmentTime);
      const appointmentEnd = appointmentStart + appointment.durationMinutes;

      // utilizzo la regola matematica di non sovrapposizione tra intervalli b<c OR d<a
      //Lo slot è disponibile se per OGNI appuntamento esistente vale che:
      //? lo slot finisce prima che l’appuntamento inizi
      // oppure
      //? l’appuntamento finisce prima che lo slot inizi”
      return slotEndMin <= appointmentStart || appointmentEnd <= slotStartMin;
    });
  }
    canBookSlot(
    slotStart: string,
    durationMinutes: number,
    bookedAppointments: {
      appointmentTime: string;
      durationMinutes: number;
    }[]
  ): boolean {
    const slotEnd = this.minutesToTime(
      this.timeToMinutes(slotStart) + durationMinutes
    );

    return this.isSlotAvailable(
      slotStart,
      slotEnd,
      bookedAppointments
    );
  }

}
