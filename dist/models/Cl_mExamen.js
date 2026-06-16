// Cl_mExamen.ts - Hereda de Cl_mPaciente
import Cl_mPaciente from "./Cl_mPaciente.js";
export default class Cl_mExamen extends Cl_mPaciente {
    _costo = 0;
    _estado = "preparación";
    constructor({ id, nombre, costo }) {
        super({ id, nombre });
        this.costo = costo;
    }
    set costo(value) { this._costo = value; }
    get costo() { return this._costo; }
    set estado(value) { this._estado = value; }
    get estado() { return this._estado; }
    getEstadoTexto() {
        switch (this._estado) {
            case "preparación": return "🔧 En preparación";
            case "pendiente": return "⏳ Pendiente";
            case "listo": return "✅ Listo";
            default: return "❓ Desconocido";
        }
    }
    getInfo() {
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
//# sourceMappingURL=Cl_mExamen.js.map