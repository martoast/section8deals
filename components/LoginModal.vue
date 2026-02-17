<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75" v-if="!isAuthenticated">
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Login</h2>
        <form @submit.prevent="checkPassword">
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" type="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
          <div class="flex justify-end">
            <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Login</button>
          </div>
        </form>
        <p v-if="loginError" class="mt-4 text-red-600">Incorrect password. Please try again.</p>
      </div>
    </div>
  </template>
  
  <script setup>

  const password = ref('')
  const isAuthenticated = ref(false)
  const loginError = ref(false)
  const authCookie = useCookie('auth', { maxAge: 3600 })
  
  const hardcodedPassword = 'xx' // Replace with your desired password
  
  const checkPassword = async () => {
    if (password.value === hardcodedPassword) {
      authCookie.value = true
      isAuthenticated.value = true
      loginError.value = false
      await navigateTo('/admin')
    } else {
      loginError.value = true
    }
  }
  
  isAuthenticated.value = !!authCookie.value
  </script>
  