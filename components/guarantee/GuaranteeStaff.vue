<script setup lang="ts">
interface Props {
  data: {
    image: string;
    name: string;
    position: string;
    phone: string;
    grade: number;
    count: number;
  };
}

defineProps<Props>();
</script>

<template>
  <div class="guarantee-staff">
    <div class="guarantee-staff__block">
      <picture
        :key="data.image"
        v-lazy-load
        class="guarantee-staff__image-wrap"
      >
        <img
          class="guarantee-staff__image"
          src="~/assets/images/talan-default-img-white.png"
          :data-src="data.image"
          alt="image"
          loading="lazy"
        />
      </picture>

      <div class="guarantee-staff__info">
        <div class="guarantee-staff__info-main">
          <p class="guarantee-staff__main-title">{{ data.name }}</p>

          <p class="guarantee-staff__main-description">{{ data.position }}</p>

          <div v-if="data.phone" class="guarantee-staff__main-phone-list">
            <a class="guarantee-staff__main-phone" :href="`tel:${data.phone}`">
              {{ data.phone }}
            </a>
          </div>
        </div>

        <div v-if="data.grade" class="guarantee-staff__info-grade">
          <p class="guarantee-staff__grade-title">Оценка сервиса</p>

          <div class="guarantee-staff__grade-number">{{ data.grade }}</div>
        </div>
      </div>
    </div>

    <div class="guarantee-staff__text-block">
      <p class="guarantee-staff__text">
        * Расчет основан на {{ data.count }} опросах за квартал
      </p>

      <p class="guarantee-staff__text">
        ** Механика расчета оценки гарантийного сервиса основана на
        сервис-опросах клиентов. Оценка гарантийного сервиса – это средняя
        оценка по Сервис-опросу клиента, который проводится после устранения
        гарантийного замечания. Среднее значение рассчитывается на основании
        ответов клиента по 4м вопросам. Шкала оценок от «0» до «10» баллов, где
        0 – самая низкая оценка, 10 – самая высокая. Если клиент отказывается
        оценивать работы гарантийного сервиса, ответ в расчет средней оценки не
        идет.
      </p>
    </div>
  </div>
</template>

<style scoped lang="less">
.guarantee-staff {
  &__block {
    box-sizing: border-box;

    display: flex;
    gap: 16px;

    width: 100%;

    padding: 24px 16px;
    margin-bottom: 24px;

    border-radius: 20px;
    background-color: @light_gray2;

    @media @w600 {
      align-items: center;
      gap: 24px;

      padding: 32px 40px;
    }
  }

  &__image-wrap {
    display: block;

    flex-shrink: 0;

    width: 60px;
    height: 60px;

    border-radius: 50%;
    overflow: hidden;

    @media @w600 {
      width: 100px;
      height: 100px;
    }

    @media @w768 {
      width: 150px;
      height: 150px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;

    border-radius: 50%;

    object-fit: cover;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px 24px;

    flex: 1;

    @media @w600 {
      flex-direction: unset;
      justify-content: space-between;
    }
  }

  &__main-title {
    line-height: 19px;
    font-size: 16px;
    font-weight: 500;

    @media @w768 {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &__main-description {
    margin-top: 8px;

    line-height: 18px;
    font-size: 13px;
    font-weight: 400;
    color: @black2_60;

    @media @w768 {
      font-size: 14px;
      line-height: 17px;
    }
  }

  &__main-phone-list {
    display: flex;
    flex-direction: column;

    margin-top: 8px;
  }

  &__main-phone {
    line-height: 19.6px;
    font-size: 14px;
    font-weight: 400;

    &:not(:last-child) {
      &::after {
        content: ",";
      }
    }

    @media @w768 {
      line-height: 22px;
      font-size: 16px;
    }
  }

  &__info-grade {
    @media @w600 {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__grade-title {
    margin-bottom: 4px;

    color: @black2_60;
    line-height: 18.2px;
    font-size: 13px;
    font-weight: 400;

    @media @w600 {
      margin-bottom: 8px;
    }

    @media @w768 {
      line-height: 17px;
      font-size: 14px;
    }
  }

  &__grade-number {
    display: inline-block;
    height: 32px;

    padding: 0 11px;

    background-color: @brand_green;
    border-radius: 16px;

    color: @white;
    line-height: 32px;
    font-size: 19px;
    font-weight: 600;
    text-align: center;

    @media @w600 {
      width: 86px;
      height: 86px;

      padding: 0;

      border-radius: 50%;

      line-height: 86px;
    }

    @media @w768 {
      font-size: 22px;
    }
  }

  &__text {
    font-size: 14px;
    color: @gray_30;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
