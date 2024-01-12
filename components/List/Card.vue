<script lang="ts" setup>
  import type { CardDocument } from "~/server/models/Card.model";

  defineProps<{
    card: CardDocument;
  }>();
</script>

<template>
  <div
    class="py-2 px-4 border rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:outline hover:outline-blue-500 cursor-pointer"
  >
    {{ card.title }}
  </div>
</template>

<style></style>
