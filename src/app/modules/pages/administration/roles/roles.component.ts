import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{
  allModules: string[] = ['Ingreso-licencias', 'Archivo-licenicas', 'Oficio-licenias', 'Logs-licenicas'];
  assignedModules: string[] = ['Home'];
  draggedModulo: string | null = null;
  roleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      edit: [false], // Asegúrate de que esté aquí
      delete: [false], // Y aquí
      add: [false], // Y aquí
    });
  }

  ngOnInit(): void {
    // Inicializa tu lógica si es necesario
  }

  onSubmit() {
    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
    }
  }



  onDragStartM(event: DragEvent, modulo: string) {
    this.draggedModulo = modulo;
    event.dataTransfer?.setData('text/plain', modulo);
  }

  onDragOverM(event: DragEvent) {
    event.preventDefault();
  }


  onDropM(event: DragEvent, target: 'assigned' | 'all') {
    event.preventDefault();
    const modulo = this.draggedModulo;

    if (modulo) {
      if (target === 'assigned') {
        if (!this.assignedModules.includes(modulo)) {
          this.assignedModules.push(modulo);
          this.allModules = this.allModules.filter(m => m !== modulo);
        }
      } else {
        this.assignedModules = this.assignedModules.filter(m => m !== modulo);
        this.allModules.push(modulo);
      }
      this.draggedModulo = null;
    }
  }
}
