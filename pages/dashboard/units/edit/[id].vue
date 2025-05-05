<script setup>
import { useUnitsStore } from '@/stores/useUnitsStore'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import EditOutline from '@/components/forms/EditOutline.vue'
import ArabicTranslationForm from '@/components/forms/units/ArabicTranslationForm.vue'
import EnglishTranslationForm from '@/components/forms/units/EnglishTranslationForm.vue'
import RussianTranslationForm from '@/components/forms/units/RussianTranslationForm.vue'
import UnitForm from '@/components/forms/units/UnitForm.vue'

const route = useRoute()
const unitsStore = useUnitsStore()

const basicInfo = UnitForm
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = RussianTranslationForm

onMounted(() => {
  const unitId = route.params.id
  if (unitId) {
    unitsStore.getUnit(unitId)
  }
})
</script>


<template>
  <VCard v-if="!unitsStore.loading">
    <EditOutline
      :basic-info-form="basicInfo"
      :arabic-form="arabicTranslation"
      :english-form="englishTranslation"
      :russian-form="russianTranslation"
    />
  </VCard>
</template>
