<template>
  <header>
    <div class="header_logo_container">
      <img src="/images/logo_unam.png" alt="Logotipo UNAM" />
    </div>

    <div class="header_titles_container">
      <h1>{{ getUserType($route.name) }}</h1>
      <h2>{{ getDescription($route.name) }}</h2>
    </div>

    <div class="header_logo_container">
      <img src="/images/logo_enp9.png" alt="Logo ENP 9" @click="userStore.logout()" style="cursor:pointer;" />
    </div>
  </header>
</template>

<script setup>
  import { useUserStore } from "../stores/UserStore";

  const userStore = useUserStore();

  const getUserType = (routeName) => {
    switch(routeName) {
      case 'adviser-home':
        return 'Asesor';
      case 'admin-home':
        return 'Administrador / Módulo';
      default:
        return 'Alumno';
    }
  };

  const getDescription = (routeName) => {
    switch(routeName) {
      case 'adviser-home':
        return 'Asesorías en tu agenda';
      case 'admin-home':
        return 'Disponibilidad de asesores';
      default:
        return 'Calendario de Asesorías';
    }
  };
</script>

<style lang="scss">
  @import '../assets/styles/components/header.scss';
</style>
