import { Component } from '@angular/core';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CalendarViewComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent {

}
