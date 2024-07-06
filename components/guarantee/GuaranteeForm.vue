<script setup lang="ts">
import { FormActions } from "vee-validate";
import FormInput from "~/ui/form/FormInput.vue";
import FormInputFile from "~/ui/form/FormInputFile.vue";
import FormSelectModalList from "~/ui/form/select-modal-list/FormSelectModalList.vue";
import { FieldSelectModalListItem } from "~/types/field";
import FormTextArea from "~/ui/form/FormTextArea.vue";
import {
  ApiGuaranteeComplexItem,
  ApiGuaranteeFeedbackFormBody
} from "~/types/api";
import Api from "~/services/api";
import { useCityStore } from "~/store/city";
import FormCheck from "~/ui/form/FormCheck.vue";
import { useModalResponse } from "~/store/modal-response";

type FormValues = {
  surname: string;
  name: string;
  phone: string;
  email: string;
  complex: number | string;
  address: string;
  object: string;
  object_number?: number | string;
  reason: string;
  comment: string;
  files: string[];
};

interface ComplexListItem {
  id: number;
  label: string;
  description?: string;
  value: unknown;
}

interface Props {
  complexes: Record<string | number, ApiGuaranteeComplexItem>;
}

const props = defineProps<Props>();
const { complexes } = toRefs(props);

const modalResponse = useModalResponse();
const { getToken } = useRecaptcha();
const storeCity = useCityStore();
const cityId = computed<number>(() => {
  return Number(storeCity.getCityId);
});
const DISABLED_CITY_LIST = [
  {
    city_id: 5,
    complex_id_list: undefined
  },
  {
    city_id: 3,
    complex_id_list: undefined
  },
  {
    city_id: 7,
    complex_id_list: undefined
  },
  {
    city_id: 2,
    complex_id_list: undefined
  },
  {
    city_id: 9,
    complex_id_list: [13928]
  },
  {
    city_id: 1,
    complex_id_list: [13902, 13936, 15017, 15320]
  }
];

const resultStatus = ref<"success" | "error" | "pending" | null>(null);
const isRequest = computed<boolean>(() => resultStatus.value === "pending");

const { values: formValues, handleSubmit } = useForm<FormValues>();

const onSubmit = handleSubmit(submitAction);

const OBJECT_LIST: FieldSelectModalListItem[] = [
  {
    id: 1,
    label: "Квартира",
    value: "Квартира"
  },
  {
    id: 2,
    label: "Коммерческое помещение",
    value: "Коммерческое помещение"
  },
  {
    id: 3,
    label: "Паркинг (машиноместо)",
    value: "Паркинг (машиноместо)"
  },
  {
    id: 4,
    label: "Кладовая",
    value: "Кладовая"
  },
  {
    id: 5,
    label: "Места общего пользования",
    description: "Входная группа, холл, лифт, колясочная, лестничная площадка",
    value: "Места общего пользования"
  },
  {
    id: 6,
    label: "Благоустройство/Придомовая территория",
    description:
      "Озеленение, места отдыха, детская площадка, наземная парковка",
    value: "Благоустройство/Придомовая территория"
  }
];
const REASON_LIST: FieldSelectModalListItem[] = [
  {
    id: 1,
    label: "Аварийная заявка",
    value: "Аварийная заявка"
  },
  {
    id: 2,
    label: "Заказ платной услуги",
    value: "Заказ платной услуги"
  },
  {
    id: 3,
    label: "Опломбировка счетчиков",
    value: "Опломбировка счетчиков"
  },
  {
    id: 4,
    label: "Показания счетчиков/начисления",
    value: "Показания счетчиков/начисления"
  },
  {
    id: 5,
    label: "Паспортный стол/оформление заявлений",
    value: "Паспортный стол/оформление заявлений"
  },
  {
    id: 6,
    label: "Устранение замечаний/текущий ремонт",
    value: "Устранение замечаний/текущий ремонт"
  },
  {
    id: 7,
    label: "Приемка/передача недвижимости",
    value: "Приемка/передача недвижимости"
  }
];

const complexList = computed<ComplexListItem[]>(() => {
  if (complexes?.value) {
    return Object.entries(complexes.value)
      ?.filter(([key, value]) => {
        return Boolean(value.UF_WARRANTIABLE && value.UF_WARRANTY_COMPLEX_ID);
      })
      .map(
        ([key, value]: [
          key: string | number,
          value: ApiGuaranteeComplexItem
        ]) => {
          return {
            id: Number(value.ID),
            label: value.UF_NAME,
            value: value.UF_WARRANTY_COMPLEX_ID,
            description: value.UF_ADDRESS
          };
        }
      );
  } else {
    return [];
  }
});

const complexAddress = computed<string | undefined>(() => {
  return formValues?.complex
    ? Object.values(complexes.value)?.find(
        (item) => item.UF_WARRANTY_COMPLEX_ID === formValues?.complex
      )?.UF_ADDRESS
    : "";
});

const showObjectNumberField = computed(() => {
  const arr = [
    "квартира",
    "коммерческое помещение",
    "паркинг (машиноместо)",
    "кладовая"
  ];

  return Boolean(arr.includes(formValues?.object?.toString()?.toLowerCase()));
});

const hideFormFieldReason = computed<boolean>(() => {
  if (cityId.value === 4) return true;

  const elem = DISABLED_CITY_LIST.find(
    (item) => Number(item.city_id) === Number(cityId.value)
  );
  const arr = elem?.complex_id_list;

  return Boolean(
    (elem && arr && arr?.includes(Number(formValues?.complex))) ||
      (elem && !arr)
  );
});

async function submitAction(val: FormValues, actions: FormActions<FormValues>) {
  if (!val) return;

  const token = await getToken("send_guarantee_form");

  const obj: ApiGuaranteeFeedbackFormBody = {
    full_name: `${val.name} ${val.surname}`,
    phone: val.phone,
    email: val.email,
    complex_id: Number(val.complex),
    address: val.address,
    object: val.object,
    subject: val.reason,
    comment: val.comment,
    file: [],
    token
  };

  if (val.object_number)
    Object.assign(obj, { object_number: val.object_number });

  if (val.files) {
    obj.file = val.files;
  }

  modalResponse.open();

  const { data: responseData, error } = await Api.sendGuaranteeForm(obj);

  if (responseData && Number(responseData.success) === 1 && !error) {
    modalResponse.setStatus("success");
    actions.resetForm();
  } else {
    modalResponse.setStatus("error");
  }
}
</script>

<template>
  <form class="guarantee-form" @submit="onSubmit">
    <div class="guarantee-form__blocks">
      <div class="guarantee-form__block">
        <p class="guarantee-form__block-title">Личные данные</p>

        <div
          class="guarantee-form__block-fields guarantee-form__block-fields-1"
        >
          <FormInput
            class="guarantee-form__block-field"
            name="surname"
            type="text"
            placeholder="Фамилия"
            :is-white="true"
            :validation-scheme="{ required: true, name: true }"
          />

          <FormInput
            class="guarantee-form__block-field"
            name="name"
            type="text"
            placeholder="Имя"
            :is-white="true"
            :validation-scheme="{ required: true, name: true }"
          />

          <FormInput
            class="guarantee-form__block-field"
            name="phone"
            type="phone"
            placeholder="+7 (999) 999-99-99"
            :is-white="true"
            :validation-scheme="{
              required: true,
              phone: true,
              phone_no_same: true
            }"
          />

          <FormInput
            class="guarantee-form__block-field"
            name="email"
            type="email"
            placeholder="Email"
            :is-white="true"
            :validation-scheme="{ required: true, email: true }"
          />

          <FormSelectModalList
            class="guarantee-form__block-field"
            name="complex"
            list-title="Выберите ЖК"
            placeholder="ЖК"
            :list="complexList"
            :is-white="true"
            :validation-scheme="{ required: true }"
          />

          <FormInput
            class="guarantee-form__block-field"
            name="address"
            type="text"
            placeholder="Адрес"
            :initial-value="complexAddress"
            :is-white="true"
            :readonly="true"
          />
        </div>
      </div>

      <div class="guarantee-form__block">
        <p class="guarantee-form__block-title">Описание проблемы</p>

        <div class="guarantee-form__block-fields">
          <FormSelectModalList
            class="guarantee-form__block-field"
            name="object"
            list-title="Выберите объект"
            placeholder="Объект"
            :list="OBJECT_LIST"
            :is-white="true"
            :validation-scheme="{ required: true }"
          />

          <FormInput
            v-if="showObjectNumberField"
            class="guarantee-form__block-field"
            name="object_number"
            type="number"
            placeholder="№ объекта"
            :is-white="true"
            :validation-scheme="{ required: true }"
            prefix="№"
          />

          <FormSelectModalList
            v-if="!hideFormFieldReason"
            class="guarantee-form__block-field"
            name="reason"
            list-title="Выберите причину"
            placeholder="С чем связан ваш вопрос"
            :list="REASON_LIST"
            :is-white="true"
            :validation-scheme="{ required: true }"
          />

          <FormTextArea
            class="guarantee-form__block-field guarantee-form__block-field--w-100"
            name="comment"
            placeholder="Комментарий"
            :rows="3"
            :validation-scheme="{ required: true }"
            :is-white="true"
          />
        </div>
      </div>

      <div class="guarantee-form__block">
        <div class="guarantee-form__block-fields">
          <FormInputFile name="files" />
        </div>
      </div>
    </div>

    <FormCheck
      class="guarantee-form__block-field guarantee-form__block-field--w-100 guarantee-form__block-field--mb-16"
      name="policy"
      target="_blank"
      :label="`Даю <a target='_blank' href=''>согласие</a> на обработку моих персональных данных, с условиями <a target='_blank' href=''>политики</a> ознакомлен.`"
      :validation-scheme="{ required: true }"
      :initial-value="true"
    />

    <button
      type="submit"
      class="guarantee-form__submit btn btn--green btn--h60"
      :class="{ 'btn--disabled': isRequest }"
      :disabled="isRequest"
    >
      Отправить
    </button>
  </form>
</template>

<style scoped lang="less">
.guarantee-form {
  padding: 24px 16px;

  border-radius: 20px;

  background-color: @light_gray2;

  @media @w1020 {
    padding: 32px 40px;
  }

  &__blocks {
    margin-bottom: 24px;

    border-bottom: 1px solid @light_gray4_20;
  }

  &__block {
    padding-bottom: 32px;
  }

  &__block-title {
    margin-bottom: 16px;

    font-size: 19px;
    font-weight: 600;
    color: @gray_60;

    @media @w1020 {
      margin-bottom: 20px;

      font-size: 22px;
    }
  }

  &__block-fields {
    display: flex;
    flex-direction: column;
    gap: 16px 0;

    @media @w1020 {
      flex-direction: row;
      gap: 20px 24px;
      flex-wrap: wrap;
    }
  }

  &__block-fields-1 {
    @media @w768 {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;

      & > .guarantee-form__block-field {
        width: calc(50% - 8px);
      }
    }

    @media @w1020 {
      flex-direction: row;
      gap: 20px 24px;
      flex-wrap: wrap;

      & > .guarantee-form__block-field {
        width: calc(33.33% - 16px);
      }
    }
  }

  &__block-field {
    @media @w1020 {
      width: calc(33.33% - 16px);
    }

    &--w-100 {
      width: 100%;
    }

    &--mb-16 {
      margin-bottom: 16px;
    }
  }

  &__submit {
    width: 100%;

    margin-bottom: 24px;
  }
}
</style>
