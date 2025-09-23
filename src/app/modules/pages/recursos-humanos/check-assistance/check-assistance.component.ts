import { RHService } from 'src/app/services/rh.service';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-check-assistance',
    templateUrl: './check-assistance.component.html',
    styleUrls: ['./check-assistance.component.css'],
    standalone: false
})
export class CheckAssistanceComponent {
  token: string[] = ['', '', '', '', '', ''];
  tokenArray = new Array(6);

  // 🔑 Aquí referenciamos TODOS los inputs con ViewChildren
  @ViewChildren('tokenInput') inputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private rh: RHService
  ) { }

  ngOnInit(): void {
    this.tokenArray[1];
  }

  ngAfterViewInit(): void {
    // Aumentar el delay para que otros elementos terminen de renderizarse
    setTimeout(() => {
      this.setFocusFirst();
    }, 1000); // En lugar de 0ms, usar 100ms
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

 private handleResponse(success: boolean, message: string) {
  Swal.fire({
    icon: success ? 'success' : 'error',
    title: success ? 'Registro exitoso' : 'Ocurrió un error',
    text: message,
    confirmButtonText: 'Aceptar',
    returnFocus: false,
    timer: 7000,             // ⏱️ Dura 7 segundos
    timerProgressBar: true    // 👀 Muestra barra de progreso
  }).then(() => {
    this.resetToken();
  });
}

  enviarToken() {
    const tokenCompleto = this.token.join('').toUpperCase();

    this.rh.validateToken(tokenCompleto).subscribe({
      next: (response) => {
        this.handleResponse(
          response.success,
          response.message || (response.success ? 'Asistencia registrada correctamente.' : 'Algo salió mal.')
        );
      },
      error: (err) => {
        this.handleResponse(false, err.error?.message || 'No se pudo registrar la asistencia');
      }
    });
  }

  resetToken() {
    this.token = ['', '', '', '', '', ''];
    this.tokenArray = new Array(6);

    // 🚀 Esperar a que Angular actualice la vista
    setTimeout(() => {
      this.setFocusFirst();
    }, 0);
  }

  setFocusFirst() {
    // ✅ Validación defensiva antes de acceder a .first
    if (this.inputs && this.inputs.first) {
      this.inputs.first.nativeElement.focus();
    }
  }

  onBackspace(event: any, index: number) {
    const input = event.target;
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling;
      if (prev) prev.focus();
    }
  }
}