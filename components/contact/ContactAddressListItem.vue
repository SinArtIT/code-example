<template>
  <div class="contact-address-list-item">
    <p v-if="data?.title" class="contact-address-list-item__title">
      {{ data.title }}
    </p>

    <p v-if="data?.address" class="contact-address-list-item__address">
      {{ data.address }}
    </p>

    <a
      v-if="data.phone"
      class="contact-address-list-item__phone"
      :href="`tel:${data.phone}`"
    >
      {{ data.phone }}
    </a>

    <p v-if="data?.schedule" class="contact-address-list-item__schedule">
      <span class="contact-address-list-item__schedule--title"
        >Режим работы:</span
      >
      <br />{{ data.schedule }}
    </p>

    <NuxtLink
      v-if="data?.link"
      :to="data?.link"
      target="_blank"
      rel="nofollow noopener noreferrer"
      class="contact-address-list-item__btn"
    >
      <AppSvgIcon
        class="contact-address-list-item__btn-icon"
        name="map-point"
      />
      На карте
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ContactAddressItem } from "~/types/contact";

interface IProps {
  data: ContactAddressItem;
}

defineProps<IProps>();
</script>

<style lang="less">
.contact-address-list-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  padding: 24px;

  border-radius: 30px;
  background-color: @light_gray2;

  &__title {
    margin-bottom: 8px;

    line-height: 20px;
    font-size: 14px;
    font-weight: 400;

    @media @w1020 {
      line-height: 22px;
      font-size: 16px;
    }
  }

  &__address {
    margin-bottom: 16px;

    line-height: 23px;
    font-size: 19px;
    font-weight: 600;

    @media @w1020 {
      line-height: 26px;
      font-size: 22px;
    }
  }

  &__schedule {
    padding-bottom: 16px;

    line-height: 18px;
    font-size: 13px;
    font-weight: 400;
    white-space: pre-wrap;

    @media @w1020 {
      line-height: 17px;
      font-size: 14px;
    }

    &--title {
      line-height: 2;
      font-size: 16px;
      font-weight: 500;
    }
  }

  &__phone {
    margin-bottom: 10px;

    color: @brand_green;

    cursor: pointer;
  }

  &__btn {
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 40px;

    margin-top: auto;

    border: 1px solid @brand_gray;
    border-radius: 20px;

    line-height: 19px;
    font-size: 16px;
    font-weight: 500;

    transition: border-color 0.3s, color 0.3s;

    &:hover {
      @media (hover: hover) {
        border-color: @brand_green;
        color: @brand_green;
      }
    }

    &:active {
      border-color: @brand_green;
      color: @brand_green;
    }

    @media @w1020 {
      max-width: 180px;
      height: 56px;

      border-radius: 28px;

      line-height: 22px;
      font-size: 18px;
    }
  }

  &__btn-icon {
    width: 20px;
    height: 20px;

    margin-right: 10px;

    @media @w1020 {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
