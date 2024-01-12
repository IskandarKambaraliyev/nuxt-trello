<script lang="ts" setup>
  import type { CardDocument } from "~/server/models/Card.model";
  import type { ListDocument } from "~/server/models/List.model";
  import draggable from "vuedraggable";

  interface Props {
    list: ListDocument;
    boardId: string;
  }

  const props = defineProps<Props>();

  const { destroy, update: updateList } = useList(props.boardId);

  const refreshBoard = inject("board-refresh") as () => void;

  const listActions = ref([
    [
      {
        label: "Add card",
        icon: "i-heroicons-plus-circle",
        click: () => {
          showCardCreate.value = true
        }
      },
    ],
    [
      {
        label: "Delete",
        icon: "i-heroicons-trash",
        click: async () => {
          await destroy(props.list._id);
          refreshBoard();
        },
      },
    ],
  ]);

  const { data, refresh } = useFetch<CardDocument[]>(
    `/api/lists/${props.list._id}/cards`
  );

  const showCardCreate = ref(false);
  const selectedCard = ref<CardDocument | undefined>();

  const { update: updateCard } = useCard();

  function handleCardUpdate(card: CardDocument) {
    selectedCard.value = card;
    showCardCreate.value = true;
  }

  async function handleCardChange(e: any) {
    try {
      if (e.added) {
        const { element: card } = e.added;
        await updateCard(card._id, props.list._id, {
          list: props.list._id,
        });
      }

      await updateList(props.list._id, {
        cards: data.value?.flatMap((item) => item._id),
      });
    } catch (e) {
      console.log(e);
    }
  }

  watch(showCardCreate, (value) => {
    if(!value) {
      selectedCard.value = undefined
    }
  })
</script>

<template>
  <div
    class="w-72 shadow flex-none bg-white dark:bg-gray-800 rounded-lg flex flex-col"
  >
    <!-- Header -->
    <div
      class="p-4 border-b dark:border-gray-700 flex items-center justify-between list-handle cursor-grab"
    >
      <h3 class="font-medium select-none">{{ list.name }}</h3>
      <UDropdown :items="listActions">
        <UIcon name="i-heroicons-cog-6-tooth" />
      </UDropdown>
    </div>
    <!-- / Header -->

    <!-- Body -->
    <!-- <div class="list-body p-2 m-1 flex overflow-y-auto flex-1"> -->
    <draggable
      v-if="data"
      :list="data"
      item-key="_id"
      :scroll-sensitivity="100"
      group="list"
      :force-fallback="true"
      class="list-body p-1 m-1 space-y-2 flex-1 overflow-y-auto"
      ghost-class="ghost-card"
      @change="handleCardChange"
    >
      <template #item="{ element }">
        <div>
          <ListCard :card="element" @click="() => handleCardUpdate(element)" />
        </div>
      </template>
    </draggable>
    <!-- </div> -->
    <!-- / Body -->

    <!-- Footer -->
    <div class="p-1 border-t dark:border-gray-700 flex items-center">
      <UButton block @click="showCardCreate = true">Add Card</UButton>
    </div>
    <!-- / Footer -->

    <Teleport to="body">
      <UModal v-model="showCardCreate">
        <OverlayHeader
          :title="selectedCard ? 'Update card' : 'Create card'"
          :on-click="
            () => {
              showCardCreate = false;
              selectedCard = undefined;
            }
          "
        ></OverlayHeader>
        <div class="p-4">
          <FormCard
            :type="selectedCard ? 'update' : 'create'"
            :list-id="props.list._id"
            :initial-data="selectedCard"
            :on-create="
              () => {
                showCardCreate = false;
                refresh();
              }
            "
            :on-update="
              () => {
                showCardCreate = false;
                selectedCard = undefined;
                refresh();
              }
            "
          />
        </div>
      </UModal>
    </Teleport>
  </div>
</template>

<style>
  .ghost-card {
    @apply bg-gray-100 dark:bg-gray-700 rounded-lg;
  }
  .ghost-card > div {
    @apply invisible;
  }
  .list-body::-webkit-scrollbar {
    width: 10px;
    border-radius: 100px;
  }
  .list-body::-webkit-scrollbar-track {
    @apply dark:bg-gray-700 bg-gray-100;
    border-radius: 100px;
  }
  .list-body::-webkit-scrollbar-thumb {
    @apply dark:bg-gray-500 dark:hover:bg-gray-400 bg-gray-300 hover:bg-gray-400;
    border-radius: 100px;
  }
</style>
