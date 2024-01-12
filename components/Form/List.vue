<script lang="ts" setup>
  import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
  import type { z } from "zod";
  import ListSchema from "~/schemas/List.schema";
  import type { ListDocument } from "~/server/models/List.model";

  interface Props {
    type: "create" | "update";
    initialData?: ListDocument;
    boardId: string;
    onCreate?: () => void;
    onUpdate?: () => void;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: "create",
  });

  const isLoading = ref(false);

  const formState = reactive<Partial<ListDocument>>({
    name: undefined,
    board: props.boardId,
  });

  watchEffect(() => {
    if (props.type === "update" && props.initialData) {
      formState.name = props.initialData.name;
      formState.board = props.initialData.board;
    }
  });

  async function handleForm(
    event: FormSubmitEvent<z.output<typeof ListSchema>>
  ) {
    try {
      isLoading.value = true;

      if (props.type === "update" && props.initialData?._id) {
        await useFetch(`/api/lists/${props.initialData._id}`, {
          method: "PUT",
          body: event.data,
          watch: false,
        });
        props.onUpdate?.();

        useToast().add({
          title: "List is updated!",
        });

        return;
      }

      await useFetch("/api/lists", {
        method: "POST",
        body: event.data,
        watch: false,
      });

      props.onCreate?.();

      useToast().add({
        title: "List is created!",
      });
    } catch (e) {
      console.log(e);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <UForm :state="formState" :schema="ListSchema" @submit="handleForm">
    <UFormGroup class="mb-4" name="name" label="Name">
      <UInput v-model="formState.name" />
    </UFormGroup>

    <UButton type="submit" block :loading="isLoading">
      {{ type === "create" ? "Create" : "Update" }}
    </UButton>
  </UForm>
</template>

<style></style>
