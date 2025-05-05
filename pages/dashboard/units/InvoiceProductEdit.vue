<script setup>
const clients = ref([])
</script>

<template>
  <VCard class="pa-6 pa-sm-12">
    <VRow>
      <VCol>
        <h6 class="text-h6 mb-4">Invoice To:</h6>
        <VSelect
          v-model="invoice.client"
          :items="clients"
          item-title="name"
          item-value="name"
          placeholder="Select Client"
          return-object
          class="mb-4"
        />
        <p class="mb-0">{{ invoice.client.name }}</p>
        <p class="mb-0">{{ invoice.client.company }}</p>
        <p v-if="invoice.client.address" class="mb-0">
          {{ invoice.client.address }}, {{ invoice.client.country }}
        </p>
        <p class="mb-0">{{ invoice.client.contact }}</p>
        <p class="mb-0">{{ invoice.client.companyEmail }}</p>
      </VCol>
    </VRow>

    <VDivider class="my-6 border-dashed" />

    <div>
      <h6 class="text-h6 mb-2">Note:</h6>
      <VTextarea v-model="note" placeholder="Write note here..." :rows="2" />
    </div>
  </VCard>
</template>
