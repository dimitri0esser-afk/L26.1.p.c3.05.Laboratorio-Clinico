export interface I_vUsuario {
  getDatosPaciente(): { cedula: string; nombre: string;  email: string };
  getEstudiosSeleccionados(): any[];
  mostrarMensaje(mensaje: string, tipo: "success" | "error"): void;
  mostrarResumen(datos: any): void;
  limpiarFormulario(): void;
  onGuardarDatos(callback: () => void): void;
  onGuardarEstudios(callback: () => void): void;
  onSaltarEstudios(callback: () => void): void;
  mostrarFormularioPaciente(): void;
  mostrarFormularioEstudios(): void;
  mostrarResumenVista(): void;
}