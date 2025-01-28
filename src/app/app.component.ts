import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollService } from './scroll.service';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReservasComponent } from './reservas/reservas.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HeaderComponent, InicioComponent, ReservasComponent, UbicacionComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  @Output() sectionSelected = new EventEmitter<string>();
  private readonly ANIMATION_DELAY = 100;
  isDashboardRoute = false;

  constructor(private router: Router, private scrollService: ScrollService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) {
        this.scrollService.scrollToElement(tree.fragment);
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculamos el offset basado en la altura del header
      const header = document.querySelector('header');
      const offset = header ? header.getBoundingClientRect().height : 0;

      // Calculamos la posición final de una vez
      const elementPosition = element.getBoundingClientRect().top;
      const extraOffset = element.id === 'citas' ? 0 : -67;
      const offsetPosition = elementPosition + window.pageYOffset - offset + extraOffset;

      // Realizamos el scroll suave en una sola operación
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToCitas(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculamos el offset basado en la altura del header
      const header = document.querySelector('header');
      const offset = header ? header.getBoundingClientRect().height : 0;

      // Calculamos la posición final de una vez
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset; // Añadimos 305px extra

      // Realizamos el scroll suave en una sola operación
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

}
