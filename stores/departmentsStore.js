import api from "@/utils/api"; // assuming you have an api helper
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDepartmentsStore = defineStore("departments", () => {
  const departments = ref([]);
  const department = ref(null);
  const users = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchDepartments = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api().get("/Departments/all");
      departments.value = response.data;
      console.log("Departments:", departments.value);
    } catch (err) {
      error.value = err.message || "Failed to fetch departments";
    } finally {
      loading.value = false;
    }
  };

  const fetchDepartmentById = async (id) => {
    loading.value = true;
    error.value = null;
    department.value = null;
    try {
      const response = await api().get(`/Departments/${id}`);
      department.value = response.data;
      console.log("Department:", department.value);
    } catch (err) {
      error.value = err.message || `Failed to fetch department with ID ${id}`;
    } finally {
      loading.value = false;
    }
  };

  const fetchUsersAndCategories = async () => {
    if (users.value.length > 0 && categories.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      const response = await api().get("/Departments/users-and-categories");
      users.value = response.data.users;
      categories.value = response.data.categories;
    } catch (err) {
      error.value = err.message || "Failed to fetch users and categories";
    } finally {
      loading.value = false;
    }
  };

  const addDepartment = async (departmentData) => {
    loading.value = true;
    error.value = null;
    try {
      await api().post("/Departments", departmentData);
      await fetchDepartments();
    } catch (err) {
      error.value = err.message || "Failed to add department";
    } finally {
      loading.value = false;
    }
  };

  const updateDepartment = async (id, departmentData) => {
    loading.value = true;
    error.value = null;
    try {
      await api().put(`/Departments/${id}`, departmentData);
      await fetchDepartments();
    } catch (err) {
      error.value = err.message || `Failed to update department with ID ${id}`;
    } finally {
      loading.value = false;
    }
  };

  const addTranslation = async ({ departmentId, language, name }) => {
    try {
      const res = await api().post("/Departments/transalations", {
        departmentId,
        language,
        name,
      });
      if (department.value) {
        department.value.translations = {
          ...department.value.translations,
          [language]: res.data,
        };
      }
      return res.data;
    } catch (error) {
      console.error("Error adding translation:", error);
      throw error.response?.data?.message || "Failed to add translation";
    }
  };

  const editTranslation = async ({ id, language, name }) => {
    try {
      const res = await api().put(`/Departments/translations/${id}`, {
        id,
        language,
        name,
      });
      if (department.value) {
        department.value.translations[language] = res.data;
      }
      return res.data;
    } catch (error) {
      console.error("Error editing translation:", error);
      throw error.response?.data?.message || "Failed to update translation";
    }
  };

  const submitTranslation = async ({ language, name, description }) => {
    if (!department.value) {
      console.error("No selected department to update");
      return;
    }

    const currentTranslation = department.value.translations?.[language];
    try {
      if (!currentTranslation || currentTranslation.name === "") {
        await addTranslation({
          departmentId: department.value.id,
          language,
          name,
        });
      } else {
        await editTranslation({
          id: currentTranslation.id,
          language,
          name,
        });
      }
    } catch (error) {
      console.error("Translation submission failed:", error);
    }
  };

  const deleteDepartment = async(depId) => {
    loading.value = true;
    error.value = null;
    try {
      await api().delete(`/Departments/${depId}`);
      departments.value = departments.value.filter(dep => dep.id !== depId);
      if (department.value && department.value.id === depId) {
        department.value = null;
      }
    } catch (err) {
      error.value = err.message || `Failed to delete department with ID ${depId}`;
    } finally {
      loading.value = false;
    }
  };

  return {
    departments,
    department,
    users,
    categories,
    loading,
    error,
    fetchDepartments,
    fetchDepartmentById,
    fetchUsersAndCategories,
    addDepartment,
    updateDepartment,
    submitTranslation,
    addTranslation,
    editTranslation,
    deleteDepartment
  };
});
