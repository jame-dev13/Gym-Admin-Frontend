export const pathBuilder = {
  detail: (base: string, detail: unknown) => `${base}/${detail}`,
  action: (base: string, detail: unknown, action: string) =>
    `${base}/${detail}/${action}`,
};
