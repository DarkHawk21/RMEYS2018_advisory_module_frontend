<template>
  <main>
    <div class="form_container">
      <h2 class="align_center">Iniciar sesión</h2>

      <label class="form_label_control">Correo electrónico:</label>
      <input type="email" v-model="email" placeholder="asesor@ejemplo.com" class="form_control" />

      <label class="form_label_control">Contraseña:</label>
      <input type="password" v-model="password" placeholder="********" class="form_control" />

      <button @click="login" class="btn w_100">Iniciar sesión</button>
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
