<template>
    <UPageCard>
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit">
        <template #password-hint>
          <ULink class="text-primary font-medium" tabindex="-1" :to="baseUrl+'/forgot-password'" target="_blank">Forgot password?</ULink>
        </template>
      </UAuthForm>
    </UPageCard>
</template>

<script setup lang="ts">
  import * as z from 'zod'
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

  const config = useRuntimeConfig()
  const baseUrl = computed(() => {
    return config.public.baseApiUrl
  })

  const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }]


  const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters')
  })

  type Schema = z.output<typeof schema>

  function onSubmit(payload: FormSubmitEvent<Schema>) {
      signInUser(payload.data.email, payload.data.password)
  }
</script>
