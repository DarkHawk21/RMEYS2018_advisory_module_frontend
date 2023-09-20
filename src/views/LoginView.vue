<template>
  <main>
    <div class="form_container">
      <h1>Iniciar sesión</h1>
      <label>Correo electrónico:</label>
      <input type="email" v-model="email" placeholder="asesor@ejemplo.com" />
      <label>Contraseña:</label>
      <input type="password" v-model="password" placeholder="********" />
      <button @click="login">Iniciar sesión</button>
    </div>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const email = ref();
  const password = ref();

  const canLogin = computed(() => {
    return email.value && password.value;
  });

  const login = () => {
    canLogin.value
    ? console.log('login')
    : console.log('no login');
  };
</script>

<style lang="scss" scoped>
  @import '../assets/styles/views/login.scss';
</style>
