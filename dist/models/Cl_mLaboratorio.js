import Cl_sMockApi from "../services/Cl_sMockApi.js";
export default class Cl_mLaboratorio {
    examenesDisponibles = [];
    cargando = false;
    constructor() {
        this.cargarCatalogo();
    }
    async cargarCatalogo() {
        if (this.cargando)
            return;
        this.cargando = true;
        const resultado = await Cl_sMockApi.getResultados();
        if (resultado.ok && resultado.data && resultado.data.length > 0) {
            this.examenesDisponibles = resultado.data.map((ex) => ({
                id: ex.codigo || ex.id,
                nombre: ex.nombre,
                costo: ex.precio,
                valorReferencia: ex.valorReferencia || ""
            }));
            console.log(`Catalogo cargado: ${this.examenesDisponibles.length} examenes`);
        }
        else {
            console.warn("Usando catalogo por defecto (sin conexion a mockapi)");
            this.examenesDisponibles = [
                { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
                { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
                { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
                { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
                { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
            ];
        }
        this.cargando = false;
    }
    getExamenesDisponibles() {
        return this.examenesDisponibles;
    }
    async recargarCatalogo() {
        await this.cargarCatalogo();
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map