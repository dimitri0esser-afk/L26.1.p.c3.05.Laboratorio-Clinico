export interface I_vExamen {
  get pacienteId(): string;
  get examenId(): string;
  get resultadoValor(): string;
  setPacienteId(value: string): void;   
  setExamenId(value: string): void;     
  onEnviar(callback: () => void): void;
  mostrar(): void;
  ocultar(): void;
  limpiar(): void;
}