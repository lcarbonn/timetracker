<template>
    <BNavItemDropdown right>
        <template #button-content>
            <em>
            <Moon v-if="mode=='dark'"/>
            <Sun v-if="mode=='light'"/>
            <Auto v-if="mode=='auto'"/>
            </em>
        </template>
        <BDropdownItem @click="changeColor('light')" variant="primary"><Sun/> light</BDropdownItem>
        <BDropdownItem @click="changeColor('dark')" variant="primary"><Moon/> dark</BDropdownItem>
        <BDropdownItem @click="changeColor('auto')" variant="primary"><Auto/> auto</BDropdownItem>
    </BNavItemDropdown>
</template>
<script setup lang="ts">

  // color mode
  import {useColorMode} from 'bootstrap-vue-next'
  // icons
  import Sun from '~icons/bi/sun'
  import Moon from '~icons/bi/moon-stars'
  import Auto from '~icons/bi/circle-half'

  const mode = useColorMode({persist:true})
  const emit = defineEmits(['clicked'])

  // change the theme : dark, light, auto
  const changeColor = (theme:string) => {
    mode.value = theme
    emit('clicked')
  }

</script>