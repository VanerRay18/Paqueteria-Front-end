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
  ) { }


  ngOnInit(): void {



  }

  // 🔑 Cuando se monta el componente → foco en el primer input
  ngAfterViewInit(): void {
    this.setFocusFirst();
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
      returnFocus: false
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
      const firstInput = this.inputs.first;
      if (firstInput) {
        firstInput.nativeElement.focus();
      }
    });
  }

  setFocusFirst() {
    setTimeout(() => {
      const firstInput = this.inputs.first;
      if (firstInput) {
        firstInput.nativeElement.focus();
      }
    }, 0); // 0ms es suficiente para esperar render
  }

  onBackspace(event: any, index: number) {
    const input = event.target;
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling;
      if (prev) prev.focus();
    }
  }
}
