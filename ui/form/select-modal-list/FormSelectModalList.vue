<script setup lang="ts">
import FormSelectModalListModal from "~/ui/form/select-modal-list/FormSelectModalListModal.vue";
import { FieldSelectModalListItem } from "~/types/field";
import { FieldSelectModalList } from "~/interfaces/field";

const props = defineProps<FieldSelectModalList>();
const { initialValue, label, name, list, validationScheme } = toRefs(props);

const showList = ref<boolean>(false);
const currentItemId = ref<number | null>(null);
const currentItem = computed<FieldSelectModalListItem | undefined>(() => {
  return (
    list.value?.find((item) => item.id === currentItemId.value) || undefined
  );
});

_init_();

const { value: fieldValue, errorMessage } = useField(name, validationScheme, {
  initialValue,
  label: label?.value ? `«${label.value}»` : ""
});

watch(currentItem, (val) => {
  if (val) fieldValue.value = val.value;
});

watch(fieldValue, (val) => {
  if (!val) {
    currentItemId.value = null;
  }
});

function _init_() {
  if (Array.isArray(list.value)) {
    const initialItem = list.value?.find((item) => {
      if (!item.value || !initialValue?.value) return false;

      if (
        typeof item.value === "object" &&
        typeof initialValue?.value === "object"
      )
        return compareObjects(item.value, initialValue.value);
      else {
        return item.value === initialValue.value;
      }
    });

    if (initialItem) currentItemId.value = initialItem.id;
  }
}

function openList() {
  showList.value = true;
}

function updateActive(id: number) {
  currentItemId.value = id;
}
</script>

<template>
  <div class="form-select-modal-list">
    <label
      class="form-select-modal-list__label"
      :class="{
        'form-select-modal-list__label--white': isWhite,
        'form-select-modal-list__label--error': errorMessage
      }"
      @click="openList"
    >
      <p class="form-select-modal-list__text">
        <span
          v-if="placeholder && !currentItem?.label"
          class="form-select-modal-list__text--gray"
        >
          {{ placeholder }}
        </span>

        <span v-else-if="currentItem?.label">
          {{ currentItem.label }}
        </span>
      </p>

      <AppSvgIcon
        class="form-select-modal-list__icon"
        :class="{ 'form-select-modal-list__icon--rotate': showList }"
        name="arrow-down"
        width="12"
        height="6"
      />
    </label>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <FormSelectModalListModal
      v-model="showList"
      :list-title="listTitle"
      :list="list"
      :initial-id="currentItemId"
      @on-change-active="updateActive"
    />
  </div>
</template>

<style scoped lang="less">
.form-select-modal-list {
  &__label {
    box-sizing: border-box;
    display: flex;

    height: 60px;
    padding: 19px 16px;

    background-color: @light_gray2;
    border-radius: 8px;

    cursor: pointer;

    @media @mobile {
      height: 48px;
      padding: 14px 12px;
    }

    &--error {
      outline: 1px solid @red;

      & .form-input__input {
        color: @red;
      }
    }

    &--white {
      background-color: @white;
    }
  }

  &__text {
    flex: 1;

    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media @mobile {
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;

      caret-color: @brand_green;
    }

    &--gray {
      color: @gray_60;
    }
  }

  &__icon {
    padding: 9px 6px;
    color: @gray_60;

    transition: transform 0.3s;

    &--rotate {
      transform: rotateX(180deg);
    }
  }
}
</style>
