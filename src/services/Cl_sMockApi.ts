export default class Cl_sMockApi {
  private static apiUrl: string = "https://6a1df21dbcc4f20d5ca53b9b.mockapi.io";

  // ============ PACIENTES ============
  static async getPacientes(): Promise<{ ok: boolean; data: any[] }> {
    try {
      const respuesta = await fetch(`${this.apiUrl}/pacientes`);
      if (respuesta.status === 404) return { ok: true, data: [] };
      if (!respuesta.ok) return { ok: false, data: [] };
      const data = await respuesta.json();
      return { ok: true, data };
    } catch {
      return { ok: false, data: [] };
    }
  }

  static async postPaciente(paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const respuesta = await fetch(`${this.apiUrl}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      if (!respuesta.ok) return { ok: false, mensaje: "Error al guardar" };
      return { ok: true, mensaje: "Paciente guardado" };
    } catch {
      return { ok: false, mensaje: "Error de conexión" };
    }
  }

  static async putPaciente(id: string, paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const respuesta = await fetch(`${this.apiUrl}/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      if (!respuesta.ok) return { ok: false, mensaje: "Error al actualizar" };
      return { ok: true, mensaje: "Paciente actualizado" };
    } catch {
      return { ok: false, mensaje: "Error de conexión" };
    }
  }

  static async existePacienteId(cedula: string): Promise<{ ok: boolean; existe: boolean }> {
    try {
      const respuesta = await fetch(`${this.apiUrl}/pacientes?cedula=${cedula}`);
      if (respuesta.status === 404) return { ok: true, existe: false };
      if (!respuesta.ok) return { ok: false, existe: false };
      const data = await respuesta.json();
      return { ok: true, existe: data.length > 0 };
    } catch {
      return { ok: false, existe: false };
    }
  }

  // ============ CATÁLOGO DE EXÁMENES (recurso "resultados") ============
  static async getCatalogo(): Promise<{ ok: boolean; data: any[] }> {
    try {
      const respuesta = await fetch(`${this.apiUrl}/resultados`);
      if (respuesta.status === 404) return { ok: true, data: [] };
      if (!respuesta.ok) return { ok: false, data: [] };
      const data = await respuesta.json();
      return { ok: true, data };
    } catch {
      return { ok: false, data: [] };
    }
  }
}