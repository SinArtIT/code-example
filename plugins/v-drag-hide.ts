export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("drag-hide", {
    mounted: function (el: HTMLDivElement, binding: any) {
      const target = document.querySelector(binding.value?.target) || el;
      let startY = 0;
      let offsetY = 0;

      binding.dir.target = target;
      el.style.transition = "transform 0.3s";

      binding.dir.eStart = function (te: TouchEvent) {
        startY = te.targetTouches[0].clientY;
      };
      binding.dir.eMove = function (te: TouchEvent) {
        const offset = te.targetTouches[0]?.clientY - startY;

        if (offset > 0) {
          offsetY = offset;
          el.style.transform = `translateY(${offset}px)`;
        }
      };
      binding.dir.eEnd = function (te: TouchEvent) {
        el.style.transform = "";

        if (offsetY > 100) {
          binding.value.callback();
        }
      };

      target.addEventListener("touchstart", binding.dir.eStart);
      target.addEventListener("touchmove", binding.dir.eMove);
      target.addEventListener("touchend", binding.dir.eEnd);
    },
    unmounted: function (el: HTMLDivElement, binding: any) {
      binding.dir.target.removeEventListener("touchstart", binding.dir.eStart);
      binding.dir.target.removeEventListener("touchmove", binding.dir.eMove);
      binding.dir.target.removeEventListener("touchend", binding.dir.eEnd);
    }
  });
});
