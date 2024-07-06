<script setup lang="ts">
import { BreadcrumbsItem } from "~/types";
import Api from "~/services/api";
import { useCityStore } from "~/store/city";
import { ApiGuaranteeComplexItem, ApiGuaranteeData } from "~/types/api";

const storeCity = useCityStore();

const showForm = computed<boolean>(() => true);

const breadCrumbs = computed<BreadcrumbsItem[]>(() => {
  const list: { name: string; path: string }[] = [
    {
      name: "Прием гарантийных замечаний",
      path: ""
    }
  ];

  return list;
});

const guaranteeData = ref<ApiGuaranteeData | null>(null);

const {
  data,
  error,
  pending: isPageLoading
} = await useAsyncData(() => Api.getGuaranteeData(storeCity.getCityId));

isPageLoading.value = false;

if (error.value)
  showError({ statusCode: 500, statusMessage: "Ошибка сервера" });
if (!data.value?.data?.success)
  showError({ statusCode: 404, statusMessage: "Страница не найдена" });
if (data.value?.data?.data) guaranteeData.value = data.value.data.data;

const complexesData = computed<
  Record<string | number, ApiGuaranteeComplexItem> | undefined
>(() => {
  return guaranteeData.value?.complexes;
});

const employeeData = computed<
  | {
      id: string;
      image: string;
      name: string;
      position: string;
      phone: string;
      grade?: number;
      count?: number;
    }
  | undefined
>(() => {
  const engineer = guaranteeData.value?.engineer;
  const grades = guaranteeData.value?.grades;

  if (!engineer) return undefined;

  return {
    id: engineer.id,
    image: engineer.photo,
    name: engineer.last_name + " " + engineer.name,
    position: engineer.work_position,
    phone: engineer.work_phone,
    grade: grades?.grade,
    count: grades?.cnt
  };
});
</script>

<template>
  <div class="guarantee">
    <AppLoader v-if="isPageLoading" class="guarantee__loader" />

    <div class="guarantee__container">
      <header class="guarantee__header">
        <AppBreadcrumbs
          class="guarantee__header-breadcrumbs"
          :list="breadCrumbs"
        />

        <h1 class="guarantee__title title">Прием гарантийных замечаний</h1>

        <p v-if="showForm" class="guarantee__description">
          В течение 5 рабочих дней мы вам перезвоним или отправим письмо о
          предполагаемых сроках устранения замечания на указанный в заявлении
          email. Замечание будет устранено, если оно отнесено к категории
          гарантийного случая.
        </p>

        <p v-else class="guarantee__description guarantee__description--mb400">
          По замечаниям относительно обслуживания ЖК в Набережных Челнах,
          просьба обращаться напрямую в управляющую компанию.
          <br /><br />Контактные данные: 8 (8552) 91-08-15, ООО «Сервисная
          компания «ПроДом».
        </p>
      </header>

      <GuaranteeForm
        v-if="complexesData && showForm"
        class="guarantee__form"
        :complexes="complexesData"
      />

      <GuaranteeStaff v-if="employeeData && showForm" :data="employeeData" />

      <AppApps v-if="showForm" class="guarantee__apps" :is-guarantee="true" />
    </div>
  </div>
</template>

<style scoped lang="less">
.guarantee {
  position: relative;

  &__loader {
    z-index: 99;
  }

  &__container {
    .container();
  }

  &__header {
    margin-bottom: 24px;
  }

  &__header-breadcrumbs {
    margin-bottom: 16px;
  }

  &__title {
    margin-bottom: 32px;
  }

  &__description {
    margin-bottom: 32px;

    line-height: 19px;
    font-size: 14px;
    font-weight: 400;
    color: @black2_60;

    &--mb400 {
      margin-bottom: 400px;
    }
  }

  &__form {
    margin-bottom: 28px;

    @media @w768 {
      margin-bottom: 32px;
    }

    @media @w1170 {
      margin-bottom: 64px;
    }
  }

  &__apps {
    margin-top: 64px;

    border-radius: 24px;
    background-color: @light_gray2;
  }
}
</style>
