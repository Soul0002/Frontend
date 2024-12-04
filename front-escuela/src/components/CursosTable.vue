<template>
  <div class="container">
    <h2 class="title">Gestión de Cursos</h2>

    <!-- Formulario para agregar un curso -->
    <form @submit.prevent="agregarCurso" class="form">
      <div class="form-group">
        <input 
          v-model="nuevoCurso.nombre" 
          placeholder="Nombre del curso" 
          required 
          class="input" 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="nuevoCurso.creditos" 
          type="number" 
          placeholder="Créditos" 
          required 
          class="input" 
        />
      </div>
      <button type="submit" class="btn btn-primary">Añadir Curso</button>
    </form>

    <!-- Tabla de cursos -->
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Créditos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in cursos" :key="curso.id">
          <td>{{ curso.nombre }}</td>
          <td>{{ curso.creditos }}</td>
          <td>
            <button @click="mostrarRelaciones(curso)" class="btn btn-info">Ver Relaciones</button>
            <button @click="eliminarCurso(curso.id)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Sección para mostrar relaciones de un curso -->
    <div v-if="cursoSeleccionado" class="relations-section">
      <h3 class="subtitle">Relaciones de {{ cursoSeleccionado.nombre }}</h3>

      <!-- Profesor asignado -->
      <div class="professor-section">
        <h4>Profesor Asignado</h4>
        <p v-if="profesorDelCurso">
          {{ profesorDelCurso.nombre }}
          <button @click="eliminarProfesor(profesorDelCurso.id)" class="btn btn-warning">Eliminar</button>
        </p>
        <p v-else>No hay profesor asignado</p>
        <form @submit.prevent="asignarProfesor" class="form-inline">
          <select v-model="profesorSeleccionado" class="select">
            <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
              {{ profesor.nombre }}
            </option>
          </select>
          <button type="submit" class="btn btn-success">Asignar Profesor</button>
        </form>
      </div>

      <!-- Estudiantes inscritos -->
      <div class="students-section">
        <h4>Estudiantes Inscritos</h4>
        <ul class="students-list">
          <li v-for="alumno in estudiantesDelCurso" :key="alumno.id" class="student-item">
            {{ alumno.nombre }} - {{ alumno.matricula }}
            <button @click="eliminarAlumno(alumno.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </li>
        </ul>
        <form @submit.prevent="inscribirAlumno" class="form-inline">
          <select v-model="alumnoSeleccionado" class="select">
            <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.id">
              {{ alumno.nombre }}
            </option>
          </select>
          <button type="submit" class="btn btn-success">Inscribir Alumno</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/apiService";

export default {
  data() {
    return {
      cursos: [],
      profesores: [],
      alumnos: [],
      estudiantesDelCurso: [],
      nuevoCurso: { nombre: "", creditos: "" },
      cursoSeleccionado: null,
      profesorDelCurso: null,
      profesorSeleccionado: null,
      alumnoSeleccionado: null,
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const [cursosResponse, profesoresResponse, alumnosResponse] = await Promise.all([
          apiService.getAllCursos(),
          apiService.getAllMaestros(),
          apiService.getAllAlumnos(),
        ]);
        this.cursos = cursosResponse.data;
        this.profesores = profesoresResponse.data;
        this.alumnos = alumnosResponse.data;
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    async agregarCurso() {
      try {
        await apiService.addCurso(this.nuevoCurso);
        this.nuevoCurso = { nombre: "", creditos: "" };
        this.cargarDatos();
      } catch (error) {
        console.error("Error al agregar curso:", error);
      }
    },
    async eliminarCurso(id) {
      try {
        await apiService.deleteCurso(id);
        this.cargarDatos();
      } catch (error) {
        console.error("Error al eliminar curso:", error);
      }
    },
    async mostrarRelaciones(curso) {
      try {
        const cursoResponse = await apiService.getCursoById(curso.id);
        const profesoresResponse = await apiService.getProfesoresDelCurso(curso.id);
        const estudiantesResponse = await apiService.getEstudiantesDeCurso(curso.id);

        this.cursoSeleccionado = cursoResponse.data;
        this.profesorDelCurso = profesoresResponse.data.length ? profesoresResponse.data[0] : null;
        this.estudiantesDelCurso = estudiantesResponse.data;
      } catch (error) {
        console.error("Error al cargar relaciones del curso:", error);
        alert("No se pudieron cargar las relaciones del curso.");
      }
    },
    async asignarProfesor() {
      if (!this.profesorSeleccionado) {
        alert("Por favor selecciona un profesor.");
        return;
      }
      try {
        await apiService.asignarProfesorACurso({
          profesorId: this.profesorSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al asignar profesor:", error);
      }
    },
    async inscribirAlumno() {
      if (!this.alumnoSeleccionado) {
        alert("Por favor selecciona un alumno.");
        return;
      }
      try {
        await apiService.inscribirAlumnoACurso({
          estudianteId: this.alumnoSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al inscribir alumno:", error);
      }
    },
    async eliminarProfesor(profesorId) {
      try {
        await apiService.eliminarProfesorDeCurso({
          profesorId,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al eliminar profesor:", error);
      }
    },
    async eliminarAlumno(alumnoId) {
      try {
        await apiService.eliminarAlumnoDeCurso({
          estudianteId: alumnoId,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al eliminar alumno:", error);
      }
    },
  },
  mounted() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
.container {
  padding: 2rem;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.form {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.table th {
  background-color: #f8f9fa;
}

.relations-section {
  margin-top: 2rem;
}
</style>
