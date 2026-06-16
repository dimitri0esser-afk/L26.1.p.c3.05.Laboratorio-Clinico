import Cl_sMockApi from "./Cl_sMockApi.js";
export default class Cl_sExamen extends Cl_sMockApi {
    static async obtenerPacientes() {
        return await this.getPacientes();
    }
    static async existePaciente(cedula) {
        return await this.existePacienteId(cedula);
    }
    static async actualizarPaciente(id, paciente) {
        return await this.putPaciente(id, paciente);
    }
    static async obtenerExamenesPendientes() {
        const resultado = await this.getPacientes();
        if (!resultado.ok)
            return { ok: false, data: [] };
        const pendientes = [];
        for (const paciente of resultado.data) {
            const examenesPendientes = (paciente.examenes || []).filter((e) => !e.realizado);
            for (const examen of examenesPendientes) {
                pendientes.push({
                    pacienteId: paciente.cedula,
                    pacienteNombre: paciente.nombre,
                    examenId: examen.id,
                    examenNombre: examen.nombre,
                });
            }
        }
        return { ok: true, data: pendientes };
    }
}
//# sourceMappingURL=Cl_sExamen.js.map