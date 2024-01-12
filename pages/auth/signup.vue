<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { z } from "zod";
import SignupSchema from "~/schemas/Signup.schema";

const isLoading = ref(false);

const formState = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

async function handleSubmit(
  event: FormSubmitEvent<z.output<typeof SignupSchema>>
) {
  try {
    isLoading.value = true;

    await useFetch("/api/auth/signup", {
      method: "POST",
      body: event.data,
      watch: false,
    });

    useToast().add({
      title: "Account created!",
      description:
        "Your free account has been created successfully. Redirecting you to the sign in page..",
      timeout: 5000,
    });

    useRouter().push({
      name: "auth-signin",
    });
  } catch (e: any) {
    useToast().add({
      title: "An error occured!",
      description: e.message || "Something went wrong",
      timeout: 5000,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="grid lg:grid-cols-2 h-screen">
    <div
      class="left place-self-center w-full px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-52"
    >
      <UCard>
        <div class="header text-center mb-6">
          <div class="flex justify-center">
            <Logo />
          </div>
          <h1 class="text-xl font-bold mt-4">Create your free account</h1>
          <!-- <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div> -->
        </div>

        <UForm :state="formState" :schema="SignupSchema" @submit="handleSubmit">
          <UFormGroup class="mb-4" name="name" label="Fullname">
            <UInput v-model="formState.name" type="text" autocomplete="name" />
          </UFormGroup>
          <UFormGroup class="mb-4" name="email" label="Email">
            <UInput v-model="formState.email" type="email" autocomplete="email username" />
          </UFormGroup>
          <UFormGroup class="mb-4" name="password" label="Password">
            <UInput v-model="formState.password" type="password" autocomplete="new-password password" />
          </UFormGroup>
          <UFormGroup
            class="mb-4"
            name="passwordConfirm"
            label="Confirm Password"
          >
            <UInput v-model="formState.passwordConfirm" type="password" autocomplete="new-password password" />
          </UFormGroup>
          <UButton type="submit" :loading="isLoading" block>
            Create Account
          </UButton>
        </UForm>
      </UCard>
    </div>
    <div class="right hidden lg:block"></div>
  </div>
</template>

<style></style>
