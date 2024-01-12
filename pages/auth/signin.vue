<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import SigninSchema from "~/schemas/Signin.schema";
import { z } from "zod";

const isLoading = ref(false);
const formState = reactive({
  email: undefined,
  password: undefined,
});
const errorMessage = ref("");

const { signIn } = useAuth();

async function handleSignIn(
  event: FormSubmitEvent<z.output<typeof SigninSchema>>
) {
  try {
    isLoading.value = true;

    const res = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });

    if (res?.error) {
      errorMessage.value = res.error;
    } else {
      useRouter().push("/");
    }
  } catch (e) {
    console.log(e);
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
          <h1 class="text-xl font-bold mt-4">Log in to your account</h1>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
        </div>

        <UForm :state="formState" :schema="SigninSchema" @submit="handleSignIn">
          <UFormGroup
            class="mb-4"
            name="email"
            label="Email"
            :error="errorMessage.includes('User not found')"
          >
            <UInput v-model="formState.email" type="email" />
          </UFormGroup>
          <UFormGroup
            class="mb-4"
            name="password"
            label="Password"
            :error="errorMessage.includes('Incorrect password')"
          >
            <UInput
              v-model="formState.password"
              type="password"
            />
          </UFormGroup>
          <UButton type="submit" :loading="isLoading" block>Log In</UButton>
        </UForm>
      </UCard>
    </div>
    <div class="right hidden lg:block"></div>
  </div>
</template>

<style>
.right {
  background: linear-gradient(-45deg, #22c55e, #10b981, #84cc16, #23d5ab);
  background-size: 400%, 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
