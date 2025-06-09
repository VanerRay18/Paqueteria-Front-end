import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaserlService {

  constructor() { }

  private srlEmpSubject = new BehaviorSubject<any>(false);
  srlEmp$ = this.srlEmpSubject.asObservable();

  updateSrlEmp(values: { [key: string]: any }) {
    this.srlEmpSubject.next(values);
  }
  clearSrlEmp() {
    const values={
      rfc: '',
      nombre: '',
      srl_emp: '',
      fecha_ingreso:'',
      mostrar:false
    }
    this.srlEmpSubject.next(values); // O puedes usar un valor predeterminado
  }
}
