import { I_vListaPendientes } from "../interfaces/I_vListaPendientes.js";
import { I_vExamen }          from "../interfaces/I_vExamen.js";
import Cl_sExamen             from "../services/Cl_sExamen.js";

export default class Cl_cListaPendientes {
    private vistaLista:  I_vListaPendientes;
    private vistaExamen: I_vExamen;

    constructor(vistaLista: I_vListaPendientes, vistaExamen: I_vExamen) {
    this.vistaLista  = vistaLista;
    this.vistaExamen = vistaExamen;

    this.vistaLista.onSeleccionar((pacienteId, examenId) => {
    this.seleccionarExamen(pacienteId, examenId);
    });

    window.addEventListener("examen:guardado", () => this.cargarPendientes());

    this.cargarPendientes();
    }

    async cargarPendientes(): Promise<void> {
    const resultado = await Cl_sExamen.obtenerExamenesPendientes();
    this.vistaLista.mostrarLista(resultado.data);
    }

    seleccionarExamen(pacienteId: string, examenId: string): void {
    this.vistaExamen.setPacienteId(pacienteId);
    this.vistaExamen.setExamenId(examenId);
    this.vistaExamen.mostrar();
    document.getElementById("examen")?.scrollIntoView({ behavior: "smooth" });
    }
}