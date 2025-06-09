export interface User {
    area: string;
    rolesNombres: string[];  // Roles del usuario
    nombreCat: string;
    userId: number;
    nombre: string;
    srlEmp: number;
    rfc: string;
    rolesIds: number[];
    funciones: string;
    extrasName: string[];
    extrasId: number[];
    usuario: string;
    cargo:string;
  }

  export interface Employee {
    rfc: string;
    nombre: string;
    srl_emp: number;
    fecha_ingreso: number;
  }
