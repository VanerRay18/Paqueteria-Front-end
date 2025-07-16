import { Component } from '@angular/core';
import { PakageService } from 'src/app/services/pakage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pakage-token',
  templateUrl: './pakage-token.component.html',
  styleUrls: ['./pakage-token.component.css']
})
export class PakageTokenComponent {
  token: string | null = null;
  countdown: number = 0;
  buttonDisabled: boolean = false;
  attempts = 0;
  maxAttempts = 5;
  maxAttemptsReached = false;
  countdownInterval: any;
  tokenExpired: boolean = false;


  constructor(private pakageService: PakageService) {}
  generarToken(): void {
    if (this.attempts >= this.maxAttempts) {
      this.maxAttemptsReached = true;
      this.buttonDisabled = true;
      return;
    }

    this.attempts++; // Solo se incrementa si aún no ha llegado al límite
    this.buttonDisabled = true;
    this.countdown = 15;
    this.tokenExpired = false;

    this.pakageService.getTokenAtt().subscribe({
      next: (response: any) => {
        this.token = response.message;
        this.iniciarCuentaRegresiva();
      },
      error: (err) => {
        console.error('Error al generar token', err);
              Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: err.error.message,
        confirmButtonText: 'Aceptar'
      });

        this.buttonDisabled = false;
      }
    });

    // Aquí validamos si este intento fue el último permitido
    if (this.attempts >= this.maxAttempts) {
      this.maxAttemptsReached = true;
    }
  }


  iniciarCuentaRegresiva() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);

        this.token = null;              // 👉 Elimina token
        this.tokenExpired = true;       // 👉 Muestra mensaje

        if (this.attempts < this.maxAttempts) {
          this.buttonDisabled = false;
        }
      }
    }, 1000);
  }

}
