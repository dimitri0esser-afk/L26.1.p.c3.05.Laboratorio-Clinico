const API_URL = "https://6a1df21dbcc4f20d5ca53b9b.mockapi.io";

export default class Cl_sUsuario {
  static async existePaciente(cedula: string): Promise<boolean> {
    try {
      const respuesta = await fetch(`${API_URL}/pacientes?cedula=${cedula}`);
      if (!respuesta.ok) return false;
      const data = await respuesta.json();
      return data.length > 0;
    } catch {
      return false;
    }
  }

  static async guardarPaciente(paciente: any): Promise<{ ok: boolean; mensaje: string; id?: string }> {
    try {
      const respuesta = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      if (!respuesta.ok) return { ok: false, mensaje: "Error al guardar paciente" };
      const data = await respuesta.json();
      return { ok: true, mensaje: "Paciente registrado exitosamente", id: data.id };
    } catch {
      return { ok: false, mensaje: "Error de conexión" };
    }
  }

  static async obtenerPacientePorCedula(cedula: string): Promise<any> {
    try {
      const respuesta = await fetch(`${API_URL}/pacientes?cedula=${cedula}`);
      if (!respuesta.ok) return null;
      const data = await respuesta.json();
      return data.length > 0 ? data[0] : null;
    } catch {
      return null;
    }
  }

  static async actualizarPaciente(id: string, paciente: any): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const respuesta = await fetch(`${API_URL}/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      if (!respuesta.ok) return { ok: false, mensaje: "Error al actualizar" };
      return { ok: true, mensaje: "Estudios asignados correctamente" };
    } catch {
      return { ok: false, mensaje: "Error de conexión" };
    }
  }

  static async guardarSolicitud(solicitud: any): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const respuesta = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solicitud),
      });
      if (!respuesta.ok) return { ok: false, mensaje: "Error al guardar solicitud" };
      return { ok: true, mensaje: "Solicitud enviada correctamente" };
    } catch {
      return { ok: false, mensaje: "Error de conexión" };
    }
  }
}