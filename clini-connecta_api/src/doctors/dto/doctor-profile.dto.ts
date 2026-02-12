export class DoctorProfileDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  bio!: string;
  phone!: string;
  licenseNumber!: string;
  user!: {
        id: number;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
  specialization!: {
        id: number;
        name: string;
    };
  availabilities!: Array<{
        id: number;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        validFrom: string;
        validTo: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        clinic: {
            id: number;
            name: string;
            address: string;
            postalCode: string,
            phone:string
        };
    }>;
}