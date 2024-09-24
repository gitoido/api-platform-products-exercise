import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Product } from "@/types/product";

interface State {
  deleted?: Product;
  mercureDeleted?: Product;
  isLoading: boolean;
  error?: string;
}

export const useProductDeleteStore = defineStore("productDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Product) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No product found. Please reload");
        return;
      }

      try {
        await api(item["@id"], { method: "DELETE" });

        this.toggleLoading();
        this.setDeleted(item);
        this.setMercureDeleted(undefined);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setDeleted(deleted: Product) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Product | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
