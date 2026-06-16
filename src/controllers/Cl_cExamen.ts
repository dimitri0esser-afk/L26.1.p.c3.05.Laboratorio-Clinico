import { I_vExamen } from "../interfaces/I_vExamen.js";
import Cl_sExamen from "../services/Cl_sExamen.js";

export default class Cl_cExamen {
  private vista: I_vExamen;

  constructor(vista: I_vExamen) {
    this.vista = vista;
    this.vista.onEnviar(() => this.btEnviarOnClick());
  }

  async btEnviarOnClick() {
    const pacienteId = this.vista.pacienteId;
    const examenId = this.vista.examenId;
    const valor = this.vista.resultadoValor;

    if (!pacienteId) {
      alert("Debe ingresar la cédula del paciente");
      return;
    }

    if (!valor) {
      alert("Debe ingresar un resultado");
      return;
    }

    const chkExiste = await Cl_sExamen.existePaciente(pacienteId);
    if (chkExiste.ok === false) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }

    if (!chkExiste.existe) {
      alert("El paciente no existe. Primero regístrelo en Administración.");
      return;
    }

    const pacientes = await Cl_sExamen.obtenerPacientes();
    const paciente = pacientes.data.find((p: any) => p.cedula === pacienteId);
    
    if (!paciente) {
      alert("Error: No se encontró el paciente");
      return;
    }

    const examen = paciente.examenes?.find((e: any) => e.id === examenId);
    
    if (!examen) {
      alert("El examen no está asignado a este paciente");
      return;
    }

    examen.realizado = true;
    examen.valor = valor;
    examen.fecha = new Date().toISOString();

    const actualizado = await Cl_sExamen.actualizarPaciente(paciente.id, paciente);
    
    if (!actualizado.ok) {
      alert("Error al actualizar el examen del paciente");
      return;
    }

    alert("Resultado guardado exitosamente");

    if (actualizado.ok) {
      this.vista.limpiar();
      this.vista.ocultar();
      window.dispatchEvent(new CustomEvent("examen:guardado")); 
    }
  }
}