<template>
  <div class="home">
    <div
      class="home__preview"
      :style="{
        backgroundImage: `url('${mainImage}')`
      }"
    >
      <div class="home__preview-block">
        <div class="home__preview-container">
          <h1 class="hidden-title">
            {{ titleHidden }}
          </h1>

          <h2 class="home__preview-title title">
            {{ mainTitle }}
          </h2>

          <div class="home__preview-btn-block">
            <button
              class="home__preview-btn"
              type="button"
              @click="linkTo('about')"
            >
              Миссия
            </button>

            <button
              class="home__preview-btn"
              type="button"
              @click="linkTo('team')"
            >
              Наша команда
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="home__advantages">
      <div class="home__advantages-list">
        <div
          v-for="(item, index) in advantages"
          :key="index"
          class="home__advantages-item"
        >
          <p
            class="home__advantages-item-text home__advantages-item-text--accent"
          >
            {{ item.accent }}
          </p>

          <p class="home__advantages-item-text">
            {{ item.text }}
          </p>
        </div>
      </div>

      <div ref="videoBlock" class="home__advantages-video-block">
        <iframe
          v-if="isVideoBlockVisible"
          :key="videoLink + isMedia768"
          :src="videoLink"
          frameborder="0"
          loading="lazy"
          class="home__advantages-video"
        ></iframe>
      </div>
    </div>

    <HomePaymentMethods
      v-if="paymentList?.length"
      class="home__payments"
      :list="paymentList"
    />

    <div v-if="projectsData?.length" class="home__projects-block">
      <HomeProjects
        class="home__projects"
        :list="projectsData"
        :show-map-permanently="true"
        :title="isPrereleaseCity ? 'Перспективные проекты' : 'Наши проекты'"
        :is-map-hidden="isPrereleaseCity"
        :hide-info="isPrereleaseCity"
        :no-image-overlay="isPrereleaseCity"
      />
    </div>

    <div v-if="othersData" class="home__others-block">
      <HomeOthers class="home__others" :data="othersData" />
    </div>

    <div class="home__feedback-block">
      <AppFeedback
        class="home__feedback"
        :is-gray="isMobile"
        :yandex-event="['all_forms', 'home_callback']"
        form-description="Город_Блок Нужна консультация"
      >
        <template v-if="isPrereleaseCity" #title>
          Хочу узнать о старте
          <br />продаж первым
        </template>
        <template v-if="isPrereleaseCity" #button-text>
          Оставить заявку
        </template>
        <template v-if="isPrereleaseCity" #success-notification-text>
          Спасибо. Ваша заявка принята. Мы свяжемся с вами перед стартом продаж.
        </template>
      </AppFeedback>
    </div>

    <AppApps v-if="!isPrereleaseCity" class="home__apps" />

    <div v-if="!isPrereleaseCity" class="home__news-block">
      <HomeNews class="home__news" :list="newsData" />
    </div>

    <HomeSeoBlock :data="seoBlockData" />
  </div>
</template>

<script setup lang="ts">
import Api from "~/services/api";
import {
  ApiCityData,
  ApiCityDataComplex,
  ApiCityDataNews,
  ApiCityDataPayments,
  ApiSeo
} from "~/types/api";
import {
  HomeOthersData,
  HomePaymentMethodsItem,
  HomeSeoBlockData
} from "~/types/home";
import { useCityStore } from "~/store/city";
import { useStore } from "~/store";
import HomeSeoBlock from "~/components/home/HomeSeoBlock.vue";
import { VK_LINKS } from "~/constants";

const app = useNuxtApp();
const { $emitter, $ls } = app;

const storeCity = useCityStore();
const store = useStore();

const isPrereleaseCity = computed(() => {
  return storeCity.getIsPrereleaseCity;
});

type AdvantagesItem = {
  accent: string;
  text: string;
};

const route = useRoute();

const isMobile = ref<boolean>(false);
const isMedia768 = ref<boolean>(false);

const cityData = ref<ApiCityData | null>(null);

const videoBlock = ref<HTMLDivElement | null>(null);
const isVideoBlockVisible = ref<boolean>(false);

const seoData = computed<ApiSeo>(() => {
  const locData = cityData.value?.seo;
  return {
    title: locData?.title || "",
    keywords: locData?.keywords || "",
    description: locData?.description || ""
  };
});

const titleHidden = computed<string>(() => {
  return `Купить квартиру в городе ${storeCity.getCityName}`;
});

getCityData(storeCity.getCityId);

const mainImage = computed<string>(() => {
  return cityData.value?.common_info?.image || "";
});

const mainTitle = computed<string>(() => {
  return cityData.value?.common_info?.header || "";
});

const advantages: AdvantagesItem[] = [
  {
    accent: "22 года",
    text: "на рынке"
  },
  {
    accent: "3,2 млн м²",
    text: "портфель проектов"
  },
  {
    accent: "37 тыс.",
    text: "человек живут в наших домах"
  },
  {
    accent: "12",
    text: "городов присутствия"
  }
];

const paymentList = computed<HomePaymentMethodsItem[]>(() => {
  if (
    !cityData.value?.payment_methods ||
    !cityData.value?.payment_methods?.length
  )
    return [];

  const types = ["mortgage", "change", "installment"];

  return cityData.value.payment_methods
    .sort(
      (curItem: ApiCityDataPayments, nextItem: ApiCityDataPayments) =>
        curItem.position - nextItem.position
    )
    .map((item: ApiCityDataPayments, index: number) => {
      const type = types.includes(item.type) ? item.type : "mortgage";

      return {
        id: item.title + index.toString(),
        title: item.header,
        text: item.text,
        type,
        modalText: item.modal_text,
        modalTitle: item.modal_header
      };
    });
});

const projectsData = computed<ApiCityDataComplex[]>(() => {
  if (!cityData.value?.complexes || !cityData.value?.complexes?.length)
    return [];

  return cityData.value.complexes;
});

const othersData = computed<HomeOthersData | undefined>(() => {
  if (
    !cityData.value?.parkings?.length &&
    !cityData.value?.pantries?.length &&
    !cityData.value?.commerce?.length
  )
    return undefined;

  return {
    parking: !!cityData.value?.parkings?.length,
    pantries: !!cityData.value?.pantries?.length,
    commerce: !!cityData.value?.commerce?.length
  };
});

const newsData = computed<ApiCityDataNews[]>(() => {
  if (!cityData.value?.news || !cityData.value?.news?.length) return [];

  return cityData.value.news;
});

const videoLink = computed<string>(() => {
  const baseLink =
    "https://www.youtube.com/embed/lkmh8GfA5-8?si=dH2Qby4pJqBbzpXv";

  return isMedia768.value ? baseLink + ";controls=0" : baseLink;
});

const seoBlockData = computed<HomeSeoBlockData>(() => {
  let link = "";
  try {
    link = window.location.href;
  } catch (e) {}

  return {
    link,
    title: seoData.value.title,
    street: storeCity.getAddress,
    postalCode: storeCity.getPostalCode,
    cityName: storeCity.getCityName,
    region: "Россия",
    country: "RU",
    phone: storeCity.getPhone,
    email: storeCity.getEmail,
    language: "Russian",
    socials: [VK_LINKS[storeCity.getCityId]]
  };
});

onMounted(() => {
  checkMedia();
  addEventListener("resize", checkMedia);

  videBlockIntersection();
  $ls?.increaseCurrentPageCount(route.path);

  window.addEventListener("beforeunload", () => {
    onBeforeUnload();
  });
  store.initQuestionnaire();
});

onBeforeUnmount(() => {
  $emitter.emit("closePromotion");
});

onUnmounted(() => {
  store.deInitQuestionnaire();

  removeEventListener("resize", checkMedia);
});

function onBeforeUnload() {
  $ls?.decreaseCurrentPageCount(route.path);
  $ls?.setCityDataHomePromotion(storeCity.getCityId, false);
}

function checkMedia() {
  if (!process.client) return;
  isMobile.value = window.matchMedia("(max-width: 1339px)").matches;
  isMedia768.value = window.matchMedia("(min-width: 768px)").matches;
}

async function getCityData(id: number) {
  const { data: requestData, error } = await useAsyncData(() =>
    Api.getCityData(id)
  );

  const data = requestData.value?.data;

  if (data && data.data) {
    cityData.value = data.data;

    const popup = data.data?.popup;

    if (!popup) return;

    const delay = storeCity.getCityId === 1 ? 90_000 : 180_000;

    $emitter.emit("showPromotion", {
      image: popup.image,
      time: popup.active_until,
      delay,
      yandexEvent: "promotion_modal_home"
    });
  }
}

function linkTo(link: string) {
  if (!process.client) return;

  const origin = window.location?.origin;
  window.location.href = origin + "/" + link;
}

function videBlockIntersection() {
  if (!videoBlock.value) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) isVideoBlockVisible.value = true;
      });
    },
    {
      root: null,
      threshold: 0
    }
  );

  observer.observe(videoBlock.value);
}

useHead({
  title: () => seoData.value.title,
  meta: [
    { name: "description", content: () => seoData.value.description },
    { name: "keywords", content: () => seoData.value.keywords }
  ]
});
</script>

<style lang="less">
.home {
  &__preview {
    width: 100%;
    height: calc((var(--vh, 1vh) * 80));

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;

    overflow: hidden;

    @media @w768 {
      min-height: calc((var(--vh, 1vh) * 80));
    }

    @media @w1170 {
      border-bottom-right-radius: 40px;
      border-bottom-left-radius: 40px;
    }
  }

  &__preview-block {
    width: 100%;
    height: 100%;

    background-color: @black2_30;
  }

  &__preview-container {
    .container();

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    height: 100%;
    width: 100%;

    padding-bottom: 16px;

    @media @w600 {
      padding-bottom: 24px;
    }

    @media @w1170 {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;

      padding-bottom: 40px;
    }
  }

  &__preview-title {
    color: @white;

    @media @w1170 {
      width: 100%;
      max-width: 640px;
    }
  }

  &__preview-btn-block {
    display: flex;
    flex-direction: column;
    gap: 16px 0;

    margin-top: 16px;

    @media @w600 {
      display: flex;
      flex-direction: row;
      gap: 0 16px;

      margin-top: 24px;
    }

    @media @w1170 {
      margin-left: 24px;
    }
  }

  &__preview-btn {
    box-sizing: border-box;

    width: 100%;
    height: 48px;

    padding: 0 32px;

    line-height: 48px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;

    background-color: @light_gray2;
    border-radius: 24px;

    cursor: pointer;

    @media @w600 {
      width: calc(50% - 8px);
    }

    @media @w1170 {
      width: auto;
      height: 60px;

      border-radius: 30px;

      line-height: 60px;
    }
  }

  &__advantages {
    .container();

    padding-top: 16px;
    margin-bottom: 32px;

    @media @w1020 {
      padding-top: 32px;
    }
  }

  &__advantages-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    margin-bottom: 16px;

    @media @w1170 {
      gap: 0 32px;

      margin-bottom: 32px;
    }
  }

  &__advantages-item {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 8px;

    width: calc(50% - 4px);

    padding: 16px;

    background-color: @light_gray2;
    border-radius: 16px;

    @media @w1170 {
      width: calc(25% - 24px);

      padding: 24px;
    }
  }

  &__advantages-item-text {
    line-height: 1.4;
    font-size: 14px;
    font-weight: 400;

    @media @w1170 {
      line-height: 22px;
      font-size: 16px;
    }

    &--accent {
      font-size: 24px;
      line-height: 1.4;
      font-weight: 600;
      color: @brand_green;

      @media @w1170 {
        line-height: 48px;
        font-size: 40px;
      }
    }
  }

  &__advantages-video-block {
    position: relative;

    display: flex;

    width: 100%;

    border-radius: 16px;

    overflow: hidden;

    &::before {
      content: "";
      display: block;

      width: 100%;
      padding-bottom: 37.5%;
    }
  }

  &__advantages-video {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }

  &__payments {
    .container();

    margin-bottom: 32px;
  }

  &__projects-block {
    background-color: @light_gray2;
    border-top-right-radius: 24px;
    border-top-left-radius: 24px;
  }

  &__projects {
    .container();

    padding-top: 32px;
    padding-bottom: 56px;

    @media @w1170 {
      padding-top: 64px;
    }
  }

  &__others-block {
    margin-top: -24px;
    padding-top: 32px;
    padding-bottom: 32px;

    border-top-left-radius: 24px;
    border-top-right-radius: 24px;

    background-color: @white;

    @media @w1020 {
      padding-top: 64px;
      padding-bottom: 115px;
    }
  }

  &__others {
    .container();
  }

  &__feedback-block {
    padding-bottom: 24px;

    border-top-left-radius: 24px;
    border-top-right-radius: 24px;

    background-color: @light_gray2;

    @media @w1020 {
      padding-bottom: 40px;
    }

    @media @w1170 {
      border-radius: 0;
    }

    @media @w1340 {
      padding-top: 64px;
    }
  }

  &__feedback {
    .container();
  }

  &__apps {
    padding-bottom: 10px;

    background-color: @light_gray2;

    @media @w1020 {
      padding-top: 92px;
    }
  }

  &__news-block {
    position: relative;

    padding-top: 8px;
    padding-bottom: 32px;

    background-color: @white;

    &::before {
      content: "";

      position: absolute;
      top: -24px;
      left: 0;

      display: block;

      width: 100%;
      height: 24px;

      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      background-color: @white;

      z-index: 1;

      @media @w1340 {
        border-top-left-radius: 40px;
        border-top-right-radius: 40px;
      }
    }

    @media @w1340 {
      padding-bottom: 64px;
    }
  }

  &__news {
    .container();
  }
}
</style>
