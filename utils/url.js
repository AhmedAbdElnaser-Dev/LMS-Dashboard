export const url = (route) => {
  const config = useRuntimeConfig();
  return `${config.public.apiBaseUrl}/uploads/${route.replace(/^\/+/, '')}`;
};
