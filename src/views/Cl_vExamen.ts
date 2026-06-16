import { I_vExamen } from "../interfaces/I_vExamen.js";
import Cl_sMockApi from "../services/Cl_sMockApi.js";

export default class Cl_vExamen implements I_vExamen {
  vista: HTMLElement | null;
  inPacienteId: HTMLInputElement | null;
  selExamen: HTMLSelectElement | null;
  inResultado: HTMLInputElement | null;
  btEnviar: HTMLButtonElement | null;
  
  private examenesDisponibles: any[] = [];

  constructor() {
    this.vista = document.getElementById("examen");
    this.inPacienteId = document.getElementById("examen_inPacienteId") as HTMLInputElement | null;
    this.selExamen = document.getElementById("examen_selExamen") as HTMLSelectElement | null;
    this.inResultado = document.getElementById("examen_inResultado") as HTMLInputElement | null;
    this.btEnviar = document.getElementById("examen_btEnviar") as HTMLButtonElement | null;
    
    // Cargar catálogo de exámenes desde mockapi
    this.cargarCatalogo();
  }

  private async cargarCatalogo() {
    try {
      const resultado = await Cl_sMockApi.getCatalogo();
      
      if (resultado.ok && resultado.data && resultado.data.length > 0) {
        this.examenesDisponibles = resultado.data.map((ex: any) => ({
          id: ex.codigo || ex.id,
          nombre: ex.nombre,
          costo: ex.precio
        }));
        console.log(`Bioanalista: ${this.examenesDisponibles.length} exámenes cargados`);
      } else {
        // Fallback por si no hay conexión o catálogo vacío
        this.examenesDisponibles = [
          { id: "HEMO01", nombre: "Hemoglobina", costo: 15 },
          { id: "GLUC02", nombre: "Glucosa", costo: 10 },
          { id: "COL03", nombre: "Colesterol", costo: 20 },
          { id: "UREA04", nombre: "Urea", costo: 12 },
          { id: "CREA05", nombre: "Creatinina", costo: 18 }
        ];
        console.warn("Bioanalista: Usando catálogo por defecto");
      }
    } catch (error) {
      console.error("Error cargando catálogo:", error);
      this.examenesDisponibles = [
        { id: "HEMO01", nombre: "Hemoglobina", costo: 15 },
        { id: "GLUC02", nombre: "Glucosa", costo: 10 },
        { id: "COL03", nombre: "Colesterol", costo: 20 },
        { id: "UREA04", nombre: "Urea", costo: 12 },
        { id: "CREA05", nombre: "Creatinina", costo: 18 }
      ];
    }
    
    this.actualizarSelect();
  }

  private actualizarSelect(): void {
    if (!this.selExamen) return;
    
    this.selExamen.innerHTML = "";
    
    this.examenesDisponibles.forEach(examen => {
      const option = document.createElement("option");
      option.value = examen.id;
      option.textContent = `${examen.nombre} - Bs.${examen.costo}`;
      this.selExamen?.appendChild(option);
    });
  }

  get pacienteId(): string {
    return this.inPacienteId?.value.trim() || "";
  }

  get examenId(): string {
    return this.selExamen?.value || "";
  }

  get resultadoValor(): string {
    return this.inResultado?.value.trim() || "";
  }

  onEnviar(callback: () => void): void {
    if (this.btEnviar) this.btEnviar.onclick = callback;
  }

  mostrar(): void {
    if (this.vista) this.vista.hidden = false;
  }

  ocultar(): void {
    if (this.vista) this.vista.hidden = true;
  }

  limpiar(): void {
    if (this.inPacienteId) this.inPacienteId.value = "";
    if (this.inResultado) this.inResultado.value = "";
  }

  setPacienteId(value: string): void {
    if (this.inPacienteId) this.inPacienteId.value = value;
  }

  setExamenId(value: string): void {
    if (this.selExamen) this.selExamen.value = value;
  }
}