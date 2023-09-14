<template>
  <Header />

  <main>
    <div class="principal_container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
  import Header from '../components/HeaderComponent.vue';
</script>