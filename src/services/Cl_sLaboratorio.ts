import Cl_sMockApi from "./Cl_sMockApi.js";

export default class Cl_sLaboratorio extends Cl_sMockApi {
  static async obtenerPacientes(): Promise<{ ok: boolean; data: any[] }> {
    return await this.getPacientes();
  }

  static async guardarPaciente(paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    return await this.postPaciente(paciente);
  }

  static async actualizarPaciente(id: string, paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    return await this.putPaciente(id, paciente);
  }

  static async existePaciente(cedula: string): Promise<{ ok: boolean; existe: boolean }> {
    return await this.existePacienteId(cedula);
  }
}