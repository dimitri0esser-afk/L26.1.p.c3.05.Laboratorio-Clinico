import Cl_sMockApi from "../services/Cl_sMockApi.js";

// ============================================================
//  Interfaz que define la estructura de las estadísticas
//  que devuelve el modelo. Se usa tanto en el modelo como
//  en el controlador y la vista.
// ============================================================
export interface IEstadisticas {
  solicitudesPorEstudio: { nombre: string; solicitudes: number; ingresoTotal: number }[];
  porcentajeFinalizados: number;
  nombresEstudios: string[];
  promedioEstudioSeleccionado: number | null;
  estudioSeleccionado: string;
}

export default class Cl_mLaboratorio {
  public examenesDisponibles: any[] = [];
  private cargando: boolean = false;

  constructor() {
    this.cargarCatalogo();
  }

  private async cargarCatalogo() {
    if (this.cargando) return;
    this.cargando = true;
    
    // ✅ CAMBIADO: getCatalogo() → getResultados()
    const resultado = await Cl_sMockApi.getResultados();
    
    if (resultado.ok && resultado.data && resultado.data.length > 0) {
      // Convertir el catálogo al formato que usa la app
      this.examenesDisponibles = resultado.data.map((ex: any) => ({
        id: ex.codigo || ex.id,
        nombre: ex.nombre,
        costo: ex.precio,
        valorReferencia: ex.valorReferencia || ""
      }));
      console.log(`Catálogo cargado: ${this.examenesDisponibles.length} exámenes`);
    } else {
      // Fallback: datos por defecto en caso de error de conexión
      console.warn("Usando catálogo por defecto (sin conexión a mockapi)");
      this.examenesDisponibles = [
        { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
        { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
        { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
        { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
        { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
      ];
    }
    
    this.cargando = false;
  }

  getExamenesDisponibles(): any[] {
    return this.examenesDisponibles;
  }

  // Método para recargar el catálogo manualmente (si es necesario)
  async recargarCatalogo(): Promise<void> {
    await this.cargarCatalogo();
  }

  // ============================================================
  //  calcularEstadisticas(pacientes) — REQUERIMIENTO AGREGADO
  //
  //  Calcula los 3 indicadores a partir del arreglo de pacientes:
  //
  //  1) Solicitudes e Ingreso Total por Estudio
  //     - Cuenta cuántas veces fue solicitado cada tipo de examen
  //     - Suma el costo de los que ya están pagados como ingreso
  //
  //  2) Porcentaje de Exámenes Finalizados
  //     - Cuenta total de exámenes y cuántos tienen realizado=true
  //     - Fórmula: (finalizados / total) * 100
  //
  //  3) Promedio de un Estudio Seleccionado
  //     - Agrupa valores numéricos de resultados por tipo de examen
  //     - Busca el estudio por nombre y calcula:
  //       promedio = sumaValores / cantidadValores
  //
  //  Parámetros:
  //    pacientes  – Arreglo de pacientes (cada uno con .examenes[])
  //    nombreEstudio – (opcional) Nombre del estudio para calcular
  //                    su promedio. Si se omite, se deja vacío.
  //
  //  Retorna: IEstadisticas listo para enviar a la vista.
  // ============================================================
  calcularEstadisticas(pacientes: any[], nombreEstudio?: string): IEstadisticas {
    // --- PASO 1: Agrupar todos los exámenes en un diccionario ---
    // conteoEstudios = { key: { nombre, solicitudes, ingresoTotal, valores[] } }
    const conteoEstudios: { [key: string]: { nombre: string; solicitudes: number; ingresoTotal: number; valores: number[] } } = {};
    
    pacientes.forEach(paciente => {
      if (paciente.examenes) {
        paciente.examenes.forEach((examen: any) => {
          const key = examen.id || examen.nombre;   // Identificador único del examen
          if (!conteoEstudios[key]) {
            conteoEstudios[key] = { nombre: examen.nombre || key, solicitudes: 0, ingresoTotal: 0, valores: [] };
          }
          conteoEstudios[key].solicitudes++;                       // +1 solicitud
          if (examen.pagado) {
            conteoEstudios[key].ingresoTotal += examen.costo || 0;  // Suma al ingreso si está pagado
          }
          // Si el examen está realizado y tiene un valor numérico válido, lo guardamos para el promedio
          if (examen.realizado && examen.valor && !isNaN(parseFloat(examen.valor))) {
            conteoEstudios[key].valores.push(parseFloat(examen.valor));
          }
        });
      }
    });

    // --- PASO 2: Convertir diccionario a arreglo para la vista ---
    const solicitudesPorEstudio = Object.entries(conteoEstudios).map(([_, v]) => ({
      nombre: v.nombre,
      solicitudes: v.solicitudes,
      ingresoTotal: v.ingresoTotal
    }));

    // --- PASO 3: Calcular % de exámenes finalizados ---
    let totalExamenes = 0;
    let totalFinalizados = 0;
    pacientes.forEach(paciente => {
      if (paciente.examenes) {
        paciente.examenes.forEach((examen: any) => {
          totalExamenes++;                // Contamos todos
          if (examen.realizado) totalFinalizados++;  // Contamos realizados
        });
      }
    });
    // Fórmula: (finalizados / total) * 100, evitamos división entre 0
    const porcentajeFinalizados = totalExamenes > 0 ? (totalFinalizados / totalExamenes) * 100 : 0;

    // --- PASO 4: Obtener nombres de estudios para el dropdown ---
    const nombresEstudios = Object.values(conteoEstudios).map(v => v.nombre);

    // --- PASO 5: Calcular promedio del estudio solicitado ---
    let promedioEstudioSeleccionado: number | null = null;
    let estudioSeleccionado = nombreEstudio || "";

    if (nombreEstudio) {
      // Buscar el estudio por nombre en el diccionario
      const estudioEncontrado = Object.values(conteoEstudios).find(v => v.nombre === nombreEstudio);
      
      if (estudioEncontrado && estudioEncontrado.valores.length > 0) {
        // Promedio = suma de todos los valores / cantidad de valores
        const suma = estudioEncontrado.valores.reduce((a, b) => a + b, 0);
        promedioEstudioSeleccionado = suma / estudioEncontrado.valores.length;
      }
    }

    return {
      solicitudesPorEstudio,
      porcentajeFinalizados,
      nombresEstudios,
      promedioEstudioSeleccionado,
      estudioSeleccionado
    };
  }
}