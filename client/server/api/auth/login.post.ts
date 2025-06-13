import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const response = await $fetch(`${config.public.API_URL}/auth/login`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}) 