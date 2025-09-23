import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NominaBecService } from 'src/app/services/nomina-bec.service';
@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css'],
    standalone: false
})
export class TablesComponent implements OnChanges{

// Input para las cabeceras de la tabla
@Input() headers: string []= [];
// Input para los datos a mostrar
@Input() data: any[] = [];
 // Input para las columnas que se deben mostrar
@Input() displayedColums: string []=[];


// Input para mostrar u ocultar la columna de acciones
@Input() showActions: boolean = false;

@Input() itemsPerPage: number = 20; // Cantidad de elementos por página
@Input() showActionsEdit: boolean = false;
@Input() showActionsDeleted: boolean = false;
@Input() showActionsPdf: boolean = false;
@Input() bola: boolean = false;
@Input() maxHeight: string = '300px';
@Input() showDetailsColumn: boolean = false;
@Input() showActiveCheckbox: boolean = false;
@Input() showVerifiedCheckbox: boolean = false;
@Input() isLoading: boolean = false;

// Outputs para emitir eventos de editar o eliminar
@Output() check: EventEmitter<any> = new EventEmitter();
@Output() edit: EventEmitter<any> = new EventEmitter();
@Output() show: EventEmitter<any> = new EventEmitter();
@Output() delete: EventEmitter<any> = new EventEmitter();
@Output() Pdf: EventEmitter<any> = new EventEmitter();
@Output() Bola: EventEmitter<any> = new EventEmitter();


@Output() clavesBanco: EventEmitter<any> = new EventEmitter();

@Input() searchTerm: string = '';  // Término de búsqueda, opcional

rowsWithHighlight: Set<number> = new Set();


 // Propiedades para ordenamiento
 sortedColumn: string = '';
 sortDirection: 'asc' | 'desc' = 'asc';
 expandedRow: number | null = null;  // Para el dropdown
// Propiedades locales
paginatedData: any[] = [];
clabes: any[] = [];
nominaId: any ;
currentPage: number = 1;
totalPages: number = 1;
 constructor(

    private NominaBecService: NominaBecService
  ) {
    // Registrar las fuentes necesarias
  }






ngOnChanges(changes: SimpleChanges): void {
  if (changes['data'] && this.data) {
    // console.log('Datos recibidos en tabla:', this.data);
    this.updatePagination();
  }
}


private updatePagination(): void {
  if (!Array.isArray(this.data)) {
    this.paginatedData = [];
    this.totalPages = 0;
    return;
  }
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedData = this.data.slice(start, end);
  this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
}


onPageChange(page: number): void {
  this.currentPage = page;
  this.updatePagination();
}

showDetails(row: any){
  this.show.emit(row); // Emitir el evento al componente padre
}

onEdit(row: any) {

  this.edit.emit(row); // Emitir el evento al componente padre
}

onDelete(row: any) {
  this.delete.emit(row); // Emitir el evento al componente padre
}

onPDF(row: any) {
  this.Pdf.emit(row); // Emitir el evento al componente padre
}

sortData(column: string): void {
  if (this.sortedColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortedColumn = column;
    this.sortDirection = 'asc';
  }

  // Ordenar los datos
  this.data.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    if (valueA < valueB) {
      return this.sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return this.sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Después de ordenar los datos, actualizamos la paginación
  this.updatePagination();
}

info(event:Event,row: any){
  const checkbox = event.target as HTMLInputElement;
  const isChecked = checkbox.checked; // `true` si está marcado, `false` si no
   const bc = {
    srl_emp: row.srl_emp,
    clabe: isChecked,
    idNomina:this.nominaId
  };

  // Busca si ya existe un objeto con el mismo `srl_emp`
  const index = this.clabes.findIndex(item => item.srl_emp === bc.srl_emp);

  if (index !== -1) {
     this.clabes[index].clabe = bc.clabe;

    console.log(this.clabes)
    console.log(`El srl_emp ${bc.srl_emp} ya existe. Valor actualizado.`);
  } else {
    // Si no existe, agrega el nuevo objeto
    this.clabes.push(bc);
    console.log('Nuevo objeto agregado a clabes:', bc);
  }

  this.clavesBanco.emit(this.clabes);
}

// Método para alternar el checkbox
toggleCheckbox(row: any): void {

  this.check.emit(row);

}


}
