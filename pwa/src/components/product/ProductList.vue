<template>
  <div>
    <v-container fluid>
      <v-alert v-if="error" type="error" class="mb-4" closable="true">
        {{ error }}
      </v-alert>

      <v-card>
        <v-card-title>
          Products
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              @keyup="updateSearch"
              @click:clear="updateSearch"
          ></v-text-field>
        </v-card-title>
        <v-data-table
            :loading="isLoading"
            loading-text="Loading... Please wait"
            item-key="id"
            :headers="headers"
            :items="items"
            :search="search"
            :server-items-length="totalItems"
            @pagination="updatePagination"
            @update:options="updateData"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useProductListStore} from "@/store/product/list";
import debounce from "lodash.debounce";

const productListStore = useProductListStore();
const { items, totalItems, error, isLoading } = storeToRefs(productListStore);

const search = ref(null);
const page = ref("1");
const order = ref({});
const itemsPerPage = ref(10);

async function sendRequest() {
  let params = {
    page: page.value,
    order: order.value,
  };

  if (search.value !== null) {
    params.search = search.value;
  }
  if (itemsPerPage.value !== null) {
    params.itemsPerPage = itemsPerPage.value;
  } else {
    params.itemsPerPage = totalItems.value;
  }

  await productListStore.getItems(params);
}

sendRequest();

const headers = [
  {text: "Id", value: "id"},
  {
    text: "Article",
    value: "article",
    sortable: true,
  },
  {
    text: "Name",
    value: "name",
    sortable: true,
  },
];

const debounceSearch = debounce(() => {
  sendRequest();
}, 300)

function updateSearch(query?: string|null) {
  search.value = (search.length === 0) ? null : search.value;

  debounceSearch();
}

function updatePagination(pagination: object) {
  page.value = pagination.page;
  console.log(pagination);
  if (pagination.itemsPerPage === -1) {
    itemsPerPage.value = null;
  } else {
    itemsPerPage.value = pagination.itemsPerPage;
  }
  sendRequest();
}

function updateData(options: object) {
  if (options.sortBy.length === 0) {
    order.value = {};
  } else {
    order.value = {[options.sortBy[0]]: (options.sortDesc[0] ? "desc" : "asc")};
  }
  sendRequest();
}


</script>
