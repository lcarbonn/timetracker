<template>
    <div>
      <BCard :title="'Users '" body-class="text-center">
      </BCard>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'auth'
  })

  const { user } = useUserSession()


</script>