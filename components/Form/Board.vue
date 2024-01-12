<script lang="ts" setup>
  import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
  import type { z } from "zod";
  import BoardSchema from "~/schemas/Board.schema";
  import type { BoardDocument } from "~/server/models/Board.model";

  interface Props {
    type: "create" | "update";
    initialData?: BoardDocument;
    onCreate?: () => void;
    onUpdate?: () => void;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: "create",
  });

  const isLoading = ref(false);

  const formState = reactive<Partial<BoardDocument>>({
    name: undefined,
    coverImage: undefined,
  });

  watchEffect(() => {
    if (props.type === "update" && props.initialData) {
      formState.name = props.initialData.name;
      formState.coverImage = props.initialData.coverImage;
    }

    // if(props.type === "create" && props.initialData) {
    //   formState.name = undefined;
    //   formState.coverImage = undefined;
    // }
  });

  async function handleForm(
    event: FormSubmitEvent<z.output<typeof BoardSchema>>
  ) {
    try {
      isLoading.value = true;

      if (props.type === "update" && props.initialData?._id) {
        await useFetch(`/api/boards/${props.initialData._id}`, {
          method: "PUT",
          body: event.data,
          watch: false,
        });
        props.onUpdate?.();

        useToast().add({
          title: "Board is updated!",
        });

        return;
      }

      await useFetch("/api/boards", {
        method: "POST",
        body: event.data,
        watch: false,
      });

      props.onCreate?.();

      useToast().add({
        title: "Board is created!",
      });
    } catch (e) {
      console.log(e);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <UForm :state="formState" :schema="BoardSchema" @submit="handleForm">
    <UFormGroup class="mb-4" name="name" label="Name">
      <UInput v-model="formState.name" />
    </UFormGroup>

    <UFormGroup class="mb-4" name="coverImage" label="Cover Image">
      <ImagePicker v-model="formState.coverImage" />
    </UFormGroup>

    <UButton type="submit" block :loading="isLoading">
      {{ type === "create" ? "Create" : "Update" }}
    </UButton>
  </UForm>
</template>

<style></style>
