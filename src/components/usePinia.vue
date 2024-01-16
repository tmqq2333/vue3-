<template>
  
  <div>{{ userStore.name }}</div>
  
</template>


<script setup>
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
</script>
