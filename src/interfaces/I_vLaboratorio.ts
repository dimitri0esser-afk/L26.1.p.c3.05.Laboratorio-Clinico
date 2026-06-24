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