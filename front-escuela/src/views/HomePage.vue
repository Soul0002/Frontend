<template>
  <div class="home">
    <h1>Bienvenido a la Gestión Escolar</h1>
    <p>Seleccione una de las siguientes opciones para comenzar:</p>
    
    <!-- Botón de autenticación de Google -->
    <div class="google-login">
      <GoogleLogin
        :clientId="googleClientId"
        buttonText="Iniciar sesión con Google"
        @success="handleGoogleSuccess"
        @error="handleGoogleError"
      />
    </div>

    <div class="navigation">
      <router-link to="/alumnos" class="nav-card">
        <h2>Gestión de Alumnos</h2>
        <p>Visualiza, edita y gestiona alumnos y sus relaciones.</p>
      </router-link>
      <router-link to="/cursos" class="nav-card">
        <h2>Gestión de Cursos</h2>
        <p>Consulta, añade y gestiona los cursos disponibles.</p>
      </router-link>
      <router-link to="/maestros" class="nav-card">
        <h2>Gestión de Maestros</h2>
        <p>Gestiona los maestros y asigna relaciones con cursos.</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login';

export default {
  name: 'HomePage',
  components: {
    GoogleLogin,
  },
  data() {
    return {
      googleClientId: '292338360294-c0k1430dnnath2mh7p0ata5mbd21p9rl.apps.googleusercontent.com', // Reemplaza con tu Client ID
    };
  },
  methods: {
    handleGoogleSuccess(response) {
      console.log('Autenticación exitosa:', response);
      alert(`Bienvenido, ${response.profileObj.name}!`);
      // Aquí puedes guardar el token o hacer una llamada al backend
    },
    handleGoogleError(error) {
      console.error('Error en la autenticación:', error);
      alert('Error al iniciar sesión con Google.');
    },
  },
};
</script>

<style>
.home {
  text-align: center;
  margin: 20px;
}

.google-login {
  margin-bottom: 20px;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-card {
  display: block;
  width: 300px;
  padding: 20px;
  text-decoration: none;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: left;
  transition: box-shadow 0.3s ease;
}

.nav-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-card h2 {
  margin: 0;
  font-size: 1.5em;
  color: #007bff;
}

.nav-card p {
  margin-top: 10px;
  font-size: 1em;
  color: #555;
}
</style>
