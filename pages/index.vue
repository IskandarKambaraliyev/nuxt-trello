<script lang="ts" setup>
  import type { BoardDocument } from "~/server/models/Board.model";

  definePageMeta({
    middleware: "auth",
  });

  const { data, refresh } = useFetch<BoardDocument[]>("/api/boards");

  provide("refresh-boards", refresh);

  const showCreateBoard = ref(false);
  const selectedBoard = ref<BoardDocument | undefined>();

  watchEffect(() => {
    if (!showCreateBoard.value) {
      selectedBoard.value = undefined;
    }
  });
</script>

<template>
  <div>
    <WrapperDefault>
      <template #actions>
        <UButton size="xs" @click="showCreateBoard = true">
          Create a Board
        </UButton>
      </template>

      <div
        class="m-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
      >
        <BoardCard
          v-for="board in data"
          :key="board._id"
          :board="board"
          :onEdit="
            () => {
              selectedBoard = board;
              showCreateBoard = true;
            }
          "
        />
      </div>

      <USlideover v-model="showCreateBoard">
        <OverlayHeader
          :title="selectedBoard ? 'Update a board' : 'Create a board'"
          :on-click="() => (showCreateBoard = false)"
        />

        <div class="p-4">
          <FormBoard
            :type="selectedBoard ? 'update' : 'create'"
            :initial-data="selectedBoard"
            :on-create="
              () => {
                refresh();
                showCreateBoard = false;
              }
            "
            :on-update="
              () => {
                refresh();
                showCreateBoard = false;
                selectedBoard = undefined;
              }
            "
          />
        </div>
      </USlideover>
    </WrapperDefault>
  </div>
</template>

<style></style>
