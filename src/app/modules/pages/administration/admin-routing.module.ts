import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { ModulesComponent } from './modules/modules.component';
import { EndpointComponent } from './endpoint/endpoint.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { UserCRUDComponent } from './user-crud/user-crud.component';
import { RolesCRUDComponent } from './roles-crud/roles-crud.component';
import { ModulesCRUDComponent } from './modules-crud/modules-crud.component';
import { EndopointCRUDComponent } from './endopoint-crud/endopoint-crud.component';
import { LogsAdminComponent } from './logs-admin/logs-admin.component';

const routes: Routes = [
  {path: 'Users',component:UsersComponent},
  {path: 'Roles',component:RolesComponent},
  {path: 'Modulos',component:ModulesComponent},
  {path: 'EndPoint',component:EndpointComponent},
  {path: 'Home-Admin',component:HomeAdminComponent},
  {path: 'User-Table',component:UserCRUDComponent},
  {path: 'Roles-Table',component:RolesCRUDComponent},
  {path: 'Modules-Table',component:ModulesCRUDComponent},
  {path: 'EndPoint-Table',component:EndopointCRUDComponent},
  {path: 'LogsAdmin',component:LogsAdminComponent}
  ];




@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)], // Configura las rutas a nivel de raíz
  exports: [RouterModule]
})
export class AdminRoutingModule { }
