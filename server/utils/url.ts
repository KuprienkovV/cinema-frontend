export function getServerUrl(path: string) {
  const { public: { apiBase } } = useRuntimeConfig()
  return new URL(path, apiBase as string).toString()
}