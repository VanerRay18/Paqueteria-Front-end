import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { LicenciasService } from 'src/app/services/licencias-service/licencias.service';
import { Employee } from '../../interfaces/usuario.model';
import { LicMedica } from '../../interfaces/utils';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { BusquedaserlService } from 'src/app/services/busquedaserl.service';
import { PermisosUserService } from 'src/app/services/permisos-user.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnDestroy {
  data = [];
  showCard: boolean = false;
  table: any = true;

  rfcSearchTerm: string = '';
  nombreSearchTerm: string = '';
  rfcFavorSearchTerm: string = ''; // Nuevo término de búsqueda para RFC de favor

  items: { rfc: string; nombre: string; srl_emp: number; fecha_ingreso: number}[] = [];
  rfcSuggestions: { rfc: string; nombre: string; srl_emp: number ;fecha_ingreso: number}[] = [];
  nombreSuggestions: { rfc: string; nombre: string; srl_emp: number;fecha_ingreso: number }[] = [];
  rfcFavorSuggestions: { rfc: string; nombre: string; srl_emp: number;fecha_ingreso: number }[] = []; // Sugerencias para RFC de favor

  private rfcSearchSubject: Subject<string> = new Subject<string>();
  private nombreSearchSubject: Subject<string> = new Subject<string>();
  private rfcFavorSearchSubject: Subject<string> = new Subject<string>(); // Subject para RFC de favor

  @Output() srl_emp: EventEmitter<any> = new EventEmitter();
  @Output() fecha_ingreso: EventEmitter<any> = new EventEmitter();
  @Output() ArrayDates: EventEmitter<any> = new EventEmitter();


  @Output() arrayUser: EventEmitter<any> = new EventEmitter();

  constructor(
    private LicenciasService: LicenciasService,
    public PermisosUserService: PermisosUserService
  ) {
    // Configurar debounce y distinctUntilChanged para evitar bucles
    this.rfcSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => this.performRFCSearch(searchTerm));

    this.nombreSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => this.performNombreSearch(searchTerm));

    this.rfcFavorSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => this.performRFCFavorSearch(searchTerm));
  }

  ngOnInit() {
  

    this.LicenciasService.getUsers().subscribe((response: { data: Employee[] }) => {
  
      this.items = response.data.map((user: Employee) => ({
        rfc: user.rfc,
        nombre: user.nombre,
        srl_emp: user.srl_emp,
        fecha_ingreso: user.fecha_ingreso
      }));
    });
  }

  ngOnDestroy(){
  }



  clean() {
    this.rfcSearchTerm = '';
    this.nombreSearchTerm = '';
    this.rfcFavorSearchTerm = ''; // Limpiar RFC de favor

    const valores = {
      mostrar: false
    };

    this.envio(valores);
  }

  // Filtrar RFC al escribir
  filterRFC() {
    this.rfcSearchSubject.next(this.rfcSearchTerm);
  }

  // Filtrar Nombre al escribir
  filterNombre() {
    this.nombreSearchSubject.next(this.nombreSearchTerm);
  }

  // Filtrar RFC de favor al escribir
  filterRFCFavor() {
    this.rfcFavorSearchSubject.next(this.rfcFavorSearchTerm);
  }

  private performRFCSearch(searchTerm: string) {
    if (searchTerm.length >= 3) {
      this.rfcSuggestions = this.items.filter(item =>
        item.rfc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.rfcSuggestions = [];
    }
    this.nombreSuggestions = [];
  }

  private performNombreSearch(searchTerm: string) {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    if (searchTerms.length > 0) {
      this.nombreSuggestions = this.items.filter(item =>
        searchTerms.every(term => item.nombre.toLowerCase().includes(term))
      );
    } else {
      this.nombreSuggestions = [];
    }
    this.rfcSuggestions = [];
  }

  private performRFCFavorSearch(searchTerm: string) {
    if (searchTerm.length >= 3) {
      this.rfcFavorSuggestions = this.items.filter(item =>
        item.rfc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.rfcFavorSuggestions = [];
    }
  }

  selectRFC(item: { rfc: string; nombre: string; srl_emp: number; fecha_ingreso: number }) {
    this.rfcSearchTerm = item.rfc;
    this.nombreSearchTerm = item.nombre;
    this.rfcSuggestions = [];
    this.nombreSuggestions = [];
    this.srl_emp.emit(item.srl_emp);
    this.fecha_ingreso.emit(item.fecha_ingreso);

    const valores = {
      srl_emp: item.srl_emp,
      rfc: item.rfc,
      nombre: item.nombre,
      fecha_ingreso: item.fecha_ingreso,
      mostrar: true
    };

    this.envio(valores);
  }

  selectNombre(item: { rfc: string; nombre: string; srl_emp: number; fecha_ingreso: number }) {
    this.nombreSearchTerm = item.nombre;
    this.rfcSearchTerm = item.rfc;
    this.srl_emp.emit(item.srl_emp);
    this.fecha_ingreso.emit(item.fecha_ingreso);

    const valores = {
      srl_emp: item.srl_emp,
      rfc: item.rfc,
      nombre: item.nombre,
      fecha_ingreso: item.fecha_ingreso,
      mostrar: true
    };

    this.envio(valores);

    this.rfcSuggestions = [];
    this.nombreSuggestions = [];
  }

  envio(event:any) {
    this.arrayUser.emit(event);
  }
}
