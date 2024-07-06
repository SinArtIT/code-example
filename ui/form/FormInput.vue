<script setup lang="ts">
import { FieldInputProps } from "~/interfaces/field";

type Props = FieldInputProps & {
  isWhite?: boolean;
  prefix?: string;
  readonly?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  isWhite: false,
  prefix: "",
  readonly: false
});
const { name, label, initialValue, type, prefix, validationScheme } =
  toRefs(props);

const { value: fieldValue, errorMessage } = useField(name, validationScheme, {
  initialValue,
  label: label?.value ? `«${label.value}»` : ""
});

const showPrefix = ref<boolean>(Boolean(fieldValue.value && prefix.value));

watch(
  () => initialValue?.value,
  (val, oldVal) => {
    if (val && val !== oldVal) fieldValue.value = formatValue(val);
  },
  {
    immediate: true
  }
);

function formatValue(val: string): string {
  let newVal = "";

  if (type.value !== "text") val = val.replace(/\D/g, "");

  if (val && type.value === "phone") {
    const firstItem = val.charAt(0);

    if (firstItem !== "7" && firstItem !== "8") val = "7" + val;

    const matches = val.match(/([78])?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

    if (matches?.length) {
      newVal += matches[1]
        ? matches[1] === "7"
          ? "+" + matches[1]
          : matches[1] === "8"
          ? "+7"
          : "+7"
        : "";
      newVal += matches[2] ? ` (${matches[2]}) ` : "";
      newVal += matches[3] ? matches[3] : "";
      newVal += matches[4] ? `-${matches[4]}` : "";
      newVal += matches[5] ? `-${matches[5]}` : "";
    }
  } else {
    newVal = val;
  }

  return newVal;
}

function onInput(e: Event): void {
  const target = e.target as HTMLInputElement;

  if (!target) return;

  const val = target.value || "";

  if (val && type.value === "phone") {
    const selectionOptions = {
      2: 2,
      7: 5,
      8: 6,
      9: 7,
      10: 10,
      11: 11,
      12: 12,
      14: 14,
      15: 15,
      17: 17,
      18: 18
    };

    const newVal = formatValue(val);

    target.value = newVal;

    target.selectionStart =
      selectionOptions[newVal.length as keyof typeof selectionOptions];
    target.selectionEnd =
      selectionOptions[newVal.length as keyof typeof selectionOptions];

    if (newVal) showPrefix.value = !!prefix.value;
    else showPrefix.value = false;
  } else if (type.value === "number") {
    const newVal = val.replace(/\D+/, "");
    target.value = newVal;
    if (newVal) showPrefix.value = !!prefix.value;
  } else showPrefix.value = false;
}
</script>

<template>
  <div class="form-input">
    <div v-if="title" class="form-input__title" v-html="title" />

    <label
      class="form-input__label"
      :class="{
        'form-input__label--error': errorMessage,
        'form-input__label--white': isWhite
      }"
    >
      <span v-if="showPrefix" class="form-input__prefix">
        {{ prefix }}
      </span>

      <input
        v-model.lazy="fieldValue"
        class="form-input__input"
        :type="type"
        :placeholder="placeholder"
        :readonly="readonly"
        @input="onInput"
      />
    </label>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style lang="less">
.form-input {
  &__title {
    .field-title();
  }

  &__label {
    box-sizing: border-box;
    display: flex;
    align-items: center;

    height: 60px;
    padding: 19px 16px;

    background-color: @light_gray2;
    border-radius: 8px;

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

  &__prefix {
    margin-right: 4px;

    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    @media @mobile {
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
    }
  }

  &__input {
    width: 100%;

    padding: 0;

    background-color: transparent;
    border: none;

    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    text-overflow: ellipsis;

    &:focus-visible {
      outline: none;
    }

    &::placeholder {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: @gray_60;
    }

    @media @mobile {
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;

      caret-color: @brand_green;

      &::placeholder {
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
      }
    }
  }
}
</style>
