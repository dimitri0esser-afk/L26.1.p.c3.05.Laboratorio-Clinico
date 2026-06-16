import Cl_sUsuario from "../services/Cl_sUsuario.js";
export default class Cl_cUsuario {
    vista;
    datosPaciente = null;
    estudiosSeleccionados = [];
    constructor(vista) {
        this.vista = vista;
        this.vista.onGuardarDatos(() => this.guardarDatosPaciente());
        this.vista.onGuardarEstudios(() => this.guardarEstudios());
        this.vista.onSaltarEstudios(() => this.saltarEstudios());
        this.vista.mostrarFormularioPaciente();
    }
    async guardarDatosPaciente() {
        const datos = this.vista.getDatosPaciente();
        if (!datos.cedula || !datos.nombre) {
            this.vista.mostrarMensaje("Complete todos los campos obligatorios", "error");
            return;
        }
        const existe = await Cl_sUsuario.existePaciente(datos.cedula);
        if (existe) {
            const pacienteExistente = await Cl_sUsuario.obtenerPacientePorCedula(datos.cedula);
            this.datosPaciente = pacienteExistente;
            this.vista.mostrarMensaje("Bienvenido de nuevo. Sus datos ya estaban registrados.", "success");
        }
        else {
            const nuevoPaciente = {
                cedula: datos.cedula,
                nombre: datos.nombre,
                email: datos.email || "",
                examenes: [],
                fechaRegistro: new Date().toISOString()
            };
            const respuesta = await Cl_sUsuario.guardarPaciente(nuevoPaciente);
            if (respuesta.ok) {
                this.datosPaciente = { ...nuevoPaciente, id: respuesta.id };
                this.vista.mostrarMensaje(`${respuesta.mensaje}`, "success");
            }
            else {
                this.vista.mostrarMensaje(`${respuesta.mensaje}`, "error");
                return;
            }
        }
        this.vista.mostrarFormularioEstudios();
    }
    async guardarEstudios() {
        this.estudiosSeleccionados = this.vista.getEstudiosSeleccionados();
        if (this.estudiosSeleccionados.length === 0) {
            this.vista.mostrarMensaje("Seleccione al menos un examen", "error");
            return;
        }
        if (!this.datosPaciente) {
            this.vista.mostrarMensaje("Error: No hay datos del paciente", "error");
            return;
        }
        const estudiosConEstado = this.estudiosSeleccionados.map(e => ({
            ...e,
            pagado: false,
            realizado: false,
            fechaAsignacion: new Date().toISOString()
        }));
        const pacienteActualizado = {
            ...this.datosPaciente,
            examenes: [...(this.datosPaciente.examenes || []), ...estudiosConEstado]
        };
        const respuesta = await Cl_sUsuario.actualizarPaciente(this.datosPaciente.id, pacienteActualizado);
        if (respuesta.ok) {
            const total = this.estudiosSeleccionados.reduce((sum, e) => sum + e.costo, 0);
            const solicitud = {
                paciente: this.datosPaciente,
                examenes: this.estudiosSeleccionados,
                total: total,
                fecha: new Date().toISOString(),
                estado: "pendiente"
            };
            await Cl_sUsuario.guardarSolicitud(solicitud);
            this.vista.mostrarResumen(solicitud);
            this.vista.mostrarResumenVista();
            this.vista.mostrarMensaje(`Estudios asignados. Total: Bs. ${total}`, "success");
        }
        else {
            this.vista.mostrarMensaje(`${respuesta.mensaje}`, "error");
        }
    }
    async saltarEstudios() {
        if (!this.datosPaciente) {
            this.vista.mostrarMensaje("Error: No hay datos del paciente", "error");
            return;
        }
        const solicitud = {
            paciente: this.datosPaciente,
            examenes: [],
            total: 0,
            fecha: new Date().toISOString(),
            estado: "pendiente"
        };
        this.vista.mostrarResumen(solicitud);
        this.vista.mostrarResumenVista();
        this.vista.mostrarMensaje("Sus datos han sido registrados. Puede agregar estudios después desde el laboratorio.", "success");
    }
}
//# sourceMappingURL=Cl_cUsuario.js.map