<script lang="ts" setup>
  import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
  import type { z } from "zod";
  import CardSchema from "~/schemas/Card.schema";
  import type { CardDocument } from "~/server/models/Card.model";

  interface Props {
    type: "create" | "update";
    initialData?: CardDocument;
    listId: string;
    onCreate?: () => void;
    onUpdate?: () => void;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: "create",
  });

  const formState = reactive<Partial<CardDocument>>({
    title: undefined,
    description: undefined,
    list: props.listId,
  });

  const isLoading = ref(false);

  async function handleSubmit(
    event: FormSubmitEvent<z.output<typeof CardSchema>>
  ) {
    try {
      isLoading.value = true;
      if (props.type === "update" && props.initialData) {
        await useFetch(
          `/api/lists/${props.listId}/cards/${props.initialData._id}`,
          {
            method: "PUT",
            body: JSON.stringify(event.data),
            watch: false,
          }
        );

        props.onCreate?.();
        isLoading.value = false;
        return;
      }

      await useFetch(`/api/lists/${props.listId}/cards`, {
        method: "POST",
        body: JSON.stringify(event.data),
        watch: false,
      });

      props.onUpdate?.();
      isLoading.value = false;
    } catch (e) {
      console.log(e);
    } finally {
      isLoading.value = false;
    }
  }

  watchEffect(() => {
    if (props.type === "update" && props.initialData) {
      formState.title = props.initialData?.title;
      formState.description = props.initialData?.description;
    }
  });
</script>

<template>
  <UForm :state="formState" :schema="CardSchema" @submit="handleSubmit">
    <UFormGroup name="title" label="Title" class="mb-4">
      <UInput type="text" v-model="formState.title" />
    </UFormGroup>

    <UFormGroup name="description" label="Description" class="mb-4">
      <ClientOnly>
        <QuillEditor
          v-model:content="formState.description"
          class="min-h-[200px]"
          content-type="html"
          toolbar="minimal"
        />
      </ClientOnly>
    </UFormGroup>

    <UButton type="submit" block :loading="isLoading">
      {{ props.type === "create" ? "Create" : "Update" }}
    </UButton>
  </UForm>
</template>

<style></style>
