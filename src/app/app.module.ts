
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { NavComponent } from './shared/header/nav/nav.component';
import { HomeRoutingModule } from './modules/pages/home/home-routing.module';
import { PerfilComponent } from './modules/pages/extras/perfil/perfil.component';
import { ExtrasRoutingModule } from './modules/pages/extras/extras-routing.module';
import { LayoutModule } from './modules/layout/layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './modules/pages/administration/admin-routing.module';
import { AdministrationModule } from './modules/pages/administration/administration.module';
import { RecursosHumanosModule } from './modules/pages/recursos-humanos/recursos-humanos.module';
import { PaqueteriaModule } from './modules/pages/paqueteria/paqueteria.module';
import { RHRoutingModule } from './modules/pages/recursos-humanos/rh-routing.module';
import { PaqueteriaRoutingModule } from './modules/pages/paqueteria/paqueteria-routing.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HomeModule } from './modules/pages/home/home.module';
import { NgChartsModule } from 'ng2-charts';
import { GraphsRoutingModule } from './modules/pages/graphs/graphs-routing.module';
import { GraphsModule } from './modules/pages/graphs/graphs.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AdministrationModule,
    AuthModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    HomeRoutingModule,
    HomeModule,
    ExtrasRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    RecursosHumanosModule,
    PaqueteriaModule,
    RHRoutingModule,
    PaqueteriaRoutingModule,
    NgxDaterangepickerMd.forRoot(),
    NgChartsModule,
    GraphsRoutingModule,
    GraphsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
