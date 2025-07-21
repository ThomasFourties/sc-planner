export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.API_URL

  const api = (url: string, options: any = {}) => {
    return $fetch(url, {
      baseURL,
      ...options
    })
  }

  return { api }
}
