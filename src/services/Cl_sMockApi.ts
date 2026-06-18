export default class Cl_sMockApi {
  protected static apiUrl: string = "https://6a1df21dbcc4f20d5ca53b9b.mockapi.io";

  // ============================================================
  //  MÉTODO BASE PARA PETICIONES
  // ============================================================
  protected static async fetchMockApi({
    method = "GET",
    uri,
    body,
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    uri: string;
    body?: any;
    headers?: Record<string, string>;
  }): Promise<{ ok: boolean; status: number; data?: any; message?: string }> {
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
      };

      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }

      const respuesta = await fetch(uri, options);
      const status = respuesta.status;

      if (status === 404) {
        return { ok: true, status, data: [] };
      }

      if (!respuesta.ok) {
        return { ok: false, status, data: [] };
      }

      let data: any = null;
      try {
        data = await respuesta.json();
      } catch (_) {
        data = null;
      }

      return { ok: true, status, data };
    } catch (error: any) {
      return { ok: false, status: 0, message: error?.message };
    }
  }

  // ============================================================
  //  RECURSO: PACIENTES
  // ============================================================
  static async getPacientes(): Promise<{ ok: boolean; data: any[] }> {
    const uri = `${this.apiUrl}/pacientes`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    return { ok: respuesta.ok, data: respuesta.data ?? [] };
  }

  static async postPaciente(paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/pacientes`;
    const respuesta = await this.fetchMockApi({ method: "POST", uri, body: paciente });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al guardar" };
    return { ok: true, mensaje: "Paciente guardado" };
  }

  static async putPaciente(id: string, paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/pacientes/${id}`;
    const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: paciente });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al actualizar" };
    return { ok: true, mensaje: "Paciente actualizado" };
  }

  static async deletePaciente(id: string): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/pacientes/${id}`;
    const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al eliminar" };
    return { ok: true, mensaje: "Paciente eliminado" };
  }

  static async existePacienteId(cedula: string): Promise<{ ok: boolean; existe: boolean }> {
    const uri = `${this.apiUrl}/pacientes?cedula=${cedula}`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    if (respuesta.status === 404) return { ok: true, existe: false };
    if (!respuesta.ok) return { ok: false, existe: false };
    const data = respuesta.data;
    return { ok: true, existe: Array.isArray(data) && data.length > 0 };
  }

  // ============================================================
  //  RECURSO: RESULTADOS (Catálogo de exámenes)
  // ============================================================
  static async getResultados(): Promise<{ ok: boolean; data: any[] }> {
    const uri = `${this.apiUrl}/resultados`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    return { ok: respuesta.ok, data: respuesta.data ?? [] };
  }

  static async postResultado(resultado: any): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/resultados`;
    const respuesta = await this.fetchMockApi({ method: "POST", uri, body: resultado });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al guardar" };
    return { ok: true, mensaje: "Resultado guardado" };
  }

  static async putResultado(id: string, resultado: any): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/resultados/${id}`;
    const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: resultado });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al actualizar" };
    return { ok: true, mensaje: "Resultado actualizado" };
  }

  static async deleteResultado(id: string): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}/resultados/${id}`;
    const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al eliminar" };
    return { ok: true, mensaje: "Resultado eliminado" };
  }
}