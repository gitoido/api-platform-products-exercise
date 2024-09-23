<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  >
    <v-text-field
      prepend-icon="mdi-magnify"
      placeholder="Search products"
      hide-details
      single-line
      clearable
      v-model="search"
      @keyup="updateSearch"
      @click:clear="updateSearch"
    ></v-text-field>
    <v-spacer />
  </Toolbar>

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable>
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable>
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" closable>
      {{ error }}
    </v-alert>


    <v-data-table-server
      :items-per-page="items.length"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      @update:itemsPerPage="updateItemsPerPage"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'ProductShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductListStore } from "@/store/product/list";
import { useProductDeleteStore } from "@/store/product/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Product } from "@/types/product";
import debounce from "lodash.debounce";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const productDeleteStore = useProductDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(productDeleteStore);

const productListStore = useProductListStore();
const { items, totalItems, error, isLoading } = storeToRefs(productListStore);

const search = ref(null);
const page = ref("1");
const order = ref({});
const itemsPerPage = ref(10);

async function sendRequest() {
  await productListStore.getItems({
    search: search.value,
    page: page.value,
    order: order.value,
    itemsPerPage: itemsPerPage.value
  });
}

useMercureList({ store: productListStore, deleteStore: productDeleteStore });

sendRequest();

const headers = [
  { title: t("id"), key: "id" },
  {
    title: t("product.article"),
    key: "article",
    sortable: true,
  },
  {
    title: t("product.name"),
    key: "name",
    sortable: true,
  },
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
];

const debounceSearch = debounce(() => {
  console.log("Debounce trigger");
  sendRequest();
}, 300)

function updateSearch(query?: string|null) {
  search.value = (search.length === 0) ? null : search.value;

  debounceSearch();
}

function updateItemsPerPage(value: number) {
  itemsPerPage.value = value;

  sendRequest();
}

function updatePage(newPage: string) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  console.log(newOrders);
  if (newOrders.length === 0) {
    order.value = {};
  } else {
    const newOrder = newOrders[0];
    order.value = { [newOrder.key]: newOrder.order };
  }

  sendRequest();
}


function goToShowPage(item: Product) {
  router.push({
    name: "ProductShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ProductCreate",
  });
}

function goToUpdatePage(item: Product) {
  router.push({
    name: "ProductUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Product) {
  await productDeleteStore.deleteItem(item);

  await sendRequest();
}

onBeforeUnmount(() => {
  productDeleteStore.$reset();
});
</script>
