export default class Cl_sMockApi {
    static apiUrl = "https://6a1df21dbcc4f20d5ca53b9b.mockapi.io";
    // ============================================================
    //  MÉTODO BASE PARA PETICIONES
    // ============================================================
    static async fetchMockApi({ method = "GET", uri, body, headers = {}, }) {
        try {
            const options = {
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
            let data = null;
            try {
                data = await respuesta.json();
            }
            catch (_) {
                data = null;
            }
            return { ok: true, status, data };
        }
        catch (error) {
            return { ok: false, status: 0, message: error?.message };
        }
    }
    // ============================================================
    //  RECURSO: PACIENTES
    // ============================================================
    static async getPacientes() {
        const uri = `${this.apiUrl}/pacientes`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        return { ok: respuesta.ok, data: respuesta.data ?? [] };
    }
    static async postPaciente(paciente) {
        const uri = `${this.apiUrl}/pacientes`;
        const respuesta = await this.fetchMockApi({ method: "POST", uri, body: paciente });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al guardar" };
        return { ok: true, mensaje: "Paciente guardado" };
    }
    static async putPaciente(id, paciente) {
        const uri = `${this.apiUrl}/pacientes/${id}`;
        const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: paciente });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al actualizar" };
        return { ok: true, mensaje: "Paciente actualizado" };
    }
    static async deletePaciente(id) {
        const uri = `${this.apiUrl}/pacientes/${id}`;
        const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al eliminar" };
        return { ok: true, mensaje: "Paciente eliminado" };
    }
    static async existePacienteId(cedula) {
        const uri = `${this.apiUrl}/pacientes?cedula=${cedula}`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        if (respuesta.status === 404)
            return { ok: true, existe: false };
        if (!respuesta.ok)
            return { ok: false, existe: false };
        const data = respuesta.data;
        return { ok: true, existe: Array.isArray(data) && data.length > 0 };
    }
    // ============================================================
    //  RECURSO: RESULTADOS (Catálogo de exámenes)
    // ============================================================
    static async getResultados() {
        const uri = `${this.apiUrl}/resultados`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        return { ok: respuesta.ok, data: respuesta.data ?? [] };
    }
    static async postResultado(resultado) {
        const uri = `${this.apiUrl}/resultados`;
        const respuesta = await this.fetchMockApi({ method: "POST", uri, body: resultado });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al guardar" };
        return { ok: true, mensaje: "Resultado guardado" };
    }
    static async putResultado(id, resultado) {
        const uri = `${this.apiUrl}/resultados/${id}`;
        const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: resultado });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al actualizar" };
        return { ok: true, mensaje: "Resultado actualizado" };
    }
    static async deleteResultado(id) {
        const uri = `${this.apiUrl}/resultados/${id}`;
        const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al eliminar" };
        return { ok: true, mensaje: "Resultado eliminado" };
    }
}
//# sourceMappingURL=Cl_sMockApi.js.map