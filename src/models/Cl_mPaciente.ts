// Cl_mPaciente.ts - Clase base para todos los proyectos
export default class Cl_mPaciente {
  private _id: string = "";
  private _nombre: string = "";
  private _examenes: any[] = [];

  constructor({ id, nombre, examenes = [] }: { id: string; nombre: string; examenes?: any[] }) {
    this.id = id;
    this.nombre = nombre;
    this.examenes = examenes;
  }

  set id(value: string) { this._id = value; }
  get id(): string { return this._id; }

  set nombre(value: string) { this._nombre = value; }
  get nombre(): string { return this._nombre; }

  set examenes(value: any[]) { this._examenes = value; }
  get examenes(): any[] { return this._examenes; }



  getInfo(): string {
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