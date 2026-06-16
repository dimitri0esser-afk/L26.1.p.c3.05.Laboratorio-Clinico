import Cl_sMockApi from "./Cl_sMockApi.js";
export default class Cl_sLaboratorio extends Cl_sMockApi {
    static async obtenerPacientes() {
        return await this.getPacientes();
    }
    static async guardarPaciente(paciente) {
        return await this.postPaciente(paciente);
    }
    static async actualizarPaciente(id, paciente) {
        return await this.putPaciente(id, paciente);
    }
    static async existePaciente(cedula) {
        return await this.existePacienteId(cedula);
    }
}
//# sourceMappingURL=Cl_sLaboratorio.js.map