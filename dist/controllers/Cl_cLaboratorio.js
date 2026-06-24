import Cl_sLaboratorio from "../services/Cl_sLaboratorio.js";
import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";
import Cl_sMockApi from "../services/Cl_sMockApi.js";
export default class Cl_cLaboratorio {
    vista;
    pacientes = [];
    examenesDisponibles = [];
    resultados = [];
    pacienteSeleccionadoId = null;
    modelo;
    constructor(vista) {
        this.vista = vista;
        this.modelo = new Cl_mLaboratorio();
        this.examenesDisponibles = this.modelo.getExamenesDisponibles();
        if (this.examenesDisponibles.length === 0) {
            console.warn("Usando fallback para examenes (constructor)");
            this.examenesDisponibles = [
                { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
                { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
                { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
                { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
                { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
            ];
        }
        console.log("Examenes disponibles en constructor:", this.examenesDisponibles.length);
        this.vista.onNuevoPaciente(() => this.crearNuevoPaciente());
        this.vista.onAsignarEstudios(() => this.asignarEstudios());
        this.vista.onVerResultados(() => this.mostrarResultadosFinalizados());
        this.vista.onImprimir(() => this.imprimirReporte());
        this.vista.onSeleccionarPaciente((id) => this.seleccionarPaciente(id));
        this.vista.onRegistrarPago(() => this.registrarPago());
        this.vista.onGuardarPaciente((cedula, nombre) => this.guardarNuevoPaciente(cedula, nombre));
        this.vista.onGuardarEstudios((estudios) => this.guardarEstudios(estudios));
        this.vista.onBuscarResultados((tipoExamen, fecha) => this.buscarResultados(tipoExamen, fecha));
        this.vista.onLimpiarBusqueda(() => this.limpiarBusqueda());
        this.cargarDatos();
    }
    extraerResultadosDesdePacientes() {
        const todosResultados = [];
        this.pacientes.forEach(paciente => {
            if (paciente.examenes && paciente.examenes.length > 0) {
                paciente.examenes.forEach((examen) => {
                    if (examen.realizado && examen.valor) {
                        todosResultados.push({
                            pacienteId: paciente.cedula,
                            pacienteNombre: paciente.nombre,
                            examenId: examen.id,
                            examenNombre: examen.nombre,
                            valor: examen.valor,
                            fecha: examen.fecha || new Date(),
                            finalizado: true
                        });
                    }
                });
            }
        });
        return todosResultados;
    }
    async cargarDatos() {
        const resultadoPacientes = await Cl_sLaboratorio.obtenerPacientes();
        this.pacientes = resultadoPacientes.ok ? resultadoPacientes.data : [];
        this.resultados = this.extraerResultadosDesdePacientes();
        this.refrescarVista();
    }
    refrescarVista() {
        this.vista.mostrarPacientes(this.pacientes, this.pacientes.length);
        if (this.pacienteSeleccionadoId) {
            this.mostrarDetallesPaciente(this.pacienteSeleccionadoId);
        }
        else {
            this.vista.limpiarSeleccion();
        }
    }
    async seleccionarPaciente(id) {
        this.pacienteSeleccionadoId = id;
        this.mostrarDetallesPaciente(id);
    }
    mostrarDetallesPaciente(id) {
        const paciente = this.pacientes.find(p => p.id === id);
        if (!paciente)
            return;
        const estudios = paciente.examenes || [];
        this.vista.mostrarEstudiosAsignados(estudios);
        let monto = 0;
        estudios.forEach((e) => {
            if (!e.pagado)
                monto += e.costo || 0;
        });
        this.vista.mostrarCobranza(monto, monto === 0);
    }
    crearNuevoPaciente() {
        this.vista.mostrarModalPaciente();
    }
    async guardarNuevoPaciente(cedula, nombre) {
        if (!cedula || !nombre) {
            alert("Complete todos los campos (Cedula, Nombre)");
            return;
        }
        const existe = await Cl_sLaboratorio.existePaciente(cedula);
        if (existe.existe) {
            alert("Ya existe un paciente con esa cedula.");
            return;
        }
        const nuevoPaciente = { cedula, nombre, examenes: [] };
        const respuesta = await Cl_sLaboratorio.guardarPaciente(nuevoPaciente);
        if (respuesta.ok) {
            alert(`Paciente ${nombre} registrado exitosamente`);
            await this.cargarDatos();
        }
        else {
            alert("Error al guardar el paciente");
        }
    }
    async asignarEstudios() {
        if (!this.pacienteSeleccionadoId) {
            alert("Primero seleccione un paciente de la tabla");
            return;
        }
        const resultado = await Cl_sMockApi.getResultados();
        let examenes = [];
        if (resultado.ok && resultado.data && resultado.data.length > 0) {
            examenes = resultado.data.map((ex) => ({
                id: ex.codigo || ex.id,
                nombre: ex.nombre,
                costo: ex.precio,
                valorReferencia: ex.valorReferencia || ""
            }));
            console.log(`Catalogo cargado: ${examenes.length} examenes`);
        }
        else {
            examenes = [
                { id: "HEMO01", nombre: "Hemoglobina", costo: 15 },
                { id: "GLUC02", nombre: "Glucosa", costo: 10 },
                { id: "COL03", nombre: "Colesterol", costo: 20 },
                { id: "UREA04", nombre: "Urea", costo: 12 },
                { id: "CREA05", nombre: "Creatinina", costo: 18 }
            ];
            console.warn("Usando fallback local");
        }
        this.vista.mostrarModalEstudios(examenes);
    }
    async guardarEstudios(estudiosAsignados) {
        const paciente = this.pacientes.find(p => p.id === this.pacienteSeleccionadoId);
        if (paciente) {
            paciente.examenes = [...(paciente.examenes || []), ...estudiosAsignados];
            const respuesta = await Cl_sLaboratorio.actualizarPaciente(paciente.id, paciente);
            if (respuesta.ok) {
                let total = 0;
                estudiosAsignados.forEach(e => total += e.costo);
                alert(`Estudios asignados. Total a pagar: Bs. ${total}`);
                await this.cargarDatos();
            }
            else {
                alert("Error al asignar estudios");
            }
        }
    }
    async registrarPago() {
        if (!this.pacienteSeleccionadoId)
            return;
        const paciente = this.pacientes.find(p => p.id === this.pacienteSeleccionadoId);
        if (!paciente)
            return;
        let totalPendiente = 0;
        paciente.examenes.forEach((e) => {
            if (!e.pagado)
                totalPendiente += e.costo;
        });
        if (totalPendiente === 0) {
            alert("No hay cobranza pendiente");
            return;
        }
        paciente.examenes.forEach((e) => { e.pagado = true; });
        const respuesta = await Cl_sLaboratorio.actualizarPaciente(paciente.id, paciente);
        if (respuesta.ok) {
            alert(`Pago de Bs. ${totalPendiente} registrado`);
            await this.cargarDatos();
        }
        else {
            alert("Error al registrar pago");
        }
    }
    mostrarResultadosFinalizados() {
        this.vista.mostrarResultados(this.resultados, this.resultados.length);
    }
    imprimirReporte() {
        if (this.resultados.length === 0) {
            alert("No hay resultados para imprimir");
            return;
        }
        this.vista.imprimirReporte(this.resultados);
    }
    buscarResultados(tipoExamen, fecha) {
        let filtrados = [...this.resultados];
        const textoBusqueda = tipoExamen.trim().toLowerCase();
        if (textoBusqueda !== "") {
            filtrados = filtrados.filter((resultado) => {
                const nombreExamen = (resultado.examenNombre || resultado.examenId || "").toLowerCase();
                return nombreExamen.includes(textoBusqueda);
            });
        }
        if (fecha !== "") {
            filtrados = filtrados.filter((resultado) => {
                if (!resultado.fecha)
                    return false;
                const fechaResultado = new Date(resultado.fecha).toISOString().split("T")[0];
                return fechaResultado === fecha;
            });
        }
        this.vista.mostrarResultados(filtrados, this.resultados.length);
    }
    limpiarBusqueda() {
        this.vista.limpiarFiltrosBusqueda();
        this.vista.mostrarResultados(this.resultados, this.resultados.length);
    }
}
//# sourceMappingURL=Cl_cLaboratorio.js.map