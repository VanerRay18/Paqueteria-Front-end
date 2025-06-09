import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { ModulesComponent } from './modules/modules.component';
import { EndpointComponent } from './endpoint/endpoint.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from "../../../shared/shared.module";
import { UserCRUDComponent } from './user-crud/user-crud.component';
import { RolesCRUDComponent } from './roles-crud/roles-crud.component';
import { ModulesCRUDComponent } from './modules-crud/modules-crud.component';
import { EndopointCRUDComponent } from './endopoint-crud/endopoint-crud.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LogsAdminComponent } from './logs-admin/logs-admin.component';



@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    ModulesComponent,
    EndpointComponent,
    HomeAdminComponent,
    UserCRUDComponent,
    RolesCRUDComponent,
    ModulesCRUDComponent,
    EndopointCRUDComponent,
    LogsAdminComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule
]
})
export class AdministrationModule { }
