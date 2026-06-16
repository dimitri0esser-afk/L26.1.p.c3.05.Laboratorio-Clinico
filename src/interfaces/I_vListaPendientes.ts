export interface I_vListaPendientes {
    mostrarLista(items: {
    pacienteId: string;
    pacienteNombre: string;
    examenId: string;
    examenNombre: string;
    }[]): void;
    onSeleccionar(callback: (pacienteId: string, examenId: string) => void): void;
}