<template>
  <section class="loader_container">
    <spring-spinner
      :animation-duration="3000"
      :size="100"
      color="#ffffff"
    />
  </section>
</template>

<script setup>
  import { SpringSpinner } from 'epic-spinners';
</script>

<style lang="scss">
  @import '../assets/styles/components/loader.scss';
</style>
