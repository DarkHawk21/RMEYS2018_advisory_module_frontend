<template>
  <Header />

  <main>
    <div class="principal_container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
  import { watch } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter } from "vue-router";
  import { useUserStore } from "../stores/UserStore";
  import Header from '../components/HeaderComponent.vue';

  const router = useRouter();

  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);

  watch(token, async (token) => {
    if (!token) {
      router.currentRoute.value.query.from
        ? router.replace(router.currentRoute.value.query.from)
        : router.replace({ name: 'login' });
    }
  });
</script>
