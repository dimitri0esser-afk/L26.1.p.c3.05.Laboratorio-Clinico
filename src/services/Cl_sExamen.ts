import Cl_sMockApi from "./Cl_sMockApi.js";

export default class Cl_sExamen extends Cl_sMockApi {

  static async obtenerPacientes(): Promise<{ ok: boolean; data: any[] }> {
    return await this.getPacientes();
  }

  static async existePaciente(cedula: string): Promise<{ ok: boolean; existe: boolean }> {
    return await this.existePacienteId(cedula);
  }

  static async actualizarPaciente(id: string, paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    return await this.putPaciente(id, paciente);
  }

  static async obtenerExamenesPendientes(): Promise<{ ok: boolean; data: any[] }> {
    const resultado = await this.getPacientes();
    if (!resultado.ok) return { ok: false, data: [] };

    const pendientes: any[] = [];

    for (const paciente of resultado.data) {
      const examenesPendientes = (paciente.examenes || []).filter((e: any) => !e.realizado);
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