import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { LicenciasService } from 'src/app/services/licencias-service/licencias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  constructor(
    private LicenciasService: LicenciasService,
  ) {

  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      // Leer el archivo como texto
      reader.onload = () => {
        const csvData = reader.result as string;

        // Usar Papa Parse para convertir CSV a JSON
        Papa.parse(csvData, {
          header: true, // Genera un array de objetos con claves basadas en la primera fila
          skipEmptyLines: true, // Ignorar líneas vacías
          complete: (result) => {
            const jsonResult = result.data;
            console.log('JSON generado:', jsonResult);

            // Aquí puedes enviar los datos al backend o manejarlos
            this.enviarAlBackend(jsonResult);
          },
        });
      };

      reader.readAsText(file); // Lee el archivo como texto
    }
  }

  // Método para enviar los datos al backend
  enviarAlBackend(data: any): void {
this.LicenciasService.addOficios(data).subscribe(
  response => {
console.log(response.data);
    Swal.fire({
      title: '¡Éxito!',
      text: 'Se editó la licencia correctamente.',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }
);


    console.log('Enviando datos al backend:', data);
    // Aquí puedes usar un servicio HTTP para enviar los datos
}
}
