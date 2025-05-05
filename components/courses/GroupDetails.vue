<script setup>
import { ref } from 'vue'
import GroupInformation from './group/GroupInformation.vue'
import InstructorInformation from './group/InstructorInformation.vue'
import StudentsList from './group/StudentsList.vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['removeStudent', 'editTranslation', 'addStudents'])
const openPanels = ref([0, 1, 2])
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
          <GroupInformation
            :group="group"
            @edit-translation="lang => emit('editTranslation', lang)"
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <!-- Instructor Section -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Instructor</VExpansionPanelTitle>
        <VExpansionPanelText>
          <InstructorInformation :instructor="group.instructor" />
        </VExpansionPanelText>
      </VExpansionPanel>

      <!-- Students Section -->
      <VExpansionPanel>
        <VExpansionPanelTitle>Students</VExpansionPanelTitle>
        <VExpansionPanelText>
          <StudentsList
            :students="group.students"
            @remove-student="studentId => emit('removeStudent', studentId)"
            @add-students="() => emit('addStudents')"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style>
.stat-card {
  min-inline-size: 200px;
}

.v-card--variant-elevated {
  box-shadow: 0 !important;
}
</style>
