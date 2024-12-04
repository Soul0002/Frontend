<template>
  <div class="container">
    <h2 class="title">Gestión de Maestros</h2>

    <!-- Formulario para agregar un maestro -->
    <form @submit.prevent="agregarMaestro" class="form">
      <div class="form-group">
        <input 
          v-model="nuevoMaestro.nombre" 
          placeholder="Nombre del maestro" 
          required 
          class="input"
        />
      </div>
      <div class="form-group">
        <input 
          v-model="nuevoMaestro.matricula" 
          placeholder="Matrícula del maestro" 
          required 
          class="input"
        />
      </div>
      <button type="submit" class="btn btn-primary">Añadir Maestro</button>
    </form>

    <!-- Tabla de maestros -->
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="maestro in maestros" :key="maestro.matricula">
          <td>{{ maestro.nombre }}</td>
          <td>{{ maestro.matricula }}</td>
          <td>
            <button @click="verRelaciones(maestro)" class="btn btn-info">Ver Relaciones</button>
            <button @click="eliminarMaestro(maestro.id)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Relaciones del maestro -->
    <div v-if="maestroSeleccionado" class="relations-section">
      <h3 class="subtitle">Relaciones de {{ maestroSeleccionado.nombre }}</h3>

      <!-- Cursos asignados -->
      <div class="courses-section">
        <h4>Cursos Asignados</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre del Curso</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in cursos" :key="curso.id">
              <td>{{ curso.nombre }}</td>
              <td>{{ curso.creditos }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estudiantes -->
      <div class="students-section">
        <h4>Estudiantes</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in alumnos" :key="alumno.id">
              <td>{{ alumno.nombre }}</td>
              <td>{{ alumno.matricula }}</td>
              <td>{{ alumno.curso }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/apiService";

export default {
  data() {
    return {
      maestros: [],
      nuevoMaestro: { nombre: "", matricula: "" },
      maestroSeleccionado: null,
      alumnos: [],
      cursos: [],
    };
  },
  methods: {
    async cargarMaestros() {
      try {
        const response = await apiService.getAllMaestros();
        this.maestros = response.data;
      } catch (error) {
        console.error("Error al cargar maestros:", error);
      }
    },
    async agregarMaestro() {
      try {
        await apiService.addMaestro(this.nuevoMaestro);
        this.nuevoMaestro = { nombre: "", matricula: "" };
        this.cargarMaestros();
      } catch (error) {
        console.error("Error al agregar maestro:", error);
      }
    },
    async eliminarMaestro(id) {
      try {
        await apiService.deleteMaestro(id);
        this.cargarMaestros();
      } catch (error) {
        console.error("Error al eliminar maestro:", error);
      }
    },
    async verRelaciones(maestro) {
      try {
        this.maestroSeleccionado = maestro;

        // Obtener estudiantes del profesor
        const estudiantesResponse = await apiService.getEstudiantesDeProfesor(maestro.id);
        this.alumnos = estudiantesResponse.data;

        // Obtener cursos del profesor
        const cursosResponse = await apiService.getCursosDeMaestro(maestro.id);
        this.cursos = cursosResponse.data;
      } catch (error) {
        console.error("Error al cargar relaciones del maestro:", error);
      }
    },
  },
  mounted() {
    this.cargarMaestros();
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
