export default defineNuxtRouteMiddleware((to) => {
  const hasTrailingSlash = /\/+$/.test(to.path);

  if (!hasTrailingSlash || to.path === "/") return;

  const newPath = to.path.replace(/\/+$/, "");

  return navigateTo(newPath || "/", { redirectCode: 301 });
});
