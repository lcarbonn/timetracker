<template>
  <UModal v-model:open="isOpen" :title="title" :description="description">
    <template #footer="{ close }">
      <UButton label="Cancel" color="info" @click="onCancel"/>
      <UButton label="Ok" @click="emit('onOk')" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
    // props
  const props = defineProps<{
      title: string;
      description: string;
      open:boolean;
    }>()

  // emits declaration
  const emit = defineEmits<{
    onOk: [];
    onCancel: [];
  }>()

  const isOpen = ref(false)

  watchEffect(() => {
    isOpen.value = props.open
  })

  const onCancel = () => {
    close()
    emit('onCancel')
  }
</script>