<script lang="ts" setup>
  import draggable from "vuedraggable";
  import type { ListDocument } from "~/server/models/List.model";

  interface Props {
    lists: ListDocument[];
    boardId: string;
  }

  const props = defineProps<Props>();

  const { handleSort, destroy } = useList(props.boardId);
</script>

<template>
  <div>
    <draggable
      :list="lists"
      handle=".list-handle"
      :scroll-sensitivity="100"
      :force-fallback="true"
      class="flex gap-4 h-[80vh] overflow-x-auto pb-2 my-4"
      ghost-class="ghost-board"
      drag-class="dragging-board"
      item-key="_id"
      @sort="handleSort($event, lists)"
    >
      <template #item="{ element }">
        <div class="flex item">
          <ListItem :list="element" :board-id="boardId" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style>
  .ghost-board > div {
    @apply opacity-60;
  }
  .ghost-board div > div {
    @apply invisible;
  }

  .dragging-board {
    @apply shadow-2xl transform rotate-2 cursor-grabbing;
  }

  .sortable-chosen {
    opacity: 100 !important;
  }

  .item:nth-child(1) {
    @apply ml-4;
  }

  .item:nth-last-child(1) {
    @apply mr-4;
  }
</style>
