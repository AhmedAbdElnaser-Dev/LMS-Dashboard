<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      name: '',
      maxStudents: 30,
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const form = ref({
  name: props.initialValues.name,
  maxStudents: props.initialValues.maxStudents,
})

const isTouched = ref({
  name: false,
  maxStudents: false,
})

const handleSubmit = () => {
  Object.keys(isTouched.value).forEach(key => {
    isTouched.value[key] = true
  })

  // Validate
  if (!form.value.name || !form.value.maxStudents) return

  emit('submit', { ...form.value })
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="form.name"
        label="Group Name"
        variant="outlined"
        required
        class="mb-4"
        :error="isTouched.name && !form.name"
        :error-messages="isTouched.name && !form.name ? ['Name is required'] : []"
        @blur="isTouched.name = true"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model.number="form.maxStudents"
        label="Maximum Students"
        type="number"
        variant="outlined"
        required
        class="mb-4"
        :error="isTouched.maxStudents && !form.maxStudents"
        :error-messages="isTouched.maxStudents && !form.maxStudents ? ['Maximum students is required'] : []"
        :rules="[
          v => !isNaN(v) || 'Must be a number',
          v => v >= 1 || 'Must be at least 1',
          v => v <= 100 || 'Cannot exceed 100',
        ]"
        min="1"
        max="100"
        @blur="isTouched.maxStudents = true"
      />
    </VCol>

    <VCol
      cols="12"
      class="d-flex justify-end gap-4"
    >
      <VBtn
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="handleSubmit"
      >
        Save Group
      </VBtn>
    </VCol>
  </VRow>
</template>
