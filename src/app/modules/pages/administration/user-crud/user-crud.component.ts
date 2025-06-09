import { ImageToBaseService } from './../../../../services/image-to-base.service';
import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Oficio } from 'src/app/shared/interfaces/utils';
import { LicenciasService } from 'src/app/services/licencias-service/licencias.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from 'src/app/shared/interfaces/usuario.model';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.css']
})
export class UserCRUDComponent {
  searchTerm: string = '';
  headers = ['Srl_emp', 'Nombre Completo', 'RFC', 'Cargo','Area','Funciones','Rol/Roles','Modulos extra','Acciones'];
  displayedColumns = ['srlEmp', 'nombre', 'rfc','cargo','area','funciones','rolesNombres','extrasName'];
  data = [];
  eliminar: boolean = false;
  agregar: boolean = false;
  modificar: boolean = false;
  table:any = true;
  srl_emp: any;

  constructor(
    private AdminService: AdminService,
    private LicenciasService: LicenciasService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }


  fetchData() {
    this.AdminService.getAllUser().subscribe((response: ApiResponse) => {
      this.data = response.data.map((item: User) => ({
        ...item,
        rolesNombres: item.rolesNombres && Array.isArray(item.rolesNombres) ? item.rolesNombres.join(', ') : '',
        extrasName: item.extrasName && Array.isArray(item.extrasName) ? item.extrasName.join(', ') : ''
      }));
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
            // this.buscar(this.srl_emp); // Refresca los datos después de eliminar
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
    this.router.navigate(['/pages/Admin/Users']);
  }


}
