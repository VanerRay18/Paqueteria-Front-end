import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Module } from 'src/app/shared/interfaces/utils';
import { PermisosUserService } from 'src/app/services/permisos-user.service';
import { BusquedaserlService } from 'src/app/services/busquedaserl.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  username: string = '';
  password: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private PermisosUserService: PermisosUserService,
    private busqueda: BusquedaserlService
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required , Validators.minLength(4) ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
  this.checkTokenExpiration();
  localStorage.clear();
  }

  onSubmit() {
    this.isLoading = true; // Activar el loader
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    loginButton.disabled = true; // Deshabilitar el botón mientras se procesa

    if (this.loginForm.invalid) {
        this.isLoading = false; // Desactivar el loader si el formulario es inválido
        loginButton.disabled = false; // Habilitar el botón nuevamente
        return; // Salir si el formulario es inválido
    }

    const data = {
        user: this.loginForm.value.user,
        password: this.loginForm.value.password
    };

    this.authService.authLogg(data).subscribe(
        (response) => {
            const token = response.headers.get('Authorization');
            // const tokenExpiration = new Date().getTime() + (2 * 60 * 60 * 1000) + (58 * 60 * 1000); // 2 horas y 58 minutos
            const tokenExpiration = new Date().getTime() + (5000);
            const rolId = response.body.data.roles;
            const userId = response.body.data.userId;
            const path = response.body.data.config.principal;
            const extras = response.body.data.config.extras
            this.PermisosUserService.save(response.body.data.permisos);
            // Guardar el token y otros datos en localStorage
            if (token) {
                localStorage.setItem('userId', userId);
                 localStorage.setItem('extras', extras != null? extras : '');
                // localStorage.setItem('eliminar', eliminar);
                // localStorage.setItem('agregar', agregar);
                localStorage.setItem('rolId', rolId);
                localStorage.setItem('token', token);
                localStorage.setItem('tokenExpiration', tokenExpiration.toString());

                this.router.navigate([path]); // Navegar al nuevo path
            }

            this.isLoading = false; // Desactivar el loader
            loginButton.disabled = false; // Habilitar el botón nuevamente
        },
        (error) => {
            Swal.fire({
              title: error.error.message != null?'Error':'Error con el sistema...',
                text: error.error.message != null? error.error.message:'Favor de acudir al area de mantenimiento',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            this.isLoading = false; // Desactivar el loader
            loginButton.disabled = false; // Habilitar el botón nuevamente
        }
    );
}


// Verifica la expiración del token
checkTokenExpiration() {
  console.log('hola')
  const tokenExpiration = localStorage.getItem('token');
  if (tokenExpiration) {
    const now = new Date().getTime();

    if (now > parseInt(tokenExpiration)) {
      this.logout(); // El token ha expirado, realizar logout
      return false;
    } else {
    }
  }
  return true;
}

// Limpia el localStorage y redirige al login
logout() {
  console.log('hola')
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('rolId');
  this.busqueda.clearSrlEmp();
  this.router.navigate(['login']); // Redirige al login

}

}

