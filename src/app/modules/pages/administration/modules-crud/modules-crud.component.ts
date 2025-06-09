import { Component } from '@angular/core';
import { LicenciasService } from 'src/app/services/licencias-service/licencias.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Oficio } from 'src/app/shared/interfaces/utils';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modules-crud',
  templateUrl: './modules-crud.component.html',
  styleUrls: ['./modules-crud.component.css']
})
export class ModulesCRUDComponent {
  searchTerm: string = '';
  headers = ['No.', 'Nombre del modulo', 'Descripcion', 'Path', 'Papa','Endpoints','Acciones'];
  displayedColumns = ['id', 'nombre', 'descripcion', 'path','papa','endpoints'];
  data = [];
  eliminar: boolean = false;
  agregar: boolean = false;
  modificar: boolean = false;
  table:any = true;
  srl_emp: any;

  constructor(
    private LicenciasService: LicenciasService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  buscar(srl_emp:any) {
    this.LicenciasService.getAccidentes(srl_emp).subscribe((response: ApiResponse) => {
      this.table=true
      this.data = response.data;
    },
    (error) => {
      this.table = false;
    });
  }


  fetchData() {
    this.LicenciasService.getLicenciasOficio().subscribe((response: ApiResponse) => {
      this.data = response.data.map((item: Oficio) => ({
        ...item,
        rango_fechas: `${item.fecha_primera_licencia} al ${item.fecha_ultima_licencia}`
      })); // Aquí concatenas las fechas
    },
      (error) => {
        console.error('Error al obtener los datos:', error);
      });
  }

  onEdit(data: any){
    this.router.navigate(['/pages/Admin/Users']);
  }

  onDelete(srl_emp: any){
    const userId = localStorage.getItem('userId')!; // Asegúrate de obtener el userId correcto
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      iconColor: '#dc3545',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al servicio para eliminar el registro
        this.LicenciasService.softDeleteLic(srl_emp.id, userId).subscribe(
          response => {
            this.buscar(this.srl_emp); // Refresca los datos después de eliminar
            Swal.fire(
              '¡Eliminada!',
              'La licencia ha sido eliminada correctamente.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error',
              'No se pudo eliminar la licencia.',
              'error'
            );
          }
        );
      }
    });
  }
  navigateToDashboard() {
    this.router.navigate(['/pages/Admin/Modulos']);
  }
}
