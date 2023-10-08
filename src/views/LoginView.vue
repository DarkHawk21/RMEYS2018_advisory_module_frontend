<template>
  <main>
    <form class="form_container" @submit.prevent="handleSubmit">
      <h2 class="align_center">Iniciar sesión</h2>

      <label class="form_label_control">Correo electrónico:</label>
      <input
        type="email"
        v-model="email"
        placeholder="asesor@ejemplo.com"
        class="form_control"
      />

      <label class="form_label_control">Contraseña:</label>
      <input
        type="password"
        v-model="password"
        placeholder="********"
        class="form_control"
      />

      <button class="btn w_100" type="submit">Iniciar sesión</button>
    </form>
  </main>
</template>

<script setup>
  import jwtDecode from 'jwt-decode';
  import { ref, computed, watch } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter } from "vue-router";

  import { useUserStore } from "../stores/UserStore";

  const router = useRouter();

  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);

  const email = ref("samuel.hernandez@enp.unam.mx");
  const password = ref("HEBS641218");

  const canLogin = computed(() => {
    return email.value && password.value;
  });

  const handleSubmit = () => {
    if (canLogin.value) {
      userStore.login({ email: email.value, password: password.value });
    }
  };

  watch(token, (token) => {
    if (token) {
      const { role } = jwtDecode(token);

      if (router.currentRoute.value.query.from) {
        router.replace(router.currentRoute.value.query.from)
      } else {
        switch(role) {
          case 'admin':
            router.replace({ name: 'admin-home' });
          break;
          case 'advisor':
            router.replace({ name: 'adviser-home' });
          break;
          case 'student':
            router.replace({ name: 'student-home' });
          break;
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../assets/styles/views/login.scss';
</style>
