import { api } from "#imports"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useSnackbarStore } from "./snackbar"

export const useCategoriesStore = defineStore("categories", () => {
  // State
  const categories = ref([])
  const selectedCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const snackbar = useSnackbarStore()

  // Getters
  const totalCategories = computed(() => categories.value.length)

  // Actions - Core CRUD Operations
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const res = await api().get("/Categories")
      if (res.status === 200) {
        categories.value = res.data.map(category => ({
          ...category,
          id: String(category.id),
        }))
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch categories"
      snackbar.show(error.value, "error")
      console.error("Error fetching categories:", err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id) {
    error.value = null
    try {
      const res = await api().get(`/Categories/${id}`)
      if (res.status === 200) {
        selectedCategory.value = {
          ...res.data,
          id: String(res.data.id),
        }

        return selectedCategory.value
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch category"
      snackbar.show(error.value, "error")
      console.error(`Error fetching category with ID ${id}:`, err)
      throw err
    }
  }

  async function addCategory(categoryData) {
    error.value = null
    try {
      const res = await api().post("/Categories", categoryData)
      if (res.status === 201 || res.status === 200) {
        const newCategory = {
          ...res.data,
          id: String(res.data.id),
        }

        categories.value.push(newCategory)
        snackbar.show(`Category "${newCategory.name}" added successfully!`, "success")

        return newCategory
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to add category"
      snackbar.show(error.value, "error")
      console.error("Error adding category:", err)
      throw err
    }
  }

  async function updateCategory({ id, ...categoryData }) {
    error.value = null
    try {
      const res = await api().put(`/Categories/${id}`, categoryData)
      if (res.status === 200) {
        const updatedCategory = {
          ...res.data,
          id: String(res.data.id),
        }

        const index = categories.value.findIndex(cat => cat.id === id)
        if (index !== -1) {
          categories.value[index] = updatedCategory
        }
        if (selectedCategory.value?.id === id) {
          selectedCategory.value = updatedCategory
        }
        snackbar.show(`Category "${updatedCategory.name}" updated successfully!`, "success")

        return updatedCategory
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update category"
      snackbar.show(error.value, "error")
      console.error(`Error updating category with ID ${id}:`, err)
      throw err
    }
  }

  var deleteCategory = async id => {
    error.value = null
    try {
      const res = await api().delete(`/Categories/${id}`)
      if (res.status === 200) {
        categories.value = categories.value.filter(cat => cat.id !== id)
        if (selectedCategory.value?.id === id) {
          selectedCategory.value = null
        }
        snackbar.show(`Category deleted successfully!`, "success")
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete category"
      snackbar.show(error.value, "error")
      console.error(`Error deleting category with ID ${id}:`, err)
      throw err
    }
  }

  // Translation Management
  async function addTranslation({ categoryId, language, name }) {
    error.value = null

    try {
      const res = await api().post("/Categories/add-translation", {
        categoryId,
        language,
        name,
      })

      if (selectedCategory.value) {
        selectedCategory.value.translations = {
          ...selectedCategory.value.translations,
          [language]: res.data,
        }
      }

      snackbar.show(`${language.toUpperCase()} translation added successfully`, "success")

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to add translation"
      snackbar.show(error.value, "error")
      console.error("Error adding translation:", err)
      throw err
    }
  }

  async function updateTranslation({ id, language, name }) {
    error.value = null
    try {
      const res = await api().put(`/Categories/update-translation/${id}`, {
        language,
        name,
      })

      if (selectedCategory.value) {
        selectedCategory.value.translations[language] = res.data
      }

      snackbar.show(`${language.toUpperCase()} translation updated successfully`, "success")

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update translation"
      snackbar.show(error.value, "error")
      console.error("Error updating translation:", err)
      throw err
    }
  }

  async function submitTranslation({ language, name }) {
    if (!selectedCategory.value) {
      const errorMsg = "No category selected for translation"

      snackbar.show(errorMsg, "error")
      throw new Error(errorMsg)
    }

    const existingTranslation = selectedCategory.value.translations?.[language]

    try {
      if (!existingTranslation) {
        return await addTranslation({
          categoryId: selectedCategory.value.id,
          language,
          name,
        })
      } else {
        return await updateTranslation({
          id: existingTranslation.id,
          language,
          name,
        })
      }
    } catch (err) {
      snackbar.show("Failed to save translation", "error")
      console.error("Translation submission failed:", err)
      throw err
    }
  }

  return {
    // State
    categories,
    selectedCategory,
    loading,
    error,

    // Getters
    totalCategories,

    // CRUD Actions
    fetchCategories,
    fetchCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,

    // Translation Actions
    addTranslation,
    updateTranslation,
    submitTranslation,
  }
})
