import Cl_sMockApi from "../services/Cl_sMockApi.js";
export default class Cl_vExamen {
    vista;
    inPacienteId;
    selExamen;
    inResultado;
    btEnviar;
    examenesDisponibles = [];
    constructor() {
        this.vista = document.getElementById("examen");
        this.inPacienteId = document.getElementById("examen_inPacienteId");
        this.selExamen = document.getElementById("examen_selExamen");
        this.inResultado = document.getElementById("examen_inResultado");
        this.btEnviar = document.getElementById("examen_btEnviar");
        // Cargar catálogo de exámenes desde mockapi
        this.cargarCatalogo();
    }
    async cargarCatalogo() {
        try {
            // ✅ CAMBIADO: getCatalogo() → getResultados()
            const resultado = await Cl_sMockApi.getResultados();
            if (resultado.ok && resultado.data && resultado.data.length > 0) {
                this.examenesDisponibles = resultado.data.map((ex) => ({
                    id: ex.codigo || ex.id,
                    nombre: ex.nombre,
                    costo: ex.precio
                }));
                console.log(`Bioanalista: ${this.examenesDisponibles.length} exámenes cargados`);
            }
            else {
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
        }
        catch (error) {
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
    actualizarSelect() {
        if (!this.selExamen)
            return;
        this.selExamen.innerHTML = "";
        this.examenesDisponibles.forEach(examen => {
            const option = document.createElement("option");
            option.value = examen.id;
            option.textContent = `${examen.nombre} - Bs.${examen.costo}`;
            this.selExamen?.appendChild(option);
        });
    }
    get pacienteId() {
        return this.inPacienteId?.value.trim() || "";
    }
    get examenId() {
        return this.selExamen?.value || "";
    }
    get resultadoValor() {
        return this.inResultado?.value.trim() || "";
    }
    onEnviar(callback) {
        if (this.btEnviar)
            this.btEnviar.onclick = callback;
    }
    mostrar() {
        if (this.vista)
            this.vista.hidden = false;
    }
    ocultar() {
        if (this.vista)
            this.vista.hidden = true;
    }
    limpiar() {
        if (this.inPacienteId)
            this.inPacienteId.value = "";
        if (this.inResultado)
            this.inResultado.value = "";
    }
    setPacienteId(value) {
        if (this.inPacienteId)
            this.inPacienteId.value = value;
    }
    setExamenId(value) {
        if (this.selExamen)
            this.selExamen.value = value;
    }
}
//# sourceMappingURL=Cl_vExamen.js.map