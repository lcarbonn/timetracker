<template>
    <BContainer>
        <BCard>
            <BForm @submit.prevent="login">
                <BFormGroup
                    id="input-email"
                    label="Email address:"
                    label-for="email"
                    description="You're baserow credentials"
                    >
                    <BFormInput
                        id="email"
                        v-model="credentials.email"
                        type="email"
                        placeholder="Enter email"
                        autocomplete="false"
                    />
                </BFormGroup>
                <BFormGroup
                    id="input-pwd"
                    label="Password:"
                    label-for="password"
                    >
                    <BFormInput
                        id="password"
                        v-model="credentials.password"
                        type="password"
                        placeholder="Enter password"
                        autocomplete="false"
                    />
                </BFormGroup>
                <BButton class="m-1" type="submit" variant="primary">Connexion</BButton>
                <BLink href="https://baserow.io/forgot-password" target="_blank">Forgot Password ?</BLink>
            </BForm>
        </BCard>
    </BContainer>
</template>
<script setup lang="ts">
    //local ref
    const credentials = reactive({
        email: '',
        password: '',
    })

    // emits declaration
    const emit = defineEmits(['submit'])

    const login = async () => {
        signInUser(credentials.email, credentials.password)
    }
</script>