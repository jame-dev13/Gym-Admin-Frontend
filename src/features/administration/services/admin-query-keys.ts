export const getAdminQueryKeys = () => ({
  domain: () => ["administration"] as const,
  all: () => [...getAdminQueryKeys().domain(), "all"] as const,
  overview: () => [...getAdminQueryKeys().domain(), "overview"] as const,
  insights: () => [...getAdminQueryKeys().domain(), "insights"] as const,
});
