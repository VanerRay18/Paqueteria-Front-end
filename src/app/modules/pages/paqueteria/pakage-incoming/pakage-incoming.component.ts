import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { RHService } from 'src/app/services/rh.service';
import { Cargamento, Persona } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PakageService } from 'src/app/services/pakage.service';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { take } from 'rxjs';
import dayjs from 'dayjs';   // ✅ correcto
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


@Component({
  selector: 'app-pakage-incoming',
  templateUrl: './pakage-incoming.component.html',
  styleUrls: ['./pakage-incoming.component.css']
})
export class PakageIncomingComponent implements OnInit {
  searchTerm: string = '';
  data: Cargamento[] = []; // Ya no usamos la interfaz Persona
  PackageOrgId: any; // ID de la organización de paquetería, puedes cambiarlo según sea necesario
  rango: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } | null = null;
  isLoadingDatos: boolean = false;
  page: number = 0;
  size: number = 5;
  isLoading: boolean = false;
  total: number = 0;


  constructor(private rh: RHService,
    private router: Router,
    private pakage: PakageService,
    private route: ActivatedRoute,
    private fileTransferService: FileTransferService
  ) {
  }

  ngOnInit(): void {

    this.PackageOrgId = this.route.snapshot.paramMap.get('id');
    this.rango = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };

    this.getDatos(this.page, this.size);

  }

  getDatos(page: number, size: number) {

    if (!this.rango || !this.rango.startDate || !this.rango.endDate) return;

    const desdeFormatted = this.rango.startDate.format('YYYY-MM-DD');
    const hastaFormatted = this.rango.endDate.format('YYYY-MM-DD');

    this.isLoading = true; // 🔄 Inicia el spinner


    this.pakage.getCargaById(this.PackageOrgId, desdeFormatted, hastaFormatted, page, size).subscribe(
      (response: ApiResponse) => {
        this.total = Number(response.message) || 0;
        this.data = response.data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Ocurrió un error', error);
        this.isLoading = false;
      }
    );
  }

  porcentaje(item: Cargamento): number {
    const total = item.barra;
    return total;
  }

  infocard(id: number) {
    // this.fileTransferService.clearIdTercero();
    // this.fileTransferService.setIdTercero(id);
    this.router.navigate(['/pages/Paqueteria/Registro-seguimiento/' + id]);
  }

crearCargamento() {
  Swal.fire({
    title: '¿Desea crear el cargamento con o sin paquetes?',
    input: 'radio',
    inputOptions: {
      true: 'Con paquetes',
      false: 'Sin paquetes'
    },
    inputValue: 'true', // Por defecto "con paquetes"
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe elegir una opción';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const conPaquetes = result.value === 'true'; // <- aquí tienes tu true/false
      const description = conPaquetes
        ? 'Cargamento generado con paquetes'
        : 'Cargamento generado sin paquetes';

      Swal.fire({
        title: 'Creando cargamento...',
        text: 'Por favor, espere.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Aquí mandas el valor según lo requerido
      this.pakage.createIncoming(this.PackageOrgId, description, conPaquetes).subscribe({
        next: (res) => {
          Swal.fire('¡Cargamento creado!', '', 'success').then(() => {
            this.router.navigate([
              '/pages/Paqueteria/Registro-seguimiento/' + res.data
            ]);
          });
          this.getDatos(this.page, this.size); // Actualizar lista
        },
        error: (err) => {
          console.error('Error al crear cargamento:', err);
          Swal.fire('Error al crear cargamento', err.error?.message || '', 'error');
        }
      });
    }
  });
}

  cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getDatos(this.page, this.size);
  }

}
