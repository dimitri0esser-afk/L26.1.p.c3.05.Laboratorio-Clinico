import Cl_sMockApi from "../services/Cl_sMockApi.js";
export default class Cl_vUsuario {
    // Formularios
    divPaciente;
    divEstudios;
    divResumen;
    // Campos paciente
    inputCedula;
    inputNombre;
    inputEmail;
    // Botones
    btnGuardarDatos;
    btnGuardarEstudios;
    btnSaltarEstudios;
    // Callbacks
    onGuardarDatosCallback = null;
    onGuardarEstudiosCallback = null;
    onSaltarEstudiosCallback = null;
    // Exámenes disponibles (cargados desde mockapi)
    examenesDisponibles = [];
    constructor() {
        this.divPaciente = document.getElementById("formularioPaciente");
        this.divEstudios = document.getElementById("formularioEstudios");
        this.divResumen = document.getElementById("resumenDatos");
        this.inputCedula = document.getElementById("cedula");
        this.inputNombre = document.getElementById("nombre");
        this.inputEmail = document.getElementById("email");
        this.btnGuardarDatos = document.getElementById("btnGuardarDatos");
        this.btnGuardarEstudios = document.getElementById("btnGuardarEstudios");
        this.btnSaltarEstudios = document.getElementById("btnSaltarEstudios");
        this.setupEventListeners();
        // Cargar catálogo de exámenes desde mockapi
        this.cargarCatalogo();
    }
    setupEventListeners() {
        if (this.btnGuardarDatos) {
            this.btnGuardarDatos.onclick = () => {
                if (this.onGuardarDatosCallback)
                    this.onGuardarDatosCallback();
            };
        }
        if (this.btnGuardarEstudios) {
            this.btnGuardarEstudios.onclick = () => {
                if (this.onGuardarEstudiosCallback)
                    this.onGuardarEstudiosCallback();
            };
        }
        if (this.btnSaltarEstudios) {
            this.btnSaltarEstudios.onclick = () => {
                if (this.onSaltarEstudiosCallback)
                    this.onSaltarEstudiosCallback();
            };
        }
    }
    async cargarCatalogo() {
        try {
            // ✅ CAMBIADO: getCatalogo() → getResultados()
            const resultado = await Cl_sMockApi.getResultados();
            if (resultado.ok && resultado.data && resultado.data.length > 0) {
                this.examenesDisponibles = resultado.data.map((ex) => ({
                    id: ex.codigo || ex.id,
                    nombre: ex.nombre,
                    costo: ex.precio,
                    valorReferencia: ex.valorReferencia || ""
                }));
                console.log(`Usuario: ${this.examenesDisponibles.length} exámenes cargados`);
            }
            else {
                // Fallback por si no hay conexión o catálogo vacío
                this.examenesDisponibles = [
                    { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
                    { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
                    { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
                    { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
                    { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
                ];
                console.warn("Usuario: Usando catálogo por defecto");
            }
        }
        catch (error) {
            console.error("Error cargando catálogo:", error);
            this.examenesDisponibles = [
                { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
                { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
                { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
                { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
                { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
            ];
        }
        this.cargarListaExamenes();
    }
    cargarListaExamenes() {
        const container = document.getElementById("listaExamenes");
        if (!container)
            return;
        container.innerHTML = "";
        this.examenesDisponibles.forEach(examen => {
            const div = document.createElement("div");
            div.className = "examen-item";
            div.innerHTML = `
        <input type="checkbox" value="${examen.id}" data-costo="${examen.costo}" data-nombre="${examen.nombre}">
        <div class="examen-info">
          <div class="examen-nombre">${examen.nombre}</div>
          <div class="examen-costo">Bs. ${examen.costo}</div>
          ${examen.valorReferencia ? `<div class="examen-ref" style="color:#888; font-size:12px;">Referencia: ${examen.valorReferencia}</div>` : ""}
        </div>
      `;
            const checkbox = div.querySelector("input");
            if (checkbox) {
                checkbox.addEventListener("change", () => this.actualizarTotal());
            }
            container.appendChild(div);
        });
        this.actualizarTotal();
    }
    actualizarTotal() {
        const checkboxes = document.querySelectorAll("#listaExamenes input:checked");
        let total = 0;
        checkboxes.forEach((cb) => {
            total += parseInt(cb.dataset.costo || "0");
        });
        const totalSpan = document.getElementById("totalMonto");
        if (totalSpan)
            totalSpan.textContent = `Bs. ${total}`;
    }
    getDatosPaciente() {
        return {
            cedula: this.inputCedula?.value.trim() || "",
            nombre: this.inputNombre?.value.trim() || "",
            email: this.inputEmail?.value.trim() || ""
        };
    }
    getEstudiosSeleccionados() {
        const checkboxes = document.querySelectorAll("#listaExamenes input:checked");
        const estudios = [];
        checkboxes.forEach((cb) => {
            estudios.push({
                id: cb.value,
                nombre: cb.dataset.nombre,
                costo: parseInt(cb.dataset.costo)
            });
        });
        return estudios;
    }
    mostrarMensaje(mensaje, tipo) {
        const mensajeDiv = document.getElementById("mensaje");
        if (mensajeDiv) {
            mensajeDiv.textContent = mensaje;
            mensajeDiv.className = `mensaje ${tipo}`;
            mensajeDiv.style.display = "block";
            setTimeout(() => {
                mensajeDiv.style.display = "none";
            }, 3000);
        }
    }
    mostrarResumen(datos) {
        const divDatos = document.getElementById("datosGuardados");
        const divEstudios = document.getElementById("estudiosGuardados");
        const divTotal = document.getElementById("totalGuardado");
        if (divDatos && datos.paciente) {
            divDatos.innerHTML = `
        <p><strong>Nombre:</strong> ${datos.paciente.nombre}</p>
        <p><strong>Cédula:</strong> ${datos.paciente.cedula}</p>
        ${datos.paciente.email ? `<p><strong>Email:</strong> ${datos.paciente.email}</p>` : ""}
      `;
        }
        if (divEstudios && datos.examenes) {
            if (datos.examenes.length > 0) {
                let html = '<p><strong>Exámenes solicitados:</strong></p><ul>';
                datos.examenes.forEach((e) => {
                    html += `<li>${e.nombre} - Bs. ${e.costo}</li>`;
                });
                html += "</ul>";
                divEstudios.innerHTML = html;
            }
            else {
                divEstudios.innerHTML = "<p><em>No seleccionó exámenes aún</em></p>";
            }
        }
        if (divTotal && datos.total !== undefined) {
            divTotal.innerHTML = `<div class="total"><h3>Total</h3><div class="monto">Bs. ${datos.total}</div></div>`;
        }
    }
    limpiarFormulario() {
        if (this.inputCedula)
            this.inputCedula.value = "";
        if (this.inputNombre)
            this.inputNombre.value = "";
        if (this.inputEmail)
            this.inputEmail.value = "";
        const checkboxes = document.querySelectorAll("#listaExamenes input");
        checkboxes.forEach((cb) => {
            cb.checked = false;
        });
        this.actualizarTotal();
    }
    onGuardarDatos(callback) {
        this.onGuardarDatosCallback = callback;
    }
    onGuardarEstudios(callback) {
        this.onGuardarEstudiosCallback = callback;
    }
    onSaltarEstudios(callback) {
        this.onSaltarEstudiosCallback = callback;
    }
    mostrarFormularioPaciente() {
        if (this.divPaciente)
            this.divPaciente.style.display = "block";
        if (this.divEstudios)
            this.divEstudios.style.display = "none";
        if (this.divResumen)
            this.divResumen.style.display = "none";
    }
    mostrarFormularioEstudios() {
        if (this.divPaciente)
            this.divPaciente.style.display = "none";
        if (this.divEstudios)
            this.divEstudios.style.display = "block";
        if (this.divResumen)
            this.divResumen.style.display = "none";
    }
    mostrarResumenVista() {
        if (this.divPaciente)
            this.divPaciente.style.display = "none";
        if (this.divEstudios)
            this.divEstudios.style.display = "none";
        if (this.divResumen)
            this.divResumen.style.display = "block";
    }
}
//# sourceMappingURL=Cl_vUsuario.js.map