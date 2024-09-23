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

    <v-table v-if="item">
      <thead>
        <tr>
          <th>{{ $t("field") }}</th>
          <th>{{ $t("value") }}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {{ $t("product.article") }}
          </td>

          <td>
            {{ item.article }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("product.name") }}
          </td>

          <td>
            {{ item.name }}
                      </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useMercureItem } from "@/composables/mercureItem";
import { useProductDeleteStore } from "@/store/product/delete";
import { useProductShowStore } from "@/store/product/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const productShowStore = useProductShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(productShowStore);

const productDeleteStore = useProductDeleteStore();
const { deleted, error: deleteError } = storeToRefs(productDeleteStore);

useMercureItem({
  store: productShowStore,
  deleteStore: productDeleteStore,
  redirectRouteName: "ProductList",
});

await productShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    productDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await productDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ProductList" });
}

onBeforeUnmount(() => {
  productShowStore.$reset();
});
</script>
