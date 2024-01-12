<script lang="ts" setup>
  const { data, signOut } = useAuth();

  const dropdownItems = ref([
    [
      {
        label: "Profile",
        slot: "profile",
        disabled: true,
      },
    ],
    [
      {
        label: "Billing",
        icon: "i-heroicons-credit-card",
        click: () => {},
      },
    ],
    [
      {
        label: "Sign Out",
        icon: "i-heroicons-arrow-left-on-rectangle",
        click: handleSignout,
      },
    ],
  ]);

  async function handleSignout() {
    await signOut();
  }
  const ui = /*ui*/ {
    item: {
      disabled: "cursor-default",
    },
  };
</script>

<template>
  <div>
    <header class="p-4 dark:border-gray-700 bg-white dark:bg-gray-800 px-4">
      <div class="flex justify-between">
        <NuxtLink to="/"><Logo class="w-8 h-8" /></NuxtLink>

        <div class="inline-flex justify-end gap-4 items-center">
          <slot name="actions"></slot>

          <ColorSwitcher />

          <UDropdown :items="dropdownItems" width="w-60" :ui="ui">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />

            <template #profile>
              <div class="text-left" style="padding-right: 1rem">
                <p>Signed in as</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ data?.user?.email }}
                </p>
              </div>
            </template>
          </UDropdown>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style></style>
