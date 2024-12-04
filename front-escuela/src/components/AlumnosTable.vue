<template>
  <div class="container">
    <h2 class="title">Gestión de Alumnos</h2>

    <!-- Formulario para agregar un alumno -->
    <form @submit.prevent="agregarAlumno" class="form">
      <div class="form-group">
        <input 
          v-model="nuevoAlumno.nombre" 
          placeholder="Nombre" 
          required 
          class="input" 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="nuevoAlumno.matricula" 
          placeholder="Matrícula" 
          required 
          class="input" 
        />
      </div>
      <div class="form-group">
        <input 
          v-model="nuevoAlumno.semestre" 
          placeholder="Semestre" 
          required 
          class="input" 
        />
      </div>
      <button type="submit" class="btn btn-primary">Añadir Alumno</button>
    </form>

    <!-- Tabla de alumnos -->
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Semestre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="alumno in alumnos" :key="alumno.matricula">
          <td>{{ alumno.nombre }}</td>
          <td>{{ alumno.matricula }}</td>
          <td>{{ alumno.semestre }}</td>
          <td>
            <button 
              @click="getCursosDeAlumno(alumno.id)" 
              class="btn btn-info"
            >
              Ver Relaciones
            </button>
            <button 
              @click="eliminarAlumno(alumno.id)" 
              class="btn btn-danger"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Tabla de cursos del alumno -->
    <div v-if="cursos.length" class="courses-section">
      <h3 class="subtitle">Cursos del Alumno</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Nombre del Curso</th>
            <th>Créditos</th>
            <th>Profesor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in cursos" :key="curso.id">
            <td>{{ curso.nombre }}</td>
            <td>{{ curso.creditos }}</td>
            <td>{{ curso.profesorNombre || 'Sin profesor' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService';

export default {
  data() {
    return {
      alumnos: [],
      cursos: [],
      nuevoAlumno: { nombre: '', matricula: '', semestre: '' },
    };
  },
  methods: {
    async cargarAlumnos() {
      try {
        const response = await apiService.getAllAlumnos();
        this.alumnos = response.data;
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    },
    async agregarAlumno() {
      try {
        await apiService.addAlumno(this.nuevoAlumno);
        this.nuevoAlumno = { nombre: '', matricula: '', semestre: '' };
        this.cargarAlumnos();
      } catch (error) {
        console.error('Error al agregar alumno:', error);
      }
    },
    async eliminarAlumno(id) {
      try {
        await apiService.deleteAlumno(id);
        this.cargarAlumnos();
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
      }
    },
    async getCursosDeAlumno(id) {
      try {
        const response = await apiService.getCursosDeAlumnoWithDetails(id);

        const cursosConProfesor = await Promise.all(
          response.data.map(async curso => {
            const profesorResponse = await apiService.getProfesoresDelCurso(curso.id);
            const profesorNombre = profesorResponse.data.length
              ? profesorResponse.data[0].nombre
              : 'Sin profesor';
            return {
              ...curso,
              profesorNombre,
            };
          })
        );

        this.cursos = cursosConProfesor;
      } catch (error) {
        console.error('Error al obtener los cursos del alumno:', error);
        this.cursos = [];
      }
    },
  },
  mounted() {
    this.cargarAlumnos();
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

.courses-section {
  margin-top: 2rem;
}
</style>
