<template>
  <UModal v-model:open="open.show" :title="title" :description="description">
    <template #footer>
      <UButton label="Cancel" color="info" @click="onCancel"/>
      <UButton label="Ok" @click="onOk" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
    // props
  const props = defineProps<{
      title: string;
      description: string;
      open:ModalShow;
    }>()

  // emits declaration
  const emit = defineEmits<{
    onOk: [];
    onCancel: [];
  }>()

  const onCancel = () => {
    props.open.show = !props.open.show
    emit('onCancel')
  }
  const onOk = () => {
    emit('onOk')
  }
</script>
