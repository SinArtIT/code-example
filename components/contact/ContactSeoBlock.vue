<script setup lang="ts">
import { ContactSeoBlockData } from "~/types/contact";

type ScriptObject = {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  "@id": string;
  url: string;
  telephone: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
};

interface Props {
  data: ContactSeoBlockData;
}

const props = defineProps<Props>();
const { data } = toRefs(props);

const scriptObject = computed<ScriptObject>(() => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.value.title,
    "@id": "",
    url: data.value.link,
    telephone: data.value.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.value.street,
      addressLocality: data.value.cityName,
      postalCode: data.value.postalCode,
      addressCountry: data.value.country
    }
  };
});
</script>

<template>
  <client-only>
    <div class="contact-seo-block">
      <div itemscope itemtype="http://schema.org/">
        <span itemprop="name">{{ data.title }}</span>
        <div
          itemprop="address"
          itemscope
          itemtype="http://schema.org/PostalAddress"
        >
          <span itemprop="streetAddress">{{ data.street }}</span>
          <span itemprop="addressLocality">{{ data.cityName }}</span>
        </div>
        <span itemprop="telephone">{{ data.phone }}</span>
        <a itemprop="url" :href="data.link">{{ data.link }}</a>
      </div>

      <component is="script" type="application/id+json">
        {{ scriptObject }}
      </component>
    </div>
  </client-only>
</template>

<style lang="less">
.contact-seo-block {
  width: 0;
  height: 0;

  opacity: 0;
}
</style>
