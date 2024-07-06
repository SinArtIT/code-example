<template>
  <div class="contact-address-list">
    <ContactAddressListItem
      v-for="(item, index) in list"
      :key="index"
      class="contact-address-list__item"
      :data="item"
    />
  </div>
</template>

<script setup lang="ts">
import { ContactAddressItem } from "~/types/contact";

interface IProps {
  list: ContactAddressItem[];
}

defineProps<IProps>();
</script>

<style lang="less">
.contact-address-list {
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  @media @w768 {
    flex-direction: unset;
    flex-wrap: wrap;
    gap: 24px;
  }

  &__item {
    @media @w768 {
      width: calc(50% - 12px);
    }
  }
}
</style>
