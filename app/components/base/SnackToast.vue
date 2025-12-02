<template>
    <!-- to unable warning -->
    <span hidden></span>
</template>
<script setup lang="ts">

    const toast = useToast()
    const snackbarMessage = useSnackBarMessage()

    // watch the message
    watch(() => snackbarMessage.value, (newMessage) => {
      if(newMessage?.message != "") {
        if(newMessage.isError)
            toast.add({
                title:'Error',
                description: ''+newMessage.message ,
                color:'error',
                icon:'mdi-error'
            })
        else
            toast.add({
                title:'Noco Lowco Time Tracker',
                description: ''+newMessage.message,
                color:'primary',
                icon:'mdi-information'
            })
      }
    })
</script>