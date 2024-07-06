<template>
  <div class="contact">
    <div class="contact__container">
      <header class="contact__header">
        <AppBreadcrumbs class="contact__breadcrumbs" :list="breadCrumbs" />

        <h1 class="contact__title title">
          {{ title }}
        </h1>
      </header>

      <ContactInfo class="contact__section" :data="dataInfo" />

      <section v-if="addressList?.length" class="contact__section">
        <h3 class="title contact__section-title">Как до нас добраться</h3>

        <ContactAddressList :list="addressList" />
      </section>

      <section v-if="employeeList" class="contact__section">
        <h3 class="title contact__section-title">
          Свяжитесь с руководителем отделов
        </h3>

        <nav class="contact__section-nav">
          <div class="contact__section-nav-container">
            <button
              v-for="(btn, key) in employeeList"
              :key="key"
              class="contact__section-nav-item"
              :class="{
                'contact__section-nav-item--active': key === currentFormId
              }"
              type="button"
              @click="setCurrentFormId(key)"
            >
              {{ btn.nav }}
            </button>
          </div>
        </nav>

        <div class="contact__feedback-block">
          <transition name="fade_06">
            <ContactFeedbackForm
              v-if="currentFormInfo"
              :key="currentFormId"
              class="contact__feedback"
              :data="currentFormInfo"
            />
          </transition>
        </div>
      </section>
    </div>

    <ContactSeoBlock :data="seoBlockData" />
  </div>
</template>

<script setup lang="ts">
import {
  ContactAddressItem,
  ContactFeedbackItem,
  ContactInfoData,
  ContactMapMarker,
  ContactSeoBlockData
} from "~/types/contact";
import Api from "~/services/api";
import { ApiContactInfo, ApiContactInfoFormItem, ApiSeo } from "~/types/api";
import { BreadcrumbsItem, OfficeItem } from "~/types";
import { useCityStore } from "~/store/city";

const storeCity = useCityStore();

const dataContact = ref<ApiContactInfo | null>(null);

const seoData = computed<ApiSeo>(() => {
  const locData = dataContact.value?.seo;
  return {
    title: locData?.title || "",
    keywords: locData?.keywords || "",
    description: locData?.description || ""
  };
});

getData();

const dataInfo = computed<ContactInfoData>(() => {
  const data = dataContact.value;
  const markers: ContactMapMarker[] = storeCity.getOffices?.map(
    (item: OfficeItem) => {
      return {
        label: item.label,
        address: item.address,
        phone: item.phone,
        lat: item.lat_lng?.split(",")[0],
        lng: item.lat_lng?.split(",")[1]
      };
    }
  );

  return {
    address: data?.address,
    salesPhone: data?.sales_phone,
    receptionPhone: data?.reception_phones,
    email: data?.email,
    schedule: data?.timetable,
    markers: markers || []
  };
});

const title = computed<string>(() => {
  return `Контакты офиса${
    storeCity.getCityName ? " в городе " + storeCity.getCityName : ""
  }`;
});

const breadCrumbs = computed<BreadcrumbsItem[]>(() => {
  const arr: { name: string; path: string }[] = [
    {
      name: title.value,
      path: ""
    }
  ];

  return arr;
});

const addressList = computed<ContactAddressItem[]>(() => {
  const arr = storeCity.getOffices || [];

  return arr.map((item: OfficeItem) => {
    return {
      title: item.label,
      address: item.address,
      schedule: item.timetable,
      link: item.link,
      phone: item.phone
    };
  });
});

const employeeList = computed<Record<string, ContactFeedbackItem> | undefined>(
  () => {
    const arr = dataContact.value?.forms || [];
    const obj: Record<string, ContactFeedbackItem> = {};

    arr.forEach((item: ApiContactInfoFormItem, index: number) => {
      if (item.manager) {
        obj[index] = {
          title: item.form_label,
          nav: item.nav_label,
          employee: {
            id: item.manager?.id,
            name: item.manager?.fio,
            hasManager: !!item.manager,
            image: item.manager?.image,
            position: item.manager?.job_position,
            phone: item.manager?.phone
          }
        };
      }
    });

    return Object.keys(obj)?.length ? obj : undefined;
  }
);

const currentFormId = ref<string | null>(null);

function setCurrentFormId(id: string) {
  if (!id) return;

  currentFormId.value = id;
}

async function getData() {
  const { data } = await Api.getContactInfo(storeCity.getCityId);

  if (data?.data) dataContact.value = data.data;
}

const currentFormInfo = computed<ContactFeedbackItem | undefined>(() => {
  const id = currentFormId.value;

  return id && employeeList.value && id in employeeList.value
    ? employeeList.value[id]
    : undefined;
});

const seoBlockData = computed<ContactSeoBlockData>(() => {
  let link = "";
  try {
    link = window.location.href;
  } catch (e) {}

  return {
    link,
    title: seoData.value.title,
    street: storeCity.getAddress,
    cityName: storeCity.getCityName,
    phone: storeCity.getPhone,
    postalCode: storeCity.getPostalCode,
    country: "RU"
  };
});

watch(
  () => employeeList.value,
  (val) => {
    if (val && typeof val === "object" && Object.keys(val)?.length)
      currentFormId.value = Object.keys(val)[0];
  },
  {
    deep: true,
    immediate: true
  }
);

useHead({
  title: () => seoData.value.title,
  meta: [
    { name: "description", content: () => seoData.value.description },
    { name: "keywords", content: () => seoData.value.keywords }
  ]
});

definePageMeta({
  pageTransition: false
});
</script>

<style lang="less">
.contact {
  &__container {
    .container();

    margin-bottom: 32px;

    @media @w1020 {
      margin-bottom: 64px;
    }
  }

  &__header {
    margin-bottom: 26px;
  }

  &__breadcrumbs {
    margin-bottom: 16px;
  }

  &__section {
    &:not(:last-child) {
      margin-bottom: 32px;

      @media @w1020 {
        margin-bottom: 64px;
      }
    }
  }

  &__section-title {
    margin-bottom: 24px;

    @media @w1020 {
      margin-bottom: 32px;
    }
  }

  &__section-nav {
    width: 100%;
  }

  &__section-nav-container {
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    gap: 0 8px;

    width: 100%;
    margin-bottom: 24px;
    padding-top: 10px;
    padding-bottom: 10px;

    user-select: none;
    .horizontal-scroll();
  }

  &__section-nav-item {
    display: block;

    padding: 0 16px;

    border-radius: 32px;

    background-color: @light_gray2;

    line-height: 32px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    color: @black;

    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;

    &:hover {
      @media (hover: hover) {
        background-color: @brand_green;
        color: @white;
      }
    }

    &:active,
    &--active {
      background-color: @brand_green;
      color: @white;
    }
  }

  &__feedback-block {
    position: relative;
  }

  &__feedback {
    box-sizing: border-box;
    width: 100%;
  }
}
</style>
