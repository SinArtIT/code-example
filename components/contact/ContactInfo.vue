<template>
  <div class="contact-info">
    <div class="contact-info__block-left">
      <h4 v-if="address" class="contact-info__title title">
        {{ address }}
      </h4>

      <div
        v-if="textBLockList?.length"
        class="contact-info__text-block-container"
      >
        <div
          v-for="(item, index) in textBLockList"
          :key="index"
          class="contact-info__text-block"
        >
          <p class="contact-info__text-block-title">
            {{ item.label }}
          </p>

          <a class="contact-info__text-block-link" :href="item.link">
            {{ item.value }}
          </a>
        </div>
      </div>

      <div
        v-if="schedule"
        class="contact-info__schedule"
        v-html="schedule"
      ></div>
    </div>

    <div v-if="showMap" class="contact-info__block-right">
      <ContactInfoMap class="contact-info__map" :markers="markers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContactInfoData, ContactMapMarker } from "~/types/contact";

interface IProps {
  data: ContactInfoData;
}

const props = defineProps<IProps>();
const { data } = toRefs(props);

type TextBlock = {
  label: string;
  link: string;
  value: string;
};

const address = computed<string>(() => {
  return data.value?.address || "";
});

const schedule = computed<string>(() => {
  return data.value?.schedule || "";
});

const markers = computed<ContactMapMarker[]>(() => {
  return data.value?.markers || [];
});

const textBLockList = computed<TextBlock[]>(() => {
  const arr: TextBlock[] = [];

  if (data.value?.receptionPhone)
    arr.push({
      label: "Приемная",
      value: data.value?.receptionPhone,
      link: `tel:${data.value?.receptionPhone}`
    });
  if (data.value?.salesPhone)
    arr.push({
      label: "Отдел продаж",
      value: data.value?.salesPhone,
      link: `tel:${data.value?.salesPhone}`
    });
  if (data.value?.email)
    arr.push({
      label: "Эл. почта",
      value: data.value?.email,
      link: `mailto:${data.value?.email}`
    });

  return arr;
});

const showMap = computed<boolean>(() => {
  return !!markers.value?.length;
});
</script>

<style lang="less">
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px 0;

  padding: 32px 16px;

  border-radius: 16px;

  background-color: @light_gray2;

  @media @w1020 {
    flex-direction: unset;
    gap: 0 24px;
    align-items: center;

    padding: 24px 24px 24px 40px;
  }

  &__block-left {
    display: flex;
    flex-direction: column;
    gap: 24px 0;

    @media @w1020 {
      flex: 1;
    }

    @media @w1340 {
      flex: 2;
    }
  }

  &__text-block-container {
    display: flex;
    flex-direction: column;
    gap: 16px 0;

    @media @w1340 {
      flex-direction: unset;
      flex-wrap: wrap;
      gap: 16px 24px;
    }
  }

  &__text-block {
    @media @w1340 {
      display: inline-block;

      &:nth-child(2) {
        flex: 1;
      }

      &:nth-child(3) {
        width: 100%;
      }
    }
  }

  &__text-block-title {
    margin-bottom: 8px;

    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
  }

  &__text-block-link {
    line-height: 19px;
    font-size: 16px;
    font-weight: 500;
    color: @brand_green;
  }

  &__schedule {
    line-height: 18px;
    font-size: 13px;
    font-weight: 400;
    color: @gray_60;
    white-space: pre-wrap;
  }

  &__block-right {
    position: relative;

    width: 100%;

    &::before {
      content: "";
      display: block;

      width: 100%;
      padding-bottom: 69.5%;
    }

    @media @w1020 {
      flex: 2;
    }
  }

  &__map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
