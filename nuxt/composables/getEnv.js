export const getEnv = () => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.SOCKET_URI;
};
