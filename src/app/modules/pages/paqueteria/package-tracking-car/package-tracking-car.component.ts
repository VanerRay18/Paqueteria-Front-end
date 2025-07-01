import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { PakageService } from 'src/app/services/pakage.service';
import { VehicleCard } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-tracking-car',
  templateUrl: './package-tracking-car.component.html',
  styleUrls: ['./package-tracking-car.component.css']
})
export class PackageTrackingCarComponent implements OnInit {
  filtro: string = '';
  paquetes: string[] = [];
  vehicleCards: VehicleCard[] = [];
  catEmployees: any;

    page: number = 0;
  size: number = 4;
  isLoading: boolean = true;
  total: number = 0;

  constructor(
    private Pk: PakageService,
    private fileTransferService: FileTransferService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData(this.page, this.size); // Cargar los datos al iniciar el componente
    // Aquí podrías cargar los datos iniciales si es necesario
  }
 cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getData(this.page, this.size);
  }

  getData(page:any,size:any): void {
    this.isLoading = true;
    this.Pk.getCatEmpl().subscribe({
      next: (response) => {
        

        this.catEmployees = response.data;

        // console.log('Datos de todos los empleados:', response);
      },
      error: (err) => {
        console.error('Error al obtener datos de empleados', err);
      }
    });

    this.Pk.getDeliveriesCar(page, size).subscribe((response: ApiResponse) => {
      console.log('Datos de entregas de vehículos:', response);
      // Verifica el ID
    this.isLoading = false;
            this.total = Number(response.message);
      // 🔁 Mapear los datos recibidos al modelo VehicleCard
      this.vehicleCards = response.data.map((item: any) => {
        const conductor = `${item.employee?.name || ''} ${item.employee?.firstSurname || ''} ${item.employee?.secondSurname || ''}`.trim();
        const entregados = item.entregados || 0;
        const noEntregados = item.noEntregados || 0;
        const total = entregados + noEntregados;
        const porcentaje = total > 0 ? Math.round((entregados / total) * 100) : 0;
        const id = item.id; // Asegúrate de que el ID esté presente

        return {
          placa: item.car?.placa || '',
          modelo: item.car?.modelo || '',
          conductor: conductor || 'Sin conductor',
          entregados: entregados,
          faltantes: noEntregados,
          imagen: 'assets/nissan1.png', // 🔁 Cambia según imagen real
          destino: item.destino || 'Sin destino asignado', // 🔁 Usa tu lógica real aquí
          porcentaje: porcentaje,
          kmIniciales: 0, // Agrega si lo tienes
          id: id, // Asegúrate de incluir el ID
          idCard: item.car.idCard || 0, // Asegúrate de que el ID de la tarjeta esté presente
          estado: {
            id: item.catStatus?.id,
            name: item.catStatus?.name || 'Sin estado'
          },
        } as VehicleCard;
      });


    }, error => {
      console.error('Ocurrió un error', error);
    });
  }


  mostrarSwalVehiculo(vehicle: VehicleCard): void {

    if (!vehicle.conductor || vehicle.conductor === 'Sin conductor') {
      this.mostrarSwalFormularioPrevio(vehicle);
      return;
    }

    // console.log('ID del vehículo seleccionado:', vehicle);
    this.router.navigate(['/pages/Paqueteria/Paquetes-vehiculo/' + vehicle.id]);
  }


  mostrarSwalFormularioPrevio(vehicle: VehicleCard): void {

    // Generar las opciones del dropdown con los empleados
    const opcionesConductor = this.catEmployees.map((emp: any) =>
      `<option value="${emp.id}">${emp.name} ${emp.first_surname} ${emp.second_surname}</option>`
    ).join('');

    Swal.fire({
      title: 'Asignar datos al vehículo',
      html: `
      <select id="select-conductor" class="swal2-input">
        <option value="">Selecciona un conductor</option>
        ${opcionesConductor}
      </select>
      <input id="input-destino" class="swal2-input" placeholder="Destino" value=" ">
      <input id="input-description" class="swal2-input" placeholder="Descripción">
    `,
      confirmButtonText: 'Guardar y continuar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const select = document.getElementById('select-conductor') as HTMLSelectElement;
        const destino = (document.getElementById('input-destino') as HTMLInputElement).value.trim();
        const description = (document.getElementById('input-description') as HTMLInputElement).value.trim();

        const conductorId = select.value;


        if (!conductorId || !destino || !description) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        // Construir el payload como pide el backend
        const data = {
          description: description,
          carId: vehicle.idCard,
          destino: destino,
          employeeId: Number(conductorId)
        };

        return data;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {

        // Mandar la data al backend
        this.Pk.createDeliveryCar(result.value).subscribe({
          next: () => {
            this.getData(this.page,this.size);
            this.router.navigate(['/pages/Paqueteria/Paquetes-vehiculo/' + vehicle.id]);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo guardar la información del vehículo.', 'error');
          }
        });
      }
    });
  }



}
