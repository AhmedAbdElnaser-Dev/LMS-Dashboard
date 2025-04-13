<script setup>
import ArabicTranslationForm from "@/components/forms/courses/ArabicTranslationForm.vue";
import CourseForm from "@/components/forms/courses/CourseForm.vue";
import EnglishTranslationForm from "@/components/forms/courses/EnglishTranslationForm.vue";
import RussianTranslationForm from "@/components/forms/courses/RussianTranslationForm.vue";
import EditOutline from "@/components/forms/EditOutline.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { VCard } from "vuetify/components";

const route = useRoute();
const store = useCoursesStore();
const courseId = route.params.id;
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await store.fetchCourseById(courseId);
  loading.value = false;
});

const basicInfo = CourseForm;
const arabicTranslation = ArabicTranslationForm;
const englishTranslation = EnglishTranslationForm;
const russianTranslation = RussianTranslationForm;
</script>

<template>
  <VCard v-if="!loading">
    <EditOutline
      :basicInfoForm="basicInfo"
      :arabicForm="arabicTranslation"
      :englishForm="englishTranslation"
      :russianForm="russianTranslation"
    />
  </VCard>
</template>
