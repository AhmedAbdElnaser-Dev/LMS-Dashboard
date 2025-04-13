<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['removeStudent', 'editTranslation', 'addStudents'])

const searchQuery = ref('')
const selectedLanguage = ref('ar')
const openPanels = ref([0, 1, 2])

const languages = [
  { title: 'Arabic', value: 'ar', icon: 'tabler-letter-a' },
  { title: 'English', value: 'en', icon: 'tabler-language' },
  { title: 'Russian', value: 'ru', icon: 'tabler-letter-r' },
]

const getTranslation = lang => 
  props.group.translations?.find(t => t.language === lang) || null

const translations = computed(() => 
  languages.map(lang => ({
    ...lang,
    translation: getTranslation(lang.value),
  })),
)

const navigateToTranslation = lang => {
  emit('editTranslation', lang)
}

const formatDate = date => {
  if (!date) return '-'

  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const filteredStudents = computed(() => {
  if (!props.group.students) return []
  
  return props.group.students.filter(student => 
    student.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const handleRemoveStudent = studentId => {
  emit('removeStudent', studentId)
}

const handleAddStudents = () => {
  console.log('Opening add students dialog for group:', props.group.id)
  emit('addStudents')
}
</script>

<template>
  <div class="group-details">
    <VExpansionPanels
      v-model="openPanels"
      multiple
    >
      <!-- Group Information Section -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Group Information</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow>
            <VCol
              v-for="lang in translations"
              :key="lang.value"
              cols="12"
              md="4"
            >
              <VCard
                :color="lang.translation ? undefined : 'grey-lighten-3'"
                variant="outlined"
                class="h-100"
              >
                <VCardItem>
                  <template #prepend>
                    <VIcon 
                      :icon="lang.icon"
                      size="24"
                      class="me-2"
                    />
                  </template>
                  <VCardTitle>{{ lang.title }}</VCardTitle>
                </VCardItem>

                <VCardText v-if="lang.translation">
                  <h3 class="text-h6 mb-2">
                    {{ lang.translation.name }}
                  </h3>
                  <p class="text-body-1">
                    {{ lang.translation.description }}
                  </p>

                  <VDivider class="my-3" />

                  <div class="text-caption text-grey">
                    <div class="mb-1">
                      <strong>Created:</strong> {{ formatDate(lang.translation.createdAt) }}
                      <span v-if="lang.translation.createdBy">by {{ lang.translation.createdBy }}</span>
                    </div>
                    <div>
                      <strong>Updated:</strong> {{ formatDate(lang.translation.updatedAt) }}
                      <span v-if="lang.translation.updatedBy">by {{ lang.translation.updatedBy }}</span>
                    </div>
                  </div>

                  <VBtn
                    color="primary"
                    variant="text"
                    class="mt-2"
                    prepend-icon="tabler-pencil"
                    @click="navigateToTranslation(lang.value)"
                  >
                    Edit {{ lang.title }}
                  </VBtn>
                </VCardText>

                <VCardText v-else>
                  <VAlert
                    type="info"
                    variant="tonal"
                    text="No content available for this language"
                    class="mb-2"
                  />
                  <VBtn
                    color="primary"
                    variant="text"
                    prepend-icon="tabler-plus"
                    @click="navigateToTranslation(lang.value)"
                  >
                    Add {{ lang.title }}
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <VDivider class="my-4" />

          <div class="d-flex gap-4 flex-wrap">
            <VCard
              variant="outlined"
              class="stat-card"
            >
              <VCardTitle>Max Students</VCardTitle>
              <VCardText>
                <div class="text-h5">
                  {{ group.maxStudents }}
                </div>
              </VCardText>
            </VCard>

            <VCard
              variant="outlined"
              class="stat-card"
            >
              <VCardTitle>Current Students</VCardTitle>
              <VCardText>
                <div class="text-h5">
                  {{ group.currentStudentCount }}
                </div>
              </VCardText>
            </VCard>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>

      <!-- Instructor Section -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Instructor</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="d-flex flex-column">
            <span class="text-h6">{{ group.instructor.fullName }}</span>
            <span class="text-subtitle-1">{{ group.instructor.email }}</span>
            <span
              v-if="group.instructor.phoneNumber"
              class="text-subtitle-1"
            >
              {{ group.instructor.phoneNumber }}
            </span>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>

      <!-- Students Section -->
      <VExpansionPanel>
        <VExpansionPanelTitle>
          <div class="d-flex justify-space-between align-center w-100">
            <span>Students</span>
            <VBtn
              color="primary"
              variant="text"
              size="small"
              prepend-icon="tabler-plus"
              @click.stop="handleAddStudents"
            >
              Add Students
            </VBtn>
          </div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField
            v-model="searchQuery"
            label="Search Students"
            density="compact"
            class="mb-4"
            prepend-inner-icon="tabler-search"
            clearable
          />

          <VTable v-if="filteredStudents.length">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in filteredStudents"
                :key="student.id"
              >
                <td>{{ student.fullName }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.phoneNumber || '-' }}</td>
                <td>
                  <VBtn
                    icon="tabler-trash"
                    color="error"
                    variant="text"
                    size="small"
                    @click="handleRemoveStudent(student.id)"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
          <VAlert
            v-else
            type="info"
            variant="tonal"
            text="No students found"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style scoped>
.stat-card {
  min-inline-size: 200px;
}
</style>
