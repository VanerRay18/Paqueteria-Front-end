import { RHService } from 'src/app/services/rh.service';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-check-assistance',
  templateUrl: './check-assistance.component.html',
  styleUrls: ['./check-assistance.component.css']
})
export class CheckAssistanceComponent {

  constructor(
    private fb: FormBuilder,
    private rh: RHService
  ) {

  }

  token: string[] = ['', '', '', '', '', ''];
  tokenArray = new Array(6);

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
    const tokenCompleto = this.token.join('').toUpperCase(); // opcional: toUpperCase()

    this.rh.validateToken(tokenCompleto).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: response.message || 'Asistencia/Falta registrada correctamente.', // muestra "Registro tardío, favor de presentar su justificante"
            confirmButtonText: 'Aceptar'
          });
          this.token.fill(''); // Limpiar el token después del envío
          this.tokenArray.fill(''); // Limpiar el tokenArray después del envío
          this.token = ['', '', '', '', '', '']; // Limpiar el token
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: response.message || 'Algo salió mal.',
            confirmButtonText: 'Aceptar'
          });
          this.token.fill(''); // Limpiar el token después del envío
          this.tokenArray.fill(''); // Limpiar el tokenArray después del envío
          this.token = ['', '', '', '', '', '']; // Limpiar el token
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error',
          text: err.error?.message || 'No se pudo registrar la asistencia',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }


  onBackspace(event: any, index: number) {
    const input = event.target;
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling;
      if (prev) prev.focus();
    }
  }
}
