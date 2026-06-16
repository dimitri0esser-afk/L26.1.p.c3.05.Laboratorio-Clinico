// Cl_mPaciente.ts - Clase base para todos los proyectos
export default class Cl_mPaciente {
    _id = "";
    _nombre = "";
    _examenes = [];
    constructor({ id, nombre, examenes = [] }) {
        this.id = id;
        this.nombre = nombre;
        this.examenes = examenes;
    }
    set id(value) { this._id = value; }
    get id() { return this._id; }
    set nombre(value) { this._nombre = value; }
    get nombre() { return this._nombre; }
    set examenes(value) { this._examenes = value; }
    get examenes() { return this._examenes; }
    getInfo() {
        return `${this.nombre} (${this.id})`;
    }
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            examenes: this.examenes,
        };
    }
}
//# sourceMappingURL=Cl_mPaciente.js.map