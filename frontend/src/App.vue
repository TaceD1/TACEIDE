<template>
  <div id="app">
    <NavBar v-if="$route.path !== '/login'" />
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  text-decoration: none;
}

.btn-primary {
  background-color: #3273dc;
  color: white;
}

.btn-primary:hover {
  background-color: #276cda;
}

.btn-danger {
  background-color: #ff3860;
  color: white;
}

.btn-danger:hover {
  background-color: #ff1a4b;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.nav-link {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #4a4a4a;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.25);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .nav-links {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
  }
}
</style>