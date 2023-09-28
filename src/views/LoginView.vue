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
  import { storeToRefs } from "pinia";

  import { useUserStore } from "../stores/UserStore";

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const email = ref("enrique.carranza@keypro.com.mx");
  const password = ref("Pass1234");

  const canLogin = computed(() => {
    return email.value && password.value;
  });

  const login = () => {
    if (canLogin.value) {
      userStore.login({ email: email.value, password: password.value });
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/styles/views/login.scss';
</style>
