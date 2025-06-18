import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const response = await $fetch(`${config.public.API_URL}/users`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}) 