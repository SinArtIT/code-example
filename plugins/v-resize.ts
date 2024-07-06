export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("resize", {
    mounted: function (el: HTMLDivElement, binding: any) {
      binding.dir.f = function (evt: Event) {
        binding.value(evt, el);
      };
      window.addEventListener("resize", binding.dir.f);
    },
    unmounted: function (el: HTMLDivElement, binding: any) {
      window.removeEventListener("resize", binding.dir.f);
    }
  });
});
