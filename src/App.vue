<template>
  <Loader v-if="loading" />

  <RouterView />
</template>

<script setup>
  import { storeToRefs } from "pinia";
  import { RouterView } from 'vue-router';
  import { useLoaderStore } from './stores/LoaderStore';
  import Loader from './components/LoaderComponent.vue';

  const loaderStore = useLoaderStore();
  const { loading } = storeToRefs(loaderStore);
</script>
