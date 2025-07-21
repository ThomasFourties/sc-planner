export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie(event, 'auth-token')}`
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText
      })
    }

    return await response.json()
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la récupération des tâches du projet'
    })
  }
}) 