import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
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

  constructor(
    private Pk: PakageService
  ) {}

  ngOnInit(): void {
    // Aquí podrías cargar los datos iniciales si es necesario
  }
mapEstado(statusName: string): 'En Ruta' | 'En Bodega' | 'Entregado' {
  switch (statusName?.toUpperCase()) {
    case 'EN RUTA':
    case 'RUTA':
      return 'En Ruta';
    case 'ENTREGADO':
      return 'Entregado';
    case 'CARGAMENTO CREADO':
    default:
      return 'En Bodega';
  }
}

getData(): void {
  this.Pk.getDeliveriesCar().subscribe((response: ApiResponse) => {
    console.log('Datos recibidos:', response.data);
    // 🔁 Mapear los datos recibidos al modelo VehicleCard
    this.vehicleCards = response.data.map((item: any) => {
      const conductor = `${item.employee?.name || ''} ${item.employee?.firstSurname || ''} ${item.employee?.secondSurname || ''}`.trim();
      const entregados = item.entregados || 0;
      const noEntregados = item.noEntregados || 0;
      const total = entregados + noEntregados;
      const porcentaje = total > 0 ? Math.round((entregados / total) * 100) : 0;

      return {
        placa: item.car?.placa || '',
        modelo: item.car?.modelo || '',
        conductor: conductor || 'Sin conductor',
        estado: this.mapEstado(item.catStatus?.name), // 👈 Estado amigable
        entregados: entregados,
        faltantes: noEntregados,
        imagen: 'assets/img/vehiculo.png', // 🔁 Cambia según imagen real
        destino: 'Sin destino asignado', // 🔁 Usa tu lógica real aquí
        porcentaje: porcentaje,
        kmIniciales: 0, // Agrega si lo tienes
      } as VehicleCard;
    });
    console.log('Cards generadas:', this.vehicleCards);

  }, error => {
    console.error('Ocurrió un error', error);
  });
}
  

  // vehicleCards: VehicleCard[] = [
  //   {
  //     placa: 'MCH4VH0Q',
  //     modelo: 'Nissan Versa',
  //     conductor: 'Juan Perez Sanchez',
  //     estado: 'En Ruta',
  //     entregados: 2,
  //     faltantes: 20,
  //     imagen: 'assets/nissan1.jpg',
  //     destino: 'Sucursal Centro',
  //     porcentaje: 10 // Porcentaje de entregados
  //   },
  //   {
  //     placa: 'XYZ1234',
  //     modelo: 'Toyota Hilux',
  //     conductor: 'Ana Lopez',
  //     estado: 'Entregado',
  //     entregados: 22,
  //     faltantes: 0,
  //     imagen: 'assets/nissan1.jpg',
  //     destino: 'Sucursal Norte',
  //     porcentaje: 100
  //   },
  //   {
  //     placa: 'FYZWR34',
  //     modelo: 'Honda Odise',
  //     conductor: '',
  //     estado: 'En Bodega',
  //     entregados: 0,
  //     faltantes: 0,
  //     imagen: 'assets/nissan1.jpg',
  //     destino: '',
  //     porcentaje: 0
  //   },
  //   // agrega más vehículos aquí
  // ];

  mostrarSwalVehiculo(vehicle: VehicleCard): void {
    const necesitaConfigurar =
      !vehicle.conductor || !vehicle.destino || (this.paquetes.length === 0);

    if (necesitaConfigurar) {
      this.mostrarSwalFormularioPrevio(vehicle);
    } else {
      this.mostrarSwalPrincipal(vehicle);
    }
  }

  mostrarSwalFormularioPrevio(vehicle: VehicleCard): void {
    Swal.fire({
      title: 'Asignar datos al vehículo',
      html: `
      <input id="input-conductor" class="swal2-input" placeholder="Conductor" value="${vehicle.conductor || ''}">
      <input id="input-destino" class="swal2-input" placeholder="Destino" value="${vehicle.destino || ''}">
      <input id="input-km" class="swal2-input" placeholder="Kilómetros Iniciales" type="number" value="${vehicle.kmIniciales || ''}">
    `,
      confirmButtonText: 'Guardar y continuar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const conductor = (document.getElementById('input-conductor') as HTMLInputElement).value;
        const destino = (document.getElementById('input-destino') as HTMLInputElement).value;
        const km = parseFloat((document.getElementById('input-km') as HTMLInputElement).value);

        if (!conductor || !destino || isNaN(km)) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false; // Evita continuar si no se completó el formulario
        }

        // Modifica los datos directamente
        vehicle.conductor = conductor;
        vehicle.destino = destino;
        vehicle.kmIniciales = km;
        vehicle.estado = 'En Bodega';
        return true;
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.mostrarSwalPrincipal(vehicle); // Continúa con el flujo principal
      }
    });
  }

  mostrarSwalPrincipal(vehicle: VehicleCard): void {
    Swal.fire({
      html: this.obtenerHtmlVehiculo(vehicle),
      width: 700,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'swal-popup-scroll'
      }
    });

    setTimeout(() => {
      const btn = document.getElementById('btn-escanear');
      if (btn) {
        btn.addEventListener('click', () => this.mostrarSwalEscaneo(vehicle));
      }
    }, 50);
  }

  mostrarSwalEscaneo(vehicle: VehicleCard): void {
    Swal.fire({
      title: 'Comience a escanear los paquetes',
      html: `
        <input id="input-paquete" class="swal2-input" placeholder="Escanea o escribe el paquete" autofocus>
        <div id="lista-paquetes" style="max-height: 250px; overflow-y: auto; text-align: left; margin-top: 1rem;"></div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      preConfirm: () => {
        return this.paquetes;
      },
      didOpen: () => {
        const input = document.getElementById('input-paquete') as HTMLInputElement;
        const lista = document.getElementById('lista-paquetes');

        const renderLista = () => {
          if (!lista) return;
          lista.innerHTML = this.paquetes.map((p, i) => `
            <div style="display: flex; justify-content: space-between; padding: 6px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 4px;">
              <span>${p}</span>
              <button style="border: none; background: none; color: red; cursor: pointer;"
                onclick="document.dispatchEvent(new CustomEvent('quitar-paquete', { detail: ${i} }))">✖</button>
            </div>
          `).join('');
        };

        input?.addEventListener('keypress', (event: KeyboardEvent) => {
          if (event.key === 'Enter' && input.value.trim()) {
            this.paquetes.push(input.value.trim());
            input.value = '';
            renderLista();
          }
        });

        document.addEventListener('quitar-paquete', (e: any) => {
          const index = e.detail;
          this.paquetes.splice(index, 1);
          renderLista();
        });

        input?.focus();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Volver al primer swal con paquetes actualizados
        this.mostrarSwalPrincipal(vehicle);
      }
    });
  }

  obtenerHtmlVehiculo(v: VehicleCard): string {
    return `
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <img src="${v.imagen}" alt="Car" width="100" />
        <h2 style="margin: 0; font-weight: bold;">${v.placa}</h2>
        <p style="margin-top: 4px; font-size: 1.1rem; color: #333;">${v.modelo}</p>
<div style="margin-top: 20px; text-align: left;">
  <h3 style="margin-bottom: 10px;">Paquetes registrados en el vehículo</h3>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Total:</strong> ${this.paquetes.length}</div>
    <button id="btn-escanear" style="
      padding: 6px 12px;
      background: transparent;
      border: 1px solid #60a5fa;
      color: #2563eb;
      border-radius: 6px;
      cursor: pointer;
    ">Comenzar a escanear</button>
  </div>
</div>

        <div style="margin-top: 20px;">
          ${this.paquetes.map(p => this.htmlBarraProgreso(p)).join('')}
        </div>
      </div>
    `;
  }

  htmlBarraProgreso(paquete: string): string {
    return `
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 500; margin-bottom: 4px;">${paquete}</div>
        <div style="height: 10px; background: #eee; border-radius: 10px; overflow: hidden;">
          <div style="width: 20%; background: #b91c1c; height: 100%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #666; margin-top: 4px;">
          <span>En Bodega</span>
          <span>En Ruta</span>
          <span>Entregado</span>
        </div>
      </div>
    `;
  }

}
