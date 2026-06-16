import Cl_sExamen from "../services/Cl_sExamen.js";
export default class Cl_cListaPendientes {
    vistaLista;
    vistaExamen;
    constructor(vistaLista, vistaExamen) {
        this.vistaLista = vistaLista;
        this.vistaExamen = vistaExamen;
        this.vistaLista.onSeleccionar((pacienteId, examenId) => {
            this.seleccionarExamen(pacienteId, examenId);
        });
        window.addEventListener("examen:guardado", () => this.cargarPendientes());
        this.cargarPendientes();
    }
    async cargarPendientes() {
        const resultado = await Cl_sExamen.obtenerExamenesPendientes();
        this.vistaLista.mostrarLista(resultado.data);
    }
    seleccionarExamen(pacienteId, examenId) {
        this.vistaExamen.setPacienteId(pacienteId);
        this.vistaExamen.setExamenId(examenId);
        this.vistaExamen.mostrar();
        document.getElementById("examen")?.scrollIntoView({ behavior: "smooth" });
    }
}
//# sourceMappingURL=Cl_cListaPendientes.js.map