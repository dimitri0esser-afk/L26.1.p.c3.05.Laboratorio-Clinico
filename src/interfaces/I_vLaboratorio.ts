export interface I_vLaboratorio {
  get pacienteSeleccionadoId(): string | null;
  onNuevoPaciente(callback: () => void): void;
  onAsignarEstudios(callback: () => void): void;
  onVerResultados(callback: () => void): void;
  onImprimir(callback: () => void): void;
  onSeleccionarPaciente(callback: (id: string) => void): void;
  onRegistrarPago(callback: () => void): void;
  onGuardarPaciente(callback: (cedula: string, nombre: string) => void): void;
  onGuardarEstudios(callback: (estudios: any[]) => void): void;


  onBuscarResultados(callback: (tipoExamen: string, fecha: string) => void): void;

  onLimpiarBusqueda(callback: () => void): void;

  // ============================================================
  //  onSeleccionarEstudio() – REQUERIMIENTO AGREGADO
  //  Registra un callback que se ejecuta cuando el usuario
  //  selecciona un estudio del dropdown de estadísticas.
  //  El callback recibe el nombre del estudio seleccionado.
  // ============================================================
  onSeleccionarEstudio(callback: (nombreEstudio: string) => void): void;

  // ============================================================
  //  mostrarEstadisticas() – REQUERIMIENTO AGREGADO
  //  Recibe un objeto con propiedades calculadas por el controlador:
  //    - solicitudesPorEstudio:     arreglo con {nombre, solicitudes, ingresoTotal} por cada tipo de examen
  //    - porcentajeFinalizados:     % de exámenes con realizado=true
  //    - nombresEstudios:           arreglo con los nombres de todos los estudios disponibles
  //    - promedioEstudioSeleccionado:  promedio numérico del estudio seleccionado (null si no hay)
  //    - estudioSeleccionado:          nombre del estudio actualmente seleccionado
  // ============================================================
  mostrarEstadisticas(estadisticas: {
    solicitudesPorEstudio: { nombre: string; solicitudes: number; ingresoTotal: number }[];
    porcentajeFinalizados: number;
    nombresEstudios: string[];
    promedioEstudioSeleccionado: number | null;
    estudioSeleccionado: string;
  }): void;

  mostrarPacientes(pacientes: any[], cantidad: number): void;
  mostrarEstudiosAsignados(estudios: any[]): void;
  mostrarCobranza(monto: number, pagado: boolean): void;
  mostrarResultados(resultados: any[], total: number): void;
  imprimirReporte(resultados: any[]): void;
  mostrarModalPaciente(): void;
  ocultarModalPaciente(): void;
  mostrarModalEstudios(examenes: any[]): void;
  ocultarModalEstudios(): void;
  mostrar(): void;
  ocultar(): void;
  limpiarSeleccion(): void;

  limpiarFiltrosBusqueda(): void;
}
