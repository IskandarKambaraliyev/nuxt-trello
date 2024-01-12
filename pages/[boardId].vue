<script lang="ts" setup>
  import { _backgroundImage, _backgroundSize } from "#tailwind-config/theme";
  import type { BoardDocument } from "~/server/models/Board.model";
  import type { ListDocument } from "~/server/models/List.model";

  definePageMeta({
    middleware: "auth",
  });

  const { boardId } = useRoute().params;

  const { data, refresh } = await useFetch<BoardDocument>(
    `/api/boards/${boardId}`
  );

  provide("board-refresh", refresh);

  if (!data.value) {
    throw createError({
      statusCode: 404,
      message: "Board not found",
    });
  }

  const selectedList = ref<ListDocument | undefined>();
  const showListCreate = ref(false);
</script>

<template>
  <WrapperDefault
    class="h-screen"
    :style="{
      backgroundImage: `url(${data?.coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <template #actions>
      <UButton size="xs" @click="showListCreate = true">Create list</UButton>
    </template>

    <div class="p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
      <h1
        class="text-3xl font-semibold inline-block text-black dark:text-white"
      >
        {{ data?.name }}
      </h1>
    </div>

    <ListContainer :lists="data?.lists" :board-id="(boardId as string)" />

    <USlideover v-model="showListCreate">
      <OverlayHeader
        :title="selectedList ? 'Update list' : 'Create list'"
        :on-click="() => (showListCreate = false)"
      />

      <div class="p-4">
        <FormList
          :type="selectedList ? 'update' : 'create'"
          :initial-data="selectedList"
          :board-id="(boardId as string)"
          :on-create="
            () => {
              refresh();
              showListCreate = false;
            }
          "
        />
      </div>
    </USlideover>
  </WrapperDefault>
</template>

<style></style>
