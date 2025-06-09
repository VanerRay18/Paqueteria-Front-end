import { Component } from '@angular/core';
import { LicenciasService } from 'src/app/services/licencias-service/licencias.service';
import { Oficio } from 'src/app/shared/interfaces/utils';
import { ApiResponse } from 'src/app/models/ApiResponse';

@Component({
  selector: 'app-logs-admin',
  templateUrl: './logs-admin.component.html',
  styleUrls: ['./logs-admin.component.css']
})
export class LogsAdminComponent {
  searchTerm: string = '';
  headers = ['No. de Oficio','Año', 'Nombre', 'Rango de fechas', 'Total de Licencias', 'Generar PDF'];
  displayedColumns = ['oficio', 'ultima_fecha_oficio', 'nombre', 'rango_fechas','total_folios' ];
  data = [];

  constructor(
    private LicenciasService: LicenciasService
  ){

  }

  ngOnInit(): void {
    this.fetchData();
  }



  fetchData() {
    this.LicenciasService.getLicenciasOficio().subscribe((response: ApiResponse) => {
      this.data = response.data.map((item: Oficio) => ({
        ...item,
        rango_fechas: `${item.fecha_primera_licencia} al ${item.fecha_ultima_licencia}`
      })); // Aquí concatenas las fechas
    },
      (error) => {
        console.error('Error al obtener los datos:', error);
      });
  }
}
