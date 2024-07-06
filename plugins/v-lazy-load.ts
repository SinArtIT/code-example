export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("lazy-load", {
    mounted: function (el: HTMLDivElement, binding: any) {
      function loadImage() {
        const imageElement = Array.from(el.children)?.find((item: Node) => {
          return item.nodeName === "IMG";
        }) as HTMLImageElement | undefined;

        if (!imageElement) return;

        const image = new Image();
        image.src = imageElement.dataset.src || "";
        image.onload = () => {
          imageElement.src = image.src;
        };
      }

      if (window.IntersectionObserver) {
        createObserver();
      } else {
        loadImage();
      }

      function createObserver() {
        const options: IntersectionObserverInit = {
          root: null,
          threshold: 0
        };

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
      }

      function handleIntersect(entries: any, observer: any) {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(el);
          }
        });
      }
    }
  });
});
