import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appoinment.interface';
// import { AppointmentService } from '../../services/appointment.service';
// import { AppointmentListComponent } from "../appointment-list/appointment-list.component";
// import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  currentMonth: Date = new Date();
  weeks: any[] = [];
  // appointments: Appointment[] = [];

  private mesesEnEspanol = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor() { }

  ngOnInit() {
    // this.appointmentService.appointments$.subscribe(appointments => {
    //   this.appointments = appointments.map(appointment => ({
    //     ...appointment,
    //     fecha: new Date(appointment.startDate)
    //   }));
     this.generateCalendarDays(this.currentMonth.getMonth(), this.currentMonth.getFullYear());
    // });
  }

  private animateCalendarDays(direction: 'in' | 'out' = 'in', yOffset: number = 30) {
    return gsap.fromTo('.calendar-cell-day',
      {
        y: direction === 'in' ? yOffset : 0,
        opacity: direction === 'in' ? 0 : 1,
        scale: direction === 'in' ? 0.8 : 1
      },
      {
        y: direction === 'in' ? 0 : yOffset,
        opacity: direction === 'in' ? 1 : 0,
        scale: direction === 'in' ? 1 : 0.8,
        duration: 0.4,
        stagger: {
          amount: 0.3,
          grid: [6, 7],
          from: direction === 'in' ? "start" : "end"
        },
        ease: "power2.out"
      }
    );
  }

  generateCalendarDays(month: number, year: number) {
    const weeks = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let currentWeek = [];
    let currentDate = new Date(firstDayOfMonth);

    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 1) {
      if (currentDate.getDay() === 1 && currentWeek.length) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const day = {
        date: new Date(currentDate),
        isToday: this.isSameDate(currentDate, new Date()),
        isCurrentMonth: currentDate.getMonth() === month,
        events: this.getEventsForDay(currentDate),
      };

      currentWeek.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length) {
      weeks.push(currentWeek);
    }

    this.weeks = weeks;
  }

  getEventsForDay(date: Date): Appointment[] {
    // return this.appointments
    //   .filter(appointment => this.isSameDate(new Date(appointment.startDate), date));
    return [];
  }

  getMonday(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  getSunday(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() + (7 - day);
    return new Date(date.setDate(diff));
  }

  isSameDate(date1: Date, date2: Date): boolean {
    if (!(date1 instanceof Date && date2 instanceof Date)) {
      console.error('isSameDate called with non-Date arguments', date1, date2);
      return false;
    }
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  previousMonth() {
    // Primero animamos la salida
    this.animateCalendarDays('out', 20).then(() => {
      // Añadimos un retraso antes de actualizar los datos
      return new Promise(resolve => setTimeout(resolve, 0));
    }).then(() => {
      // Actualizamos los datos
      this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
      this.generateCalendarDays(this.currentMonth.getMonth(), this.currentMonth.getFullYear());

      // Esperamos un frame para que el DOM se actualice
      requestAnimationFrame(() => {
        // Animamos la entrada
        this.animateCalendarDays('in', 20);
      });
    });
  }

  nextMonth() {
    // Primero animamos la salida
    this.animateCalendarDays('out', -20).then(() => {
      // Añadimos un retraso antes de actualizar los datos
      return new Promise(resolve => setTimeout(resolve, 0));
    }).then(() => {
      // Actualizamos los datos
      this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
      this.generateCalendarDays(this.currentMonth.getMonth(), this.currentMonth.getFullYear());

      // Esperamos un frame para que el DOM se actualice
      requestAnimationFrame(() => {
        // Animamos la entrada
        this.animateCalendarDays('in', -20);
      });
    });
  }

  showEventDetails(events: Appointment[]) {
    const eventDetails = `
      <div class="space-y-6 md:px-4">
        ${events.map((event, index) => `
          <div class="flex items-center gap-4 ${index !== events.length - 1 ? 'border-b border-gray-200 pb-6' : ''}">
            <div class="flex-1">
              <div class="flex flex-col">
                <div class="mt-3 space-y-2">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 bg-[#cdbfb0] rounded-full flex items-center justify-center">
                      <span class="text-white text-xl font-semibold">${event.name.charAt(0)}</span>
                    </div>
                    <div class="flex flex-col items-start">
                      <h3 class="text-lg font-semibold text-gray-800 mb-1 ml-2">${event.name}</h3>
                      <p class="text-gray-100 text-sm bg-[#cdbfb0] rounded-xl px-3 py-1">${new Date(event.startDate).toLocaleString('es-ES', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  <div class="flex items-start text-sm pt-2">
                    <i class="fas fa-comment text-[#cdbfb0] min-w-[1.25rem] mt-1"></i>
                    <span class="text-gray-700 ml-2 text-left">${event.description}</span>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center text-sm">
                      <i class="fas fa-phone text-[#cdbfb0] min-w-[1.25rem]"></i>
                      <span class="text-gray-700 ml-2">${event.phone}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <i class="far fa-envelope text-[#cdbfb0] min-w-[1.25rem]"></i>
                      <span class="text-gray-700 ml-2">${event.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    /* Swal.fire({
      title: `<div class="flex items-center justify-center">
        <i class="far fa-calendar text-[cdbfb0] mr-2"></i>
        <span class="text-gray-800">Detalles del día</span>
      </div>`,
      html: eventDetails,
      showCloseButton: true,
      showConfirmButton: false,
      background: '#ffffff',
      color: '#1a1a1a',
      customClass: {
        container: 'event-modal',
        popup: 'rounded-lg shadow-lg',
        closeButton: 'focus:outline-none text-gray-600 hover:text-gray-800',
        title: 'text-xl font-bold text-gray-800'
      },
      width: '500px'
    });*/
  }

  getNombreMes(fecha: Date): string {
    return this.mesesEnEspanol[fecha.getMonth()];
  }

  isDateInPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
}
