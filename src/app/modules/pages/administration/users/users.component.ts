import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { AdminService } from 'src/app/services/admin.service';
import { BusquedaserlService } from 'src/app/services/busquedaserl.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  allRoles: { id: number, name: string }[] = [];
  assignedRoles: { id: number, name: string }[] = [];
  allModules: { id: number, name: string, config: string }[] = [];
  assignedModules: { id: number, name: string, config: string }[] = [];
  // Drag variables
  draggedRole: { id: number, name: string } | null = null;
  draggedModulo: { id: number, name: string, config: string } | null = null;
  showCards: boolean = false;
  UserForm!: FormGroup;
  roles: number[] = [];
  extras: number[] = [];
  pricipal: any;
  srl_emp: any;
  rfc:any;
  nombre: any;

  constructor(
    private fb: FormBuilder,
    private AdminService: AdminService,
    private BusquedaserlService: BusquedaserlService,
  ) {
    this.loadRoles();
    this.loadModules();
  }

  ngOnInit(): void {
    this.dataUser();
    this.buscar();
  }

  buscar(){
    this.BusquedaserlService.srlEmp$.subscribe(value => {
      this.UserForm.patchValue({
        name: value.nombre,
        rfc: value.rfc,
        srl_emp: value.srl_emp
      });
    });
  }

  createUser() {
    if (this.UserForm.valid) {
      const data = {
        nombre: this.UserForm.value.name,
        password: this.UserForm.value.pass,
        user: this.UserForm.value.user,
        srl_emp: this.UserForm.value.srl_emp,
        area: this.UserForm.value.area,
        cargo: this.UserForm.value.position,
        funciones: this.UserForm.value.fuction,
        roles: this.roles,
        config: {
          config: {
            principal: this.pricipal,
            extras: this.extras
          }
        }
      };
      console.log(data)

      this.AdminService.createUser(data).subscribe({
        next: response => {
          this.dataUser(); // Llamada a la función para reiniciar el formulario
          Swal.fire({
            title: '¡Éxito!',
            text: 'El usuario se ha creado correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        },
        error: error => {
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }



  dataUser() {
    this.UserForm = this.fb.group({
      On: [true], // Checkbox de habilitado/deshabilitado
      name: ['', [Validators.required, Validators.minLength(3)]], // Requerido, mínimo 3 caracteres
      rfc: ['', [Validators.required, Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/)]], // Requerido, patrón RFC
      srl_emp: ['', [Validators.required, Validators.minLength(4)]], // Requerido, mínimo 4 caracteres
      position: ['', Validators.required], // Requerido
      area: ['', Validators.required], // Requerido
      fuction: ['', [Validators.required, Validators.minLength(10)]], // Requerido, mínimo 10 caracteres
      user: ['', [Validators.required, Validators.minLength(8)]], // Requerido, mínimo 8 caracteres
      pass: ['', [Validators.required, Validators.minLength(6)]]  // Requerido, mínimo 6 caracteres
    });
  }

  loadRoles() {
    this.AdminService.getRolAssignation().subscribe((response: any) => {
      this.allRoles = response.data;
    });
  }

  loadModules() {
    this.AdminService.getModulesAssignation().subscribe((response: any) => {
      this.allModules = response.data;
    });
  }

  toggleCards(activate: boolean) {
    this.showCards = activate;
  }

  onDragStart(event: DragEvent, role: { id: number, name: string }) {
    this.draggedRole = role;
    event.dataTransfer?.setData('text/plain', role.name);
  }

  onDrop(event: DragEvent, target: 'assigned' | 'all') {
    event.preventDefault();
    const role = this.draggedRole;

    if (role) {
      if (target === 'assigned') {
        if (!this.assignedRoles.some(r => r.id === role.id)) {
          this.assignedRoles.push(role);
          this.roles.push(role.id); // Agrega el ID al arreglo roles
          this.allRoles = this.allRoles.filter(r => r.id !== role.id);
        }
      } else {
        this.assignedRoles = this.assignedRoles.filter(r => r.id !== role.id);
        this.roles = this.roles.filter(id => id !== role.id); // Remueve el ID del arreglo roles
        this.allRoles.push(role);
      }
      this.draggedRole = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Drag functions for modules
  onDragStartM(event: DragEvent, modulo: { id: number, name: string, config: string }) {
    this.draggedModulo = modulo;
    event.dataTransfer?.setData('text/plain', modulo.name);
    console.log(modulo)
  }

  onDropM(event: DragEvent, target: 'assigned' | 'all') {
    event.preventDefault();
    const modulo = this.draggedModulo;

    if (modulo) {
      if (target === 'assigned') {
        if (!this.assignedModules.some(m => m.id === modulo.id)) {
          this.assignedModules.push(modulo);
          this.extras.push(modulo.id); // Agrega el ID al arreglo extras
          this.allModules = this.allModules.filter(m => m.id !== modulo.id);
        }
      } else {
        this.assignedModules = this.assignedModules.filter(m => m.id !== modulo.id);
        this.extras = this.extras.filter(id => id !== modulo.id); // Remueve el ID del arreglo extras
        this.allModules.push(modulo);
      }
      this.draggedModulo = null;
    }
  }

  onDragOverM(event: DragEvent) {
    event.preventDefault();
  }
}
