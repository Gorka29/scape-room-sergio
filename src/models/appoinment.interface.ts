export interface Appointment {
  id?: number; // Opcional para creación
  name: string;
  email: string;
  phone: string;
  description: string;
  startDate: string; // ISO formato: '2024-12-15T10:00:00'
  endDate: string;   // ISO formato
}
