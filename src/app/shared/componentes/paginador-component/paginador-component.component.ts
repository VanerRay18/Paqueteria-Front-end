import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginador-component',
  templateUrl: './paginador-component.component.html',
  styleUrls: ['./paginador-component.component.css']
})
export class PaginadorComponentComponent implements OnInit {
  @Input() page: number = 0;        // Lo controla el padre
  @Input() size: number = 10;       // Lo controla el padre
  @Input() total: number = 0;       // Total de registros
  @Input() isLoading: boolean = true;       // Total de registros
  @Input() message: String = "No hay registros que mostrar"; // Mensaje a mostrar cuando no hay registros
  @Output() pageChange = new EventEmitter<number>(); // Solo emite el nuevo `page`
  @Input() visible: boolean = true; 
  maxButtons = 8;

  ngOnInit(): void {
    this.adjustForScreen();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustForScreen();
  }

  adjustForScreen() {
    this.maxButtons = window.innerWidth <= 768 ? 3 : 8;
  }

get totalPages(): number[] {
  const total = Math.ceil(this.total / this.size);
  const maxButtons = this.maxButtons;

  if (total <= maxButtons) {
    // Si hay pocas páginas, mostrar todas
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxButtons / 2);
  let start = this.page + 1 - half; // +1 porque page es base 0
  let end = this.page + 1 + half;

  // Ajustar si se pasa al principio
  if (start < 1) {
    start = 1;
    end = maxButtons;
  }

  // Ajustar si se pasa al final
  if (end > total) {
    end = total;
    start = total - maxButtons + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}


cambiarPagina(p: number) {
  const totalPages = Math.ceil(this.total / this.size);
  if (p >= 0 && p < totalPages && p !== this.page) {
    this.pageChange.emit(p);
  }
}

}