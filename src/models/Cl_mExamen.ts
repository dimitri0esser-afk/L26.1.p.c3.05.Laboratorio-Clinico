// Cl_mExamen.ts - Hereda de Cl_mPaciente
import Cl_mPaciente from "./Cl_mPaciente.js";

export type EstadoExamen = "preparación" | "pendiente" | "listo";

export default class Cl_mExamen extends Cl_mPaciente {
  private _costo: number = 0;
  private _estado: EstadoExamen = "preparación";

  constructor({ id, nombre, costo }: { id: string; nombre: string; costo: number }) {
    super({ id, nombre });
    this.costo = costo;
  }

  set costo(value: number) { this._costo = value; }
  get costo(): number { return this._costo; }

  set estado(value: EstadoExamen) { this._estado = value; }
  get estado(): EstadoExamen { return this._estado; }

  getEstadoTexto(): string {
    switch (this._estado) {
      case "preparación": return "🔧 En preparación";
      case "pendiente": return "⏳ Pendiente";
      case "listo": return "✅ Listo";
      default: return "❓ Desconocido";
    }
  }

  getInfo(): string {
    return `Examen: ${this.nombre} - Bs.${this.costo} - ${this.getEstadoTexto()}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      costo: this.costo,
      estado: this.estado,
    };
  }
}