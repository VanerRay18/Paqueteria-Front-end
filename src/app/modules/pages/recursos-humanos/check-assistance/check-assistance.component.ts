import { RHService } from 'src/app/services/rh.service';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-check-assistance',
  templateUrl: './check-assistance.component.html',
  styleUrls: ['./check-assistance.component.css']
})
export class CheckAssistanceComponent {
token: string[] = ['', '', '', '', '', ''];
  tokenArray = new Array(6);

  // 🔑 Aquí referenciamos TODOS los inputs con ViewChildren
  @ViewChildren('tokenInput') inputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private rh: RHService
  ) {}

  // 🔑 Cuando se monta el componente → foco en el primer input
  ngAfterViewInit(): void {
    this.setFocusFirst();
  }

  setFocusFirst() {
    const firstInput = this.inputs.first;
    if (firstInput) {
      firstInput.nativeElement.focus();
    }
  }

  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const next = input.nextElementSibling;
      if (next) next.focus();
    }

    // Verificar si todos los campos ya están llenos
    const tokenCompleto = this.token.join('');
    if (tokenCompleto.length === 6 && !this.token.includes('')) {
      this.enviarToken(); // Enviar automáticamente
    }
  }

  enviarToken() {
    const tokenCompleto = this.token.join('').toUpperCase();

    this.rh.validateToken(tokenCompleto).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: response.message || 'Asistencia/Retardo registrada correctamente.',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: response.message || 'Algo salió mal.',
            confirmButtonText: 'Aceptar'
          });
        }

        // 🚀 Limpiar e inmediatamente regresar foco al primer input
        this.resetToken();
        this.setFocusFirst();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error',
          text: err.error?.message || 'No se pudo registrar la asistencia',
          confirmButtonText: 'Aceptar'
        });

        this.resetToken();
        this.setFocusFirst();
      }
    });
  }

  resetToken() {
    this.token = ['', '', '', '', '', ''];
    this.tokenArray = new Array(6);
  }

  onBackspace(event: any, index: number) {
    const input = event.target;
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling;
      if (prev) prev.focus();
    }
  }
}
