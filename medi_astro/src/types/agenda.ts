/** Domain models for the Agenda module. */

export interface Specialty {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  specialtyId: number;
}

export interface Office {
  id: number;
  name: string;
}

export interface ShiftPayload {
  specialtyId: number | string;
  doctorId: number | string;
  officeId: number | string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface ShiftResponse {
  id: number;
  message: string;
}

export interface AvailableSlot {
  officeId: number;
  officeName: string;
  timeRange: string;
  status: 'available' | 'assigned';
}
