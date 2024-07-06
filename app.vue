<template>
  <div class="app" :class="{ 'app--bg-gray': isBackgroundGray }">
    <NuxtLayout class="app__layout">
      <template v-if="!isRequest">
        <PageHeader class="app__header" :about="about" />
        <main class="app__main">
          <NuxtPage />
        </main>

        <AppNotification />
        <AppPromotion />
        <AppQuestionnaire v-if="!isPrereleaseCity" />
        <AppResponseModal />
        <AppFavoritesNotification />
        <AppModalFavoritesLimit />

        <PageFooter class="app__footer" :about="about" />
      </template>

      <AppLoader v-else class="app__loader"></AppLoader>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/store";
import { useCityStore } from "~/store/city";
import Api from "~/services/api";
import { NavItem } from "~/types";
import { ApiCityInfo, ApiCityList, ApiComplexList } from "~/types/api";
import getScriptArray, { ScriptType } from "~/services/get-script-array";

const route = useRoute();
const { meta } = toRefs(route);

const store = useStore();
const storeCity = useCityStore();

const isPrereleaseCity = computed(() => {
  return storeCity.getIsPrereleaseCity;
});

const apartmentFavoritesList = useCookie("apartmentFavoritesList", {
  encode: JSON.stringify,
  decode: JSON.parse,
  default: () => [],
  watch: true
});

const { setFavoritesStoreList } = useApartmentFavorites();
setFavoritesStoreList(apartmentFavoritesList.value);

const isRequest = ref(true);

const isBackgroundGray = computed<boolean>(() => {
  return !!meta.value?.isBgGray;
});

const about = computed<NavItem>(() => {
  const list = !isPrereleaseCity.value
    ? storeCity.getAboutList
    : storeCity.getAboutList?.filter(
        (item) =>
          item.name?.toLowerCase() !== "новости" &&
          item.name?.toLowerCase() !== "сданные объекты"
      );

  return {
    name: "О компании",
    list
  };
});

const dataCity = ref<ApiCityInfo | undefined>(undefined);

const yandexMetricScript = computed(() => {
  return {
    vmid: "yandex-metrika",
    innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(${storeCity.yandex_metrika_id}, 'init', {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`
  };
});

const yandexMetricNoScript = computed(() => {
  return {
    vmid: "yandex-metrika-no-script",
    innerHTML: `<div><img src="https://mc.yandex.ru/watch/${storeCity.yandex_metrika_id}" style="position:absolute; left:-9999px;" alt="" /></div>`,
    type: "noscript"
  };
});

const scriptsData = computed<ScriptType[]>(() => {
  if (!dataCity.value?.data?.city) {
    return [];
  }
  return [
    ...getScriptArray(dataCity.value.data.city.script, {
      uniqueKey: "globalScript"
    }),
    yandexMetricScript.value
  ];
});

const noscriptsData = computed<ScriptType[]>(() => {
  if (!dataCity.value?.data?.city) {
    return [];
  }
  return [
    ...getScriptArray(dataCity.value.data.city.script, {
      type: "noscript"
    }),
    yandexMetricNoScript.value
  ];
});

async function fetchInitialData(): Promise<{
  listResponse: { data: ApiCityList };
  complexResponse: { data: ApiComplexList };
}> {
  // Прямой запрос к API для получения списка городов
  const listResponse = (await Api.getCityList()) as {
    data: { data: ApiCityList };
  };
  const complexResponse = (await Api.getComplexList()) as {
    data: { data: ApiComplexList };
  };

  storeCity.setCityList(listResponse?.data?.data || []);
  storeCity.setComplexList(complexResponse?.data?.data);

  const cityData = await updateCity();
  dataCity.value = cityData?.data;
  const tempDataCity = cityData?.data?.data;

  if (tempDataCity?.city) storeCity.setCity(tempDataCity.city);
  if (tempDataCity?.working_hours)
    storeCity.setWorkingHours(tempDataCity.working_hours);
  if (tempDataCity?.complexes)
    storeCity.setComplexCityList(tempDataCity.complexes);

  storeCity.setIsCityReady(true);
  const ym_id = dataCity.value?.data?.city?.ym_number;
  storeCity.setYandexMetrika(ym_id);

  return {
    listResponse: listResponse.data,
    complexResponse: complexResponse.data
  };
}

async function updateCity(): Promise<{ data: ApiCityInfo } | null> {
  const id = storeCity.getCityId;
  storeCity.setIsCityReady(false);

  try {
    const cityResponse = (await Api.getCityInfo({
      city_id: id
    })) as { data: ApiCityInfo };

    storeCity.setIsCityReady(true);

    if (!cityResponse.data) {
      return null;
    }

    return cityResponse;
  } catch (error) {
    storeCity.setIsCityReady(true);
    return null;
  }
}

const { refresh } = await useAsyncData("fetchInitialData", fetchInitialData);

isRequest.value = false;

watch(
  () => storeCity.current_city_label,
  (newVal, prevVal) => {
    if (newVal && newVal !== prevVal) {
      refresh();
    }
  }
);

onMounted(() => {
  let vh: number = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  window.addEventListener("resize", () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
});

const YANDEX_VERIFICATION_OPTIONS = {
  "1": "90b687d68e6b1c6a",
  "4": "fa7742e4219b378d"
};

const yandexMetaContent = computed<string>(() => {
  const cityId = storeCity.getCityId?.toString();

  return cityId in YANDEX_VERIFICATION_OPTIONS
    ? YANDEX_VERIFICATION_OPTIONS[
        cityId as keyof typeof YANDEX_VERIFICATION_OPTIONS
      ]
    : "";
});

const metaList = computed<object[]>(() => {
  const arr = [
    {
      "http-equiv": "cache-control",
      content: "no-cache, no-store, must-revalidate"
    },
    {
      "http-equiv": "Pragma",
      content: "no-cache"
    },
    {
      "http-equiv": "Expires",
      content: "0"
    },
    { name: "theme-color", content: "#ffffff" }
  ];

  if (yandexMetaContent.value && process.client)
    arr.push({
      hid: "yandex-verification",
      name: "yandex-verification",
      content: yandexMetaContent.value
    });

  return arr;
});

useHead({
  htmlAttrs: {
    class: {
      body: true,
      overflow: () =>
        store.hasActiveModals ||
        store.is_filter_active ||
        store.isMobileMenuOpen
    }
  },
  title: "",
  meta: () => metaList.value,
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com"
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    },
    {
      rel: "shortcut icon",
      type: "image/vnd.microsoft.icon",
      href: "/favicons/favicon.ico"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-60x60.png",
      sizes: "60x60"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-96x96.png",
      sizes: "96x96"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-120x120.png",
      sizes: "120x120"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-144x144.png",
      sizes: "144x144"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-180x180.png",
      sizes: "180x180"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/favicon-256x256.png",
      sizes: "256x256"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-256x256.png",
      sizes: "256x256"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-192x192.png",
      sizes: "192x192"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-180x180.png",
      sizes: "180x180"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-144x144.png",
      sizes: "144x144"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-120x120.png",
      sizes: "120x120"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-96x96.png",
      sizes: "96x96"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-32x32.png",
      sizes: "32x32"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-16x16.png",
      sizes: "16x16"
    }
  ],
  script: () => unref(scriptsData.value),
  noscript: () => unref(noscriptsData.value)
});
</script>

<style lang="less">
.app {
  background-color: @white;

  &__layout {
    display: flex;
    flex-direction: column;

    min-height: 100vh;
  }

  &--bg-gray {
    background-color: @light_gray2;
  }

  &__header {
    height: var(--header-height);
  }

  &__main {
    padding-top: var(--header-height);
    flex: 1 0 auto;

    overflow-x: clip;
  }

  &__footer {
    flex: 0 0 auto;
  }
}
</style>
