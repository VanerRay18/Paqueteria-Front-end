import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { LoggedGuard } from './core/guards/logged.guard';
import { TestComponent } from './modules/pages/extras/test/test.component';
import { CRUDEmployeeComponent } from './modules/pages/recursos-humanos/crudemployee/crudemployee.component';
import { NewEmployeeComponent } from './modules/pages/recursos-humanos/new-employee/new-employee.component';
import { RecursosHumanosModule } from './modules/pages/recursos-humanos/recursos-humanos.module';
import { PaqueteriaModule } from './modules/pages/paqueteria/paqueteria.module';


const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  { path: 'Test', component: NewEmployeeComponent},
  {path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pages',
    component: LayoutComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path:'Extras',
        loadChildren:() =>
          import('./modules/pages/extras/extras.module').then(
            (m) => m.ExtrasModule
          ),
      },
      {
        path:'Inicio',
        loadChildren:() =>
          import('./modules/pages/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path:'Admin',
        loadChildren:() =>
          import('./modules/pages/administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
      },
      {
        path:'RH',
        loadChildren:() =>
          import('./modules/pages/recursos-humanos/recursos-humanos.module').then(
            (m) => m.RecursosHumanosModule
          ),
      },
      {
        path:'Paqueteria',
        loadChildren:() =>
          import('./modules/pages/paqueteria/paqueteria.module').then(
            (m) => m.PaqueteriaModule
          ),
      }
    ],
    },
     {path:'**',redirectTo:'/login',pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
