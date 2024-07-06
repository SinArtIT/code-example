<script setup lang="ts">
import { useStore } from "~/store";
import { FieldSelectModalListItem } from "~/types/field";

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "onChangeActive", value: number): void;
}

interface Props {
  modelValue: boolean;
  initialId?: number;
  listTitle?: string;
  list: FieldSelectModalListItem[];
}

const props = withDefaults(defineProps<Props>(), {
  listTitle: "Выберите значение",
  initialId: undefined
});
const { modelValue, initialId } = toRefs(props);

const emits = defineEmits<Emits>();

const store = useStore();
const ID = Math.floor(Math.random() * 1_000_000);

watch(
  modelValue,
  (val: boolean) => {
    if (val) {
      store.addActiveModal(ID);
    } else {
      store.removeActiveModal(ID);
    }
  },
  {
    immediate: true
  }
);

onUnmounted(() => {
  store.removeActiveModal(ID);
});

function close() {
  emits("update:modelValue", false);
}

const activeItem = ref<number | null>(initialId?.value || null);

function setActive(id: number) {
  activeItem.value = id;

  emits("onChangeActive", id);
}
</script>

<template>
  <teleport to="body">
    <transition name="fade_02">
      <div
        v-if="modelValue"
        :id="ID.toString()"
        class="form-select-modal-list-modal"
      >
        <div
          v-drag-hide="{
            target: '.form-select-modal-list-modal__block-handle',
            callback: close
          }"
          class="form-select-modal-list-modal__container"
        >
          <div class="form-select-modal-list-modal__block-handle" />

          <button
            class="form-select-modal-list-modal__close"
            type="button"
            @click="close"
          >
            <span class="form-select-modal-list-modal__close-mobile">
              <AppSvgIcon
                class="form-select-modal-list-modal__close-mobile-icon"
                name="arrow-left"
                width="5"
                height="10"
              />

              <span> Назад </span>
            </span>

            <AppSvgIcon
              class="form-select-modal-list-modal__close-icon"
              name="cross"
              width="14"
              height="14"
            />
          </button>

          <header class="form-select-modal-list-modal__header">
            <p class="form-select-modal-list-modal__title">
              {{ listTitle }}
            </p>
          </header>

          <div class="form-select-modal-list-modal__list">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="form-select-modal-list-modal__list-item"
              :class="{
                'form-select-modal-list-modal__list-item--active':
                  item.id === activeItem
              }"
              @click="setActive(item.id)"
            >
              <div class="form-select-modal-list-modal__item-top-block">
                <p class="form-select-modal-list-modal__item-text">
                  {{ item.label }}
                </p>

                <div class="form-select-modal-list-modal__item-check" />
              </div>

              <p
                v-if="item.description"
                class="form-select-modal-list-modal__item-subtext"
              >
                {{ item.description }}
              </p>
            </div>
          </div>

          <footer class="form-select-modal-list-modal__footer">
            <button
              class="form-select-modal-list-modal__button btn btn--green btn--big"
              type="button"
              @click="close"
            >
              Продолжить
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="less">
.form-select-modal-list-modal {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: flex-start;

  width: 100%;
  height: calc((var(--vh, 1vh) * 100));

  z-index: 1001;

  &::before {
    content: "";

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: @black2_30;

    z-index: -1;
  }

  &__container {
    .container_600();

    position: relative;

    display: flex;
    flex-direction: column;

    max-height: 90vh;

    margin-top: auto;
    padding: 30px 16px 24px;

    background-color: @white;
    border-radius: 16px 16px 0 0;

    @media @w1020 {
      margin-top: 10vh;
      padding: 40px;

      border-radius: 16px;
    }
  }

  &__block-handle {
    .block-mobile-handle();
  }

  &__close {
    position: absolute;
    top: 30px;
    left: 16px;

    cursor: pointer;

    @media @w1020 {
      top: 21px;
      right: 21px;
      left: unset;

      padding: 5px;
    }
  }

  &__close-mobile {
    display: inline-flex;
    align-items: center;

    line-height: 24px;
    font-size: 13px;
    font-weight: 500;
    color: @brand_green;

    @media @w1020 {
      display: none;
    }
  }

  &__close-mobile-icon {
    padding: 7px 9.5px;
  }

  &__close-icon {
    display: none;

    @media @w1020 {
      display: flex;

      color: @light_gray;
      stroke-width: 1.5px;
    }
  }

  &__header {
    padding-bottom: 24px;
  }

  &__title {
    line-height: 24px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;

    @media @w1020 {
      line-height: unset;
      font-size: 22px;
      font-weight: 600;
    }
  }

  &__list {
    .custom-scroll();

    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__list-item {
    display: flex;
    flex-direction: column;

    padding: 16px;
    gap: 8px;

    background-color: @light_gray2;
    border-radius: 16px;

    cursor: pointer;

    @media @w1020 {
      gap: 12px;
    }

    &:hover:not(&--active) {
      @media (hover: hover) {
        .form-select-modal-list-modal__item-check {
          border-color: @brand_green_30;

          &::after {
            opacity: 0.3;
          }
        }
      }
    }

    &:active,
    &--active {
      .form-select-modal-list-modal__item-check {
        border-color: @brand_green;

        &::after {
          opacity: 1;
        }
      }
    }
  }

  &__item-top-block {
    display: flex;
    gap: 12px;
  }

  &__item-text {
    line-height: 1.4;
    font-size: 14px;
    font-weight: 400;

    @media @w1020 {
      font-size: 16px;
    }
  }

  &__item-check {
    box-sizing: border-box;

    display: flex;
    flex-shrink: 0;

    width: 20px;
    height: 20px;

    margin-left: auto;

    border-radius: 50%;
    border: 1px solid @light_gray4_20;

    &::after {
      content: "";

      box-sizing: border-box;

      display: block;

      width: 12px;
      height: 12px;

      margin: auto;

      background-color: @brand_green;
      border-radius: 50%;

      opacity: 0;
    }
  }

  &__item-subtext {
    line-height: 1.4;
    font-size: 13px;
    font-weight: 400;
    color: @gray_60;

    @media @w1020 {
      font-size: 14px;
    }
  }

  &__footer {
    padding-top: 24px;
  }

  &__button {
    width: 100%;
  }
}
</style>
