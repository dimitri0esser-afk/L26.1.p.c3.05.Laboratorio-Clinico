import { I_vListaPendientes } from "../interfaces/I_vListaPendientes.js";

export default class Cl_vListaPendientes implements I_vListaPendientes {
    private contenedor: HTMLElement | null;
    private callbackSeleccionar: ((pacienteId: string, examenId: string) => void) | null = null;

    constructor() {
    this.contenedor = document.getElementById("listaPendientes_contenido");
    }

    mostrarLista(items: {
    pacienteId: string;
    pacienteNombre: string;
    examenId: string;
    examenNombre: string;
    }[]): void {
    if (!this.contenedor) return;

    if (items.length === 0) {
    this.contenedor.innerHTML = `<p style="color:#888; text-align:center; padding:20px;">✓ No hay exámenes pendientes.</p>`;
    return;
    }

    const filas = items.map(item => `
    <tr>
        <td>${item.pacienteNombre}</td>
        <td>${item.pacienteId}</td>
        <td>${item.examenNombre}</td>
        <td>
        <button class="btn-registrar"
            data-paciente="${item.pacienteId}"
            data-examen="${item.examenId}">
            Registrar
        </button>
        </td>
    </tr>
    `).join("");

    this.contenedor.innerHTML = `
    <table class="tabla-pendientes">
        <thead>
        <tr>
            <th>Paciente</th>
            <th>Cédula</th>
            <th>Examen</th>
            <th>Acción</th>
        </tr>
        </thead>
        <tbody>${filas}</tbody>
    </table>
    `;

   
    this.contenedor.querySelectorAll(".btn-registrar").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const el = e.currentTarget as HTMLElement;
        const pacienteId = el.dataset.paciente || "";
        const examenId   = el.dataset.examen   || "";
        if (this.callbackSeleccionar) this.callbackSeleccionar(pacienteId, examenId);
    });
    });
    }

    onSeleccionar(callback: (pacienteId: string, examenId: string) => void): void {
    this.callbackSeleccionar = callback;
    }
}