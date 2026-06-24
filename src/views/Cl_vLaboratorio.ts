import { I_vLaboratorio } from "../interfaces/I_vLaboratorio.js";

export default class Cl_vLaboratorio implements I_vLaboratorio {
  vista: HTMLElement | null;
  btNuevoPaciente: HTMLButtonElement | null;
  btAsignarEstudios: HTMLButtonElement | null;
  btVerResultados: HTMLButtonElement | null;
  btImprimir: HTMLButtonElement | null;
  tbPacientes: HTMLTableElement | null;
  lblCantidad: HTMLElement | null;
  divEstudios: HTMLElement | null;
  divCobranza: HTMLElement | null;
  divResultados: HTMLElement | null;

  private inputTipoExamen: HTMLInputElement | null;
  private inputFecha: HTMLInputElement | null;
  private btBuscar: HTMLButtonElement | null;
  private btLimpiarBusqueda: HTMLButtonElement | null;
  private lblResultadosBusqueda: HTMLElement | null;

  private onSeleccionarPacienteCallback: ((id: string) => void) | null = null;
  private onRegistrarPagoCallback: (() => void) | null = null;
  private onGuardarPacienteCallback: ((cedula: string, nombre: string) => void) | null = null;
  private onGuardarEstudiosCallback: ((estudios: any[]) => void) | null = null;
  private onBuscarResultadosCallback: ((tipoExamen: string, fecha: string) => void) | null = null;
  private onLimpiarBusquedaCallback: (() => void) | null = null;

  constructor() {
    this.vista = document.getElementById("laboratorio");
    this.btNuevoPaciente = document.getElementById("lab_btNuevoPaciente") as HTMLButtonElement | null;
    this.btAsignarEstudios = document.getElementById("lab_btAsignarEstudios") as HTMLButtonElement | null;
    this.btVerResultados = document.getElementById("lab_btVerResultados") as HTMLButtonElement | null;
    this.btImprimir = document.getElementById("lab_btImprimir") as HTMLButtonElement | null;
    this.tbPacientes = document.getElementById("lab_tbPacientes") as HTMLTableElement | null;
    this.lblCantidad = document.getElementById("lab_lblCantidad") as HTMLElement | null;
    this.divEstudios = document.getElementById("lab_divEstudios") as HTMLElement | null;
    this.divCobranza = document.getElementById("lab_divCobranza") as HTMLElement | null;
    this.divResultados = document.getElementById("lab_divResultados") as HTMLElement | null;
    this.inputTipoExamen = document.getElementById("lab_inputTipoExamen") as HTMLInputElement | null;
    this.inputFecha = document.getElementById("lab_inputFecha") as HTMLInputElement | null;
    this.btBuscar = document.getElementById("lab_btBuscar") as HTMLButtonElement | null;
    this.btLimpiarBusqueda = document.getElementById("lab_btLimpiarBusqueda") as HTMLButtonElement | null;
    this.lblResultadosBusqueda = document.getElementById("lab_lblResultadosBusqueda") as HTMLElement | null;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (this.tbPacientes) {
      this.tbPacientes.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
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

  // ============ EVENTOS ============
  onBuscarResultados(callback: (tipoExamen: string, fecha: string) => void): void {
    this.onBuscarResultadosCallback = callback;
  }
  onLimpiarBusqueda(callback: () => void): void {
    this.onLimpiarBusquedaCallback = callback;
  }
  limpiarFiltrosBusqueda(): void {
    if (this.inputTipoExamen) this.inputTipoExamen.value = "";
    if (this.inputFecha) this.inputFecha.value = "";
    if (this.lblResultadosBusqueda) this.lblResultadosBusqueda.textContent = "0 resultado(s) en total";
  }

  // ============ MODALES ============
  mostrarModalPaciente(): void {
    const modal = document.getElementById("modalPaciente");
    if (modal) modal.style.display = "block";
    const inputCedula = document.getElementById("modal_cedula") as HTMLInputElement;
    const inputNombre = document.getElementById("modal_nombre") as HTMLInputElement;
    if (inputCedula) inputCedula.value = "";
    if (inputNombre) inputNombre.value = "";
    const btnGuardar = document.getElementById("modal_btnGuardar");
    if (btnGuardar) {
      btnGuardar.onclick = () => {
        const cedulaInput = document.getElementById("modal_cedula") as HTMLInputElement;
        const nombreInput = document.getElementById("modal_nombre") as HTMLInputElement;
        if (cedulaInput?.value && nombreInput?.value) {
          if (this.onGuardarPacienteCallback) {
            this.onGuardarPacienteCallback(cedulaInput.value, nombreInput.value);
          }
          this.ocultarModalPaciente();
        } else {
          alert("Complete todos los campos (Cedula, Nombre)");
        }
      };
    }
  }
  ocultarModalPaciente(): void {
    const modal = document.getElementById("modalPaciente");
    if (modal) modal.style.display = "none";
  }

  mostrarModalEstudios(examenes: any[]): void {
    const modal = document.getElementById("modalEstudios");
    if (modal) modal.style.display = "block";
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
        const estudios: any[] = [];
        checkboxes.forEach((cb: any) => {
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
        } else {
          alert("Seleccione al menos un estudio");
        }
      };
    }
  }
  ocultarModalEstudios(): void {
    const modal = document.getElementById("modalEstudios");
    if (modal) modal.style.display = "none";
  }

  // ============ MOSTRAR DATOS ============
  get pacienteSeleccionadoId(): string | null { return null; }

  onNuevoPaciente(callback: () => void): void {
    if (this.btNuevoPaciente) this.btNuevoPaciente.onclick = callback;
  }
  onAsignarEstudios(callback: () => void): void {
    if (this.btAsignarEstudios) this.btAsignarEstudios.onclick = callback;
  }
  onVerResultados(callback: () => void): void {
    if (this.btVerResultados) this.btVerResultados.onclick = callback;
  }
  onImprimir(callback: () => void): void {
    if (this.btImprimir) this.btImprimir.onclick = callback;
  }
  onSeleccionarPaciente(callback: (id: string) => void): void {
    this.onSeleccionarPacienteCallback = callback;
  }
  onRegistrarPago(callback: () => void): void {
    this.onRegistrarPagoCallback = callback;
  }
  onGuardarPaciente(callback: (cedula: string, nombre: string) => void): void {
    this.onGuardarPacienteCallback = callback;
  }
  onGuardarEstudios(callback: (estudios: any[]) => void): void {
    this.onGuardarEstudiosCallback = callback;
  }

  mostrarPacientes(pacientes: any[], cantidad: number): void {
    if (!this.tbPacientes) return;
    this.tbPacientes.innerHTML = "";
    if (!pacientes || pacientes.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3">No hay pacientes registrados</td>`;
      this.tbPacientes.appendChild(tr);
    } else {
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

  mostrarEstudiosAsignados(estudios: any[]): void {
    const ul = document.getElementById("lab_ulEstudios");
    if (!ul) return;
    ul.innerHTML = "";
    if (!estudios || estudios.length === 0) {
      ul.innerHTML = "<li>No hay estudios asignados para este paciente</li>";
      return;
    }
    estudios.forEach((e) => {
      const li = document.createElement("li");
      li.textContent = `${e.id || e.examenId} - ${e.nombre || ''} - ${e.realizado ? 'Realizado' : 'Pendiente'}`;
      ul.appendChild(li);
    });
  }

  mostrarCobranza(monto: number, pagado: boolean): void {
    const spanMonto = document.getElementById("lab_spanMonto");
    const spanEstado = document.getElementById("lab_spanEstado");
    const btnPago = document.getElementById("btnRegistrarPago");
    if (spanMonto) spanMonto.textContent = monto.toString();
    if (spanEstado) spanEstado.textContent = pagado ? 'Pagado' : 'Pendiente';
    if (btnPago) {
      btnPago.style.display = pagado ? 'none' : 'block';
      btnPago.onclick = () => {
        if (this.onRegistrarPagoCallback) this.onRegistrarPagoCallback();
      };
    }
  }

  mostrarResultados(resultados: any[], totalSinFiltro: number): void {
    const tbody = document.getElementById("lab_tbodyResultados");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!resultados || resultados.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5">No hay resultados que coincidan con la busqueda</td>`;
      tbody.appendChild(tr);
    } else {
      resultados.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${r.pacienteId}</td>
          <td>${r.pacienteNombre || 'N/A'}</td>
          <td>${r.examenNombre || r.examenId}</td>
          <td>${r.valor}</td>
          <td>${new Date(r.fecha).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
      });
    }
    if (this.lblResultadosBusqueda) {
      const cantidad = resultados?.length || 0;
      if (cantidad === totalSinFiltro) {
        this.lblResultadosBusqueda.textContent = `${totalSinFiltro} resultado(s) en total`;
      } else {
        this.lblResultadosBusqueda.textContent = `Mostrando ${cantidad} de ${totalSinFiltro} resultado(s)`;
      }
    }
  }

  imprimirReporte(resultados: any[]): void {
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(`
        <html><head><title>Reporte Laboratorio Clinico</title>
        <style>body{font-family:Arial,sans-serif;margin:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#4CAF50;color:white;}</style>
        </head><body>
        <h1>Laboratorio Clinico - Reporte de Resultados</h1>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <table border="1">
          <thead><tr><th>Paciente</th>
          <th>Nombre</th>
          <th>Examen</th>
          <th>Resultado</th>
          <th>Fecha</th>
          </tr></thead>
          <tbody>${resultados.map(r => `<tr><td>${r.pacienteId}</td><td>${r.pacienteNombre || 'N/A'}</td><td>${r.examenNombre || r.examenId}</td><td>${r.valor}</td><td>${new Date(r.fecha).toLocaleDateString()}</td></tr>`).join('')}</tbody>
        </table>
        </body></html>
      `);
      ventana.print();
    }
  }

  mostrar(): void { if (this.vista) this.vista.hidden = false; }
  ocultar(): void { if (this.vista) this.vista.hidden = true; }

  limpiarSeleccion(): void {
    const ul = document.getElementById("lab_ulEstudios");
    if (ul) ul.innerHTML = "";
    const spanMonto = document.getElementById("lab_spanMonto");
    const spanEstado = document.getElementById("lab_spanEstado");
    const btnPago = document.getElementById("btnRegistrarPago");
    if (spanMonto) spanMonto.textContent = "0";
    if (spanEstado) spanEstado.textContent = "Pendiente";
    if (btnPago) btnPago.style.display = "none";
  }
}