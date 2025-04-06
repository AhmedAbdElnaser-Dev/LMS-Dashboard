<script setup>
import ArabicTranslationForm from "@/components/forms/departments/ArabicTranslationForm.vue";
import DepartmentForm from "@/components/forms/departments/DepartmentForm.vue";
import EnglishTranslationForm from "@/components/forms/departments/EnglishTranslationForm.vue";
import RussianTranslationForm from "@/components/forms/departments/RussianTranslationForm.vue";
import EditOutline from "@/components/forms/EditOutline.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { VCard } from "vuetify/components";

const route = useRoute();
const store = useDepartmentsStore();
const depId = route.params.id;

console.log("Fetching department with ID:", depId);
// Fetch book on mount
onMounted(async () => {
  await store.fetchDepartmentById(depId);
  console.log("Fetched department:", store.department);
});

// Forms
const basicInfo = DepartmentForm;
const arabicTranslation = ArabicTranslationForm;
const englishTranslation = EnglishTranslationForm;
const russianTranslation = RussianTranslationForm;
</script>

<template>
  <VCard v-if="!store.loading">
    <EditOutline
      :basicInfoForm="basicInfo"
      :arabicForm="arabicTranslation"
      :englishForm="englishTranslation"
      :russianForm="russianTranslation"
    />
  </VCard>
</template>
