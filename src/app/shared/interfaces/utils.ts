export interface Module {
  moduleId: number;          // Identificador del módulo
  parentId: number | null;   // Identificador del módulo padre (opcional)
  parentName: string | null;  // Nombre del módulo padre (opcional)
  config: string;            // Ruta de configuración del módulo
  description: string | null; // Descripción del módulo (opcional)
  moduleName: string;        // Nombre del módulo
  icon: string;
}

export interface Persona {
  name: string;
  employeeid: number;
  totalregistros: number;
  asistencias: number;
  asistenciaBarra: number;
  faltas: number;
  faltasBarra: number;
  retardos: number;
  retardosBarra: number;
  justificadas: number;
  pendientes: number;
}

export interface VehicleCard {
  id: number; // identificador único del vehículo
  idCard: number; // identificador único de la tarjeta del vehículo
  placa: string;
  modelo: string;
  conductor: string;
  estado: {
    id: number;
    name: string;
  }; // puedes ampliar
  entregados: number;
  faltantes: number;
  imagen: string; // ruta de la imagen del vehículo
  destino: string; // destino del vehículo
  kmIniciales?: number;
  porcentaje: number; // porcentaje de entregados
}

export interface Justificacion {
  id: number;
  name: string;
  to_day: any; // fecha de la justificación
}

export interface OrgItem {
  id: number;
  name: string;
  config: {
    config: {
      minvalue: number;
      maxvalue: number;
    }
  };
}



export interface Oficio {
  oficioId: number;
  oficio: string;
  nombre: string;
  fecha_primera_licencia: string;
  fecha_ultima_licencia: string;
  total_folios: number;
  apartir: string;
  status: string;
}


export interface Logs {
  usuario: string;
  nombre: string;
  accion: string;
  data: string;
  tiempo: any;
  prev: string;
  folio: string;
}

export interface Cargamento {
  id: number;              // Ej: "#001"
  titulo: string;          // Ej: "Cargamento 1"
  ts_created: string;           // Ej: "2025-06-17"
  entregados: number;      // Ej: 80
  noEntregados: number;
  barra: number;          // Ej: 80
  paquetesTotal: number; // Ej: 100
  is_match: any; // Indica si el cargamento está completo
}

export interface LicMedica {
  sep?: any;
  sumaDias: any,
  desde: any,
  hasta: any,
  fechaFisica: any,
  total_days: any,
  nueva: any,
  formato: any,
  apartir: any,
  accidente: any,
  observaciones: any,
  fechaCaptura: any,
  id: any,
  color: any
}

export interface NominaA {
  id: any,
  retentionTotal: any;
  total: any,
  importeTotal: any,
  becarios: any,
  quincena: any,
  status: any,
  special: any
}

export interface NominaH {
  id: any,
  retentionTotal: any;
  total: any,
  importeTotal: any,
  becarios: any,
  quincena: any,
  status: any,
  fecha: any,
  special: any,
  calculada: any
}


export interface NominaP {
  retentionTotal: any,
  clabeBanco: any,
  srl_emp: any,
  liquidTotal: any,
  nombre: any,
  importTotal: any,
  clabe: any,
  curp: any
}

export interface Reporte {
  FORMA_PAGO: any,
  FECHA_INICIO: any,
  RFC: any,
  NIVEL_CM: any,
  SEGUNDO_APELLIDO: any,
  NETO: any,
  DEDUCCIONES: any,
  TIPO_NOMINA: any,
  UR: any,
  NO_COMPROBANTE: any,
  srl_emp: any,
  FECHA_TERMINO: any,
  CLABE: any,
  NOMBRE: any,
  PRIMER_APELLIDO: any,
  CURP: any,
  NSS: any,
  CT: any,
  CLAVE_PLAZA: any,
  CVE_BANCO: any,
  PERIODO: any,
  FECHA_PAGO: any,
  PERCEPCIONES: any,
  HORAS_EXTRAS: any,
  DOMINGOS_TRABAJADOS: any,
  DIAS_HORAS_EXTRA: any,
  TIPO_HORAS_EXTRA: any,
  SEMANAS_HORAS_EXTRA: any,
  uno:any,
  cuatro:any
}

export interface Anexo05 {
  FORMA_PAGO: any,
  FECHA_INICIO: any,
  RFC: any,
  NIVEL_CM: any,
  SEGUNDO_APELLIDO: any,
  NETO: any,
  DEDUCCIONES: any,
  TIPO_NOMINA: any,
  UR: any,
  NO_COMPROBANTE: any,
  srl_emp: any,
  FECHA_TERMINO: any,
  CLABE: any,
  NOMBRE: any,
  PRIMER_APELLIDO: any,
  CURP: any,
  NSS: any,
  CT: any,
  CLAVE_PLAZA: any,
  CVE_BANCO: any,
  PERIODO: any,
  FECHA_PAGO: any,
  PERCEPCIONES: any,
  HORAS_EXTRAS: any,
  DOMINGOS_TRABAJADOS: any,
  DIAS_HORAS_EXTRA: any,
  TIPO_HORAS_EXTRA: any,
  SEMANAS_HORAS_EXTRA: any
}

export interface Anexo06 {
  TIPO_NOMINA: any,
  UR: any,
  NO_COMPROBANTE: any,
  CURP: any,
  PERIODO: any,
  CLAVE_PLAZA: any,
  TIPO_CONCEPTO: any,
  DESC_CONCEPTO: any,
  IMPORTE: any,
  COD_CONCEPTO: any,
  BASE_CALCULO_ISR: any
}


export interface NotificacionERP {
  name: any,
  fecha: any,
  icon: any,
  id: any,
  message: any,
  title: any,
  status: any,
  timeAgo?: string;
}

export interface SendEmailDTO {
  subject: any,
  message: any,
  from: any
}

export interface Email {
  email: any,
  deleted:any,
  active:any,
  id: any
  system: any
}

export interface Resumen {
  clabes: any,
  plazas: any,
  deducciones:any,
  personas:any,
  percepciones:any,
  liquido:any
}

export interface Movs {
  altas: any,
  bajas:any,
  modificaciones:any,
  total: any
}

export interface Info {
  accepted: any,
  records: any,
  rejected: any,
  sinLiquido: any,
  status: any,
  terceroId: any,
  quincena: any,
  users: any;
}

export interface RegistroTabla {
  rfc: string;
  nombre: string;
  documento: string;
  tipo: string;
  importe: string;
  concepto: string;
  desde: string;
  srl_emp: string;
}


// export interface clave{
//   CT: string;
//   PLAZA: string;
// }

// export interface licencia{
//   hasta: string;
//   desde: string;
//   periodo: number;
//   srl_emp: number;
//   nombre: string;
//   rfc: string;
//   foliolic: string;
//   oficio: string;
//   fechaCaptura: string;
//   observaciones: string;
//   apartir: string;
//   total_dias: number;
// }



export interface OficioPdf {
  data: {
    nombre: string;
    rfc: string;
    fecha_ingreso: string;
  };
  claves: Array<{
    PLAZA: string;
    CT: string;
  }>;
  licencias: Array<{
    foliolic: string;
    total_dias: string;
    desde: string;
    hasta: string;
    observaciones: string;
    apartir?: string;
    oficio: string;
  }>;
}

export interface historico {
  data: {
    nombre: string;
    rfc: string;
    fecha_ingreso: number;
  };
  licencias: Array<{
    hasta: string;
    desde: string;
    periodo: number;
    srl_emp: number;
    nombre: string;
    rfc: string;
    foliolic: string;
    oficio: number | null,
    fechaCaptura: string;
    observaciones: string;
    apartir: string | null;
    sumaDias: number;
    accidente: number;
    sep: number;
    total_dias: number;
  }>;
}


export interface Terceros {
  nombre: string;
  registros: number;
}

