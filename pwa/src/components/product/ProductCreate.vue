<template>
  <Toolbar
    :breadcrumb="breadcrumb"
    :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable>{{ error }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/product/ProductForm.vue";
import { useProductCreateStore } from "@/store/product/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Product } from "@/types/product";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const productCreateStore = useProductCreateStore();
const { created, isLoading, violations, error } = storeToRefs(productCreateStore);

async function create(item: Product) {
  await productCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "ProductUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  productCreateStore.$reset();
});
</script>
