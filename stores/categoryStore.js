import { api } from "#imports";
import { defineStore } from "pinia";
import Toast from "vue-toastification";

const { useToast } = Toast;

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
    toast: null,
  }),

  actions: {
    initializeToast(toastInstance) {
      this.toast = toastInstance || useToast();
    },

    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api().get("/Categories");
        if (res.status === 200) {
          this.categories = res.data.map(category => ({
            ...category,
            id: String(category.id),
          }));
          this.toast.success("Categories fetched successfully!");
          console.log("Fetched categories:", this.categories);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to fetch categories";
        this.error = errorMsg;
        this.toast.error(errorMsg);
        console.error("Error fetching categories:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id) {
      this.loading = true;
      this.error = null;
      try {
        if (!id || typeof id !== "string") {
          throw new Error(`Invalid category ID: ${id}`);
        }
        console.log("Attempting to delete category with ID:", id);
        const res = await api().delete(`/Categories/${id}`);
        if (res.status === 200 || res.status === 204) {
          const deletedCategory = this.categories.find(cat => cat.id === id);
          this.categories = this.categories.filter(cat => cat.id !== id);
          if (this.selectedCategory && this.selectedCategory.id === id) {
            this.selectedCategory = null;
          }
          this.toast.success(`Category "${deletedCategory?.name || id}" deleted successfully!`);
          console.log(`Category with ID ${id} deleted successfully`);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to delete category";
        this.error = errorMsg;
        this.toast.error(errorMsg);
        console.error(`Error deleting category with ID ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    totalCategories: (state) => state.categories.length,
  },
});
