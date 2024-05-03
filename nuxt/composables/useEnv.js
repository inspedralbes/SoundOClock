export const useEnv = () => {
  const config = useRuntimeConfig();
  const environment = config.public;

  return environment;
};
