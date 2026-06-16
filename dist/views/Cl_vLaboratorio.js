export default class Cl_vLaboratorio {
    vista;
    btNuevoPaciente;
    btAsignarEstudios;
    btVerResultados;
    btImprimir;
    tbPacientes;
    lblCantidad;
    divEstudios;
    divCobranza;
    divResultados;
    inputTipoExamen;
    inputFecha;
    btBuscar;
    btLimpiarBusqueda;
    lblResultadosBusqueda;
    onSeleccionarPacienteCallback = null;
    onRegistrarPagoCallback = null;
    onGuardarPacienteCallback = null;
    onGuardarEstudiosCallback = null;
    onBuscarResultadosCallback = null;
    onLimpiarBusquedaCallback = null;
    onSeleccionarEstudioCallback = null;
    constructor() {
        this.vista = document.getElementById("laboratorio");
        this.btNuevoPaciente = document.getElementById("lab_btNuevoPaciente");
        this.btAsignarEstudios = document.getElementById("lab_btAsignarEstudios");
        this.btVerResultados = document.getElementById("lab_btVerResultados");
        this.btImprimir = document.getElementById("lab_btImprimir");
        this.tbPacientes = document.getElementById("lab_tbPacientes");
        this.lblCantidad = document.getElementById("lab_lblCantidad");
        this.divEstudios = document.getElementById("lab_divEstudios");
        this.divCobranza = document.getElementById("lab_divCobranza");
        this.divResultados = document.getElementById("lab_divResultados");
        this.inputTipoExamen = document.getElementById("lab_inputTipoExamen");
        this.inputFecha = document.getElementById("lab_inputFecha");
        this.btBuscar = document.getElementById("lab_btBuscar");
        this.btLimpiarBusqueda = document.getElementById("lab_btLimpiarBusqueda");
        this.lblResultadosBusqueda = document.getElementById("lab_lblResultadosBusqueda");
        this.setupEventListeners();
    }
    setupEventListeners() {
        if (this.tbPacientes) {
            this.tbPacientes.addEventListener("click", (e) => {
                const target = e.target;
                if (target.classList.contains("btnSeleccionarPaciente")) {
                    const id = target.getAttribute("data-id");
                    if (id && this.onSeleccionarPacienteCallback) {
                        this.onSeleccionarPacienteCallback(id);
                    }
                }
            });
        }
        const btnCancelarPaciente = document.getElementById("modal_btnCancelar");
        if (btnCancelarPaciente) {
            btnCancelarPaciente.onclick = () => this.ocultarModalPaciente();
        }
        const btnCancelarEstudios = document.getElementById("modal_estudios_btnCancelar");
        if (btnCancelarEstudios) {
            btnCancelarEstudios.onclick = () => this.ocultarModalEstudios();
        }
        if (this.btBuscar) {
            this.btBuscar.onclick = () => {
                const tipoExamen = this.inputTipoExamen?.value ?? "";
                const fecha = this.inputFecha?.value ?? "";
                if (this.onBuscarResultadosCallback) {
                    this.onBuscarResultadosCallback(tipoExamen, fecha);
                }
            };
        }
        if (this.btLimpiarBusqueda) {
            this.btLimpiarBusqueda.onclick = () => {
                if (this.onLimpiarBusquedaCallback) {
                    this.onLimpiarBusquedaCallback();
                }
            };
        }
        if (this.inputTipoExamen) {
            this.inputTipoExamen.addEventListener("input", () => {
                const tipoExamen = this.inputTipoExamen?.value ?? "";
                const fecha = this.inputFecha?.value ?? "";
                if (this.onBuscarResultadosCallback) {
                    this.onBuscarResultadosCallback(tipoExamen, fecha);
                }
            });
        }
    }
    onBuscarResultados(callback) {
        this.onBuscarResultadosCallback = callback;
    }
    onLimpiarBusqueda(callback) {
        this.onLimpiarBusquedaCallback = callback;
    }
    limpiarFiltrosBusqueda() {
        if (this.inputTipoExamen)
            this.inputTipoExamen.value = "";
        if (this.inputFecha)
            this.inputFecha.value = "";
        if (this.lblResultadosBusqueda)
            this.lblResultadosBusqueda.textContent = "";
    }
    actualizarContadorResultados(cantidad, total) {
        if (!this.lblResultadosBusqueda)
            return;
        if (cantidad === total) {
            this.lblResultadosBusqueda.textContent = `${total} resultado(s) en total`;
        }
        else {
            this.lblResultadosBusqueda.textContent = `Mostrando ${cantidad} de ${total} resultado(s)`;
        }
    }
    mostrarModalPaciente() {
        const modal = document.getElementById("modalPaciente");
        if (modal)
            modal.style.display = "block";
        const inputCedula = document.getElementById("modal_cedula");
        const inputNombre = document.getElementById("modal_nombre");
        if (inputCedula)
            inputCedula.value = "";
        if (inputNombre)
            inputNombre.value = "";
        const btnGuardar = document.getElementById("modal_btnGuardar");
        if (btnGuardar) {
            btnGuardar.onclick = () => {
                const cedulaInput = document.getElementById("modal_cedula");
                const nombreInput = document.getElementById("modal_nombre");
                if (cedulaInput?.value && nombreInput?.value) {
                    if (this.onGuardarPacienteCallback) {
                        this.onGuardarPacienteCallback(cedulaInput.value, nombreInput.value);
                    }
                    this.ocultarModalPaciente();
                }
                else {
                    alert("Complete todos los campos (Cédula, Nombre)");
                }
            };
        }
    }
    ocultarModalPaciente() {
        const modal = document.getElementById("modalPaciente");
        if (modal)
            modal.style.display = "none";
    }
    mostrarModalEstudios(examenes) {
        const modal = document.getElementById("modalEstudios");
        if (modal)
            modal.style.display = "block";
        const container = document.getElementById("modal_checkboxes");
        if (container) {
            container.innerHTML = "";
            examenes.forEach((examen) => {
                container.innerHTML += `
        <div style="margin: 8px 0;">
          <label>
            <input type="checkbox" value="${examen.id}" data-nombre="${examen.nombre}" data-costo="${examen.costo}">
            ${examen.nombre} - Bs.${examen.costo}
            ${examen.valorReferencia ? `<span style="color:#888; font-size:12px;"> (Ref: ${examen.valorReferencia})</span>` : ""}
          </label>
        </div>
      `;
            });
        }
        const btnGuardar = document.getElementById("modal_estudios_btnGuardar");
        if (btnGuardar) {
            btnGuardar.onclick = () => {
                const checkboxes = document.querySelectorAll("#modal_checkboxes input:checked");
                const estudios = [];
                checkboxes.forEach((cb) => {
                    estudios.push({
                        id: cb.value,
                        nombre: cb.getAttribute("data-nombre"),
                        costo: parseInt(cb.getAttribute("data-costo") || "0"),
                        pagado: false,
                        realizado: false
                    });
                });
                if (estudios.length > 0) {
                    if (this.onGuardarEstudiosCallback) {
                        this.onGuardarEstudiosCallback(estudios);
                    }
                    this.ocultarModalEstudios();
                }
                else {
                    alert("Seleccione al menos un estudio");
                }
            };
        }
    }
    ocultarModalEstudios() {
        const modal = document.getElementById("modalEstudios");
        if (modal)
            modal.style.display = "none";
    }
    get pacienteSeleccionadoId() {
        return null;
    }
    // ============================================================
    //  onSeleccionarEstudio() – REQUERIMIENTO AGREGADO
    //  Registra el callback que se ejecutará cuando el usuario
    //  cambie la selección del dropdown de estudios en las
    //  estadísticas. El callback recibe el nombre del estudio.
    // ============================================================
    onSeleccionarEstudio(callback) {
        this.onSeleccionarEstudioCallback = callback;
    }
    // ============================================================
    //  mostrarEstadisticas()
    //  REQUERIMIENTO AGREGADO - Visualiza 3 indicadores en el panel
    //  #lab_divEstadisticasContent del HTML:
    //
    //  1) Solicitudes e Ingreso por Estudio
    //     → Tabla con nombre, cantidad de solicitudes e ingreso total
    //       (ingreso = suma de costos de exámenes pagados)
    //
    //  2) Porcentaje de Exámenes Finalizados
    //     → Muestra qué % del total de exámenes tiene realizado=true
    //
    //  3) Promedio del Estudio SELECCIONADO por el usuario
    //     → Dropdown (<select>) para elegir qué estudio promediar
    //     → Muestra el promedio del estudio seleccionado
    //
    //  Parámetro: estadisticas - objeto con propiedades calculadas
    //    en Cl_cLaboratorio.calcularYMostrarEstadisticas()
    // ============================================================
    mostrarEstadisticas(estadisticas) {
        const container = document.getElementById("lab_divEstadisticasContent");
        if (!container)
            return;
        let html = "";
        // 1. Solicitudes e ingreso total por estudio
        html += `<h4 style="margin-bottom:8px;">Solicitudes e Ingreso por Estudio</h4>`;
        html += `<table border="1" style="width:100%; border-collapse:collapse; margin-bottom:15px; font-size:14px;">
      <thead><tr><th>Estudio</th><th>Solicitudes</th><th>Ingreso Total</th></tr></thead>
      <tbody>`;
        estadisticas.solicitudesPorEstudio.forEach(e => {
            html += `<tr><td>${e.nombre}</td><td>${e.solicitudes}</td><td>Bs. ${e.ingresoTotal.toFixed(2)}</td></tr>`;
        });
        html += `</tbody></table>`;
        // 2. Porcentaje de exámenes finalizados
        html += `<h4 style="margin-bottom:8px;">Porcentaje de Exámenes Finalizados</h4>`;
        html += `<p><strong>${estadisticas.porcentajeFinalizados.toFixed(1)}%</strong> de los exámenes están en estado "Finalizado"</p>`;
        // 3. Promedio del estudio SELECCIONADO por el usuario
        html += `<h4 style="margin-bottom:8px;">Promedio de un Estudio</h4>`;
        html += `<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:8px;">`;
        html += `<label for="selEstudioPromedio"><strong>Seleccione un estudio:</strong></label>`;
        html += `<select id="selEstudioPromedio" style="padding:6px 10px; border:1px solid #bdc3c7; border-radius:6px; font-size:14px;">`;
        html += `<option value="">-- Seleccione --</option>`;
        estadisticas.nombresEstudios.forEach(nombre => {
            const selected = nombre === estadisticas.estudioSeleccionado ? " selected" : "";
            html += `<option value="${nombre}"${selected}>${nombre}</option>`;
        });
        html += `</select></div>`;
        if (estadisticas.promedioEstudioSeleccionado !== null) {
            html += `<p><strong>${estadisticas.estudioSeleccionado}:</strong> Promedio = <strong>${estadisticas.promedioEstudioSeleccionado.toFixed(2)}</strong></p>`;
        }
        else if (estadisticas.estudioSeleccionado) {
            html += `<p style="color:#e67e22;">⚠ El estudio "${estadisticas.estudioSeleccionado}" no tiene valores numéricos registrados para calcular promedio.</p>`;
        }
        else {
            html += `<p style="color:#888;">Seleccione un estudio del menú desplegable para ver su promedio.</p>`;
        }
        container.innerHTML = html;
        // Vincular el evento change del <select> al callback
        const selEstudio = document.getElementById("selEstudioPromedio");
        if (selEstudio && this.onSeleccionarEstudioCallback) {
            selEstudio.onchange = () => {
                if (this.onSeleccionarEstudioCallback) {
                    this.onSeleccionarEstudioCallback(selEstudio.value);
                }
            };
        }
    }
    onNuevoPaciente(callback) {
        if (this.btNuevoPaciente)
            this.btNuevoPaciente.onclick = callback;
    }
    onAsignarEstudios(callback) {
        if (this.btAsignarEstudios)
            this.btAsignarEstudios.onclick = callback;
    }
    onVerResultados(callback) {
        if (this.btVerResultados)
            this.btVerResultados.onclick = callback;
    }
    onImprimir(callback) {
        if (this.btImprimir)
            this.btImprimir.onclick = callback;
    }
    onSeleccionarPaciente(callback) {
        this.onSeleccionarPacienteCallback = callback;
    }
    onRegistrarPago(callback) {
        this.onRegistrarPagoCallback = callback;
    }
    onGuardarPaciente(callback) {
        this.onGuardarPacienteCallback = callback;
    }
    onGuardarEstudios(callback) {
        this.onGuardarEstudiosCallback = callback;
    }
    mostrarPacientes(pacientes, cantidad) {
        if (!this.tbPacientes)
            return;
        this.tbPacientes.innerHTML = "";
        if (!pacientes || pacientes.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="3">No hay pacientes registrados</td>`;
            this.tbPacientes.appendChild(tr);
        }
        else {
            pacientes.forEach((paciente) => {
                const cedula = paciente.cedula || paciente.id;
                const nombre = paciente.nombre || paciente._nombre;
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${cedula || ""}</td>
          <td>${nombre || ""}</td>
          <td><button class="btnSeleccionarPaciente" data-id="${paciente.id}">Seleccionar</button></td>
        `;
                this.tbPacientes?.appendChild(tr);
            });
        }
        if (this.lblCantidad) {
            this.lblCantidad.innerHTML = cantidad.toString();
        }
    }
    mostrarEstudiosAsignados(estudios) {
        if (!this.divEstudios)
            return;
        if (!estudios || estudios.length === 0) {
            this.divEstudios.innerHTML = "<p>No hay estudios asignados para este paciente</p>";
            return;
        }
        let htmlContent = "<h3>Estudios Asignados</h3><ul>";
        estudios.forEach((e) => {
            htmlContent += `<li>${e.id || e.examenId} - ${e.nombre || ''} - ${e.realizado ? 'Realizado' : 'Pendiente'}</li>`;
        });
        htmlContent += "</ul>";
        this.divEstudios.innerHTML = htmlContent;
    }
    mostrarCobranza(monto, pagado) {
        if (!this.divCobranza)
            return;
        this.divCobranza.innerHTML = `
      <h3>Cobranza</h3>
      <p>Monto total: Bs. ${monto}</p>
      <p>Estado: ${pagado ? 'Pagado' : 'Pendiente'}</p>
      ${!pagado ? '<button id="btnRegistrarPago">Registrar Pago</button>' : ''}
    `;
        const btnPago = document.getElementById("btnRegistrarPago");
        if (btnPago && this.onRegistrarPagoCallback) {
            btnPago.onclick = () => this.onRegistrarPagoCallback();
        }
    }
    mostrarResultados(resultados, totalSinFiltro) {
        if (!this.divResultados)
            return;
        if (!resultados || resultados.length === 0) {
            this.divResultados.innerHTML = "<p>No hay resultados que coincidan con la búsqueda</p>";
            if (totalSinFiltro !== undefined) {
                this.actualizarContadorResultados(0, totalSinFiltro);
            }
            return;
        }
        let htmlContent = `
      <h3>Resultados Finalizados</h3>
      <table border='1'>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Examen</th>
            <th>Resultado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
    `;
        resultados.forEach((r) => {
            htmlContent += `
        <tr>
          <td>${r.pacienteId}</td>
          <td>${r.pacienteNombre || 'N/A'}</td>
          <td>${r.examenNombre || r.examenId}</td>
          <td>${r.valor}</td>
          <td>${new Date(r.fecha).toLocaleDateString()}</td>
        </tr>
      `;
        });
        htmlContent += "</tbody></table>";
        this.divResultados.innerHTML = htmlContent;
        if (totalSinFiltro !== undefined) {
            this.actualizarContadorResultados(resultados.length, totalSinFiltro);
        }
    }
    imprimirReporte(resultados) {
        const ventana = window.open('', '_blank');
        if (ventana) {
            ventana.document.write(`
        <html>
        <head>
          <title>Reporte Laboratorio Clinico</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h1>Laboratorio Clinico - Reporte de Resultados</h1>
          <p>Fecha: ${new Date().toLocaleString()}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Nombre</th>
                <th>Examen</th>
                <th>Resultado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${resultados.map(r => `
                <tr>
                  <td>${r.pacienteId}</td>
                  <td>${r.pacienteNombre || 'N/A'}</td>
                  <td>${r.examenNombre || r.examenId}</td>
                  <td>${r.valor}</td>
                  <td>${new Date(r.fecha).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `);
            ventana.print();
        }
    }
    mostrar() {
        if (this.vista)
            this.vista.hidden = false;
    }
    ocultar() {
        if (this.vista)
            this.vista.hidden = true;
    }
    limpiarSeleccion() {
        if (this.divEstudios)
            this.divEstudios.innerHTML = "";
        if (this.divCobranza)
            this.divCobranza.innerHTML = "";
    }
}
//# sourceMappingURL=Cl_vLaboratorio.js.map