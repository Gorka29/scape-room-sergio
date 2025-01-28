import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() sectionSelected = new EventEmitter<string>();
  activeSection: string = 'inicio';

  menuAbierto = false;

  constructor() {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  onSectionClick(sectionId: string) {
    this.sectionSelected.emit(sectionId);
    this.activeSection = sectionId;
    this.cerrarMenu();
  }
}
