<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable>
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable>
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/product/ProductForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useProductDeleteStore } from "@/store/product/delete";
import { useProductUpdateStore } from "@/store/product/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useProductCreateStore } from "@/store/product/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Product } from "@/types/product";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const productCreateStore = useProductCreateStore();
const { created } = storeToRefs(productCreateStore);

const productDeleteStore = useProductDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(productDeleteStore);

const productUpdateStore = useProductUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(productUpdateStore);

useMercureItem({
  store: productUpdateStore,
  deleteStore: productDeleteStore,
  redirectRouteName: "ProductList",
});

await productUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: Product) {
  await productUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    productUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await productDeleteStore.deleteItem(item?.value);

  await router.push({name: "ProductList"});
}

onBeforeUnmount(() => {
  productUpdateStore.$reset();
  productCreateStore.$reset();
  productDeleteStore.$reset();
});
</script>
