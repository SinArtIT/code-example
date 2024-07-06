<template>
  <div class="contact-feedback-form">
    <div class="contact-feedback-form__block-left">
      <p class="contact-feedback-form__title">{{ data.title }}</p>

      <div
        v-if="data?.employee?.hasManager"
        v-lazy-load
        class="contact-feedback-form__employee"
      >
        <img
          class="contact-feedback-form__employee-image"
          :data-src="data?.employee?.image"
          src="~/assets/images/talan-default-img-white.png"
          :alt="data?.employee?.name || 'сотрудник'"
        />

        <div class="contact-feedback-form__employee-info">
          <p
            v-if="data?.employee?.name"
            class="contact-feedback-form__employee-name"
          >
            {{ data?.employee?.name }}
          </p>

          <p
            v-if="data?.employee?.position"
            class="contact-feedback-form__employee-position"
          >
            {{ data?.employee?.position }}
          </p>

          <p
            v-if="data?.employee?.phone"
            class="contact-feedback-form__employee-phone"
          >
            {{ data.employee.phone }}
          </p>
        </div>
      </div>
    </div>

    <div class="contact-feedback-form__block-right">
      <form
        v-if="!responseStatus"
        class="contact-feedback-form__form"
        @submit="onSubmit"
      >
        <FormInput
          class="contact-feedback-form__form-field"
          name="name"
          placeholder="Как вас зовут"
        />

        <FormInput
          class="contact-feedback-form__form-field"
          name="phone"
          type="phone"
          placeholder="+7 (999) 999-99-99"
        />

        <FormInputEmail
          class="contact-feedback-form__form-field"
          name="email"
          placeholder="E-mail"
        />

        <FormCheck
          class="contact-feedback-form__form-field"
          name="policy"
          target="_blank"
          :label="`Даю <a target='_blank' href=''>согласие</a> на обработку моих персональных данных, с условиями <a target='_blank' href=''>политики</a> ознакомлен.`"
          :initial-value="true"
        />

        <button
          type="submit"
          class="contact-feedback-form__form-submit btn btn--big btn--green"
          :class="{ 'contact-feedback-form__form-submit--loading': isLoading }"
        >
          <span v-if="!isLoading"> Отправить </span>

          <p v-else class="contact-feedback-form__form-submit-loader-text">
            Отправка
            <span
              class="contact-feedback-form__form-submit-loader dots-loader"
            />
          </p>
        </button>
      </form>

      <AppNotificationFormResult
        v-if="responseStatus"
        class="contact-feedback-form__form-result"
        :response-status="responseStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FormCheck from "~/ui/form/FormCheck.vue";
import FormInput from "~/ui/form/FormInput.vue";
import FormInputEmail from "~/ui/form/FormInputEmail.vue";

import { ContactFeedbackItem } from "~/types/contact";
import Api from "~/services/api";
import { useCityStore } from "~/store/city";
import useRecaptcha from "~/composables/useRecaptcha";

interface IProps {
  data: ContactFeedbackItem;
}

const props = defineProps<IProps>();
const { data: propsData } = toRefs(props);

interface IForm {
  name: string;
  phone: string;
  email: string;
  policy: boolean;
}

const storeCity = useCityStore();

const { getToken } = useRecaptcha();

const { handleSubmit } = useForm<IForm>({
  validationSchema: {
    name: "required",
    phone: "required|phone|phone_no_same",
    email: "required|email",
    policy: "required"
  }
});

const onSubmit = handleSubmit(submitAction);
const isLoading = ref<boolean>(false);
const responseStatus = ref<number | null>(null);

async function submitAction(values?: any, actions?: any) {
  const token = await getToken("send_form");

  isLoading.value = true;

  const { data, error } = await Api.sendFeedbackForm({
    city: storeCity.getCityName,
    description: "заявка с сайта-Задать вопрос",
    name: values.name,
    phone: values.phone,
    email: values.email,
    title: "Задать вопрос",
    referrer: window.location.origin,
    manager_id: propsData.value?.employee?.id,
    token
  });

  if (error) responseStatus.value = 500;
  if (data) {
    responseStatus.value = 200;
  }

  isLoading.value = false;
  actions.resetForm();
}
</script>

<style lang="less">
.contact-feedback-form {
  display: flex;
  flex-direction: column;
  gap: 24px 0;

  padding: 32px 16px;

  border-radius: 16px;
  background-color: @light_gray2;

  @media @w1020 {
    flex-direction: unset;
    justify-content: space-between;
    gap: 32px;

    padding: 60px;
  }

  &__title {
    margin-bottom: 24px;

    line-height: 29px;
    font-size: 24px;
    font-weight: 600;

    @media @w1020 {
      max-width: 450px;
      margin-bottom: 32px;

      line-height: 48px;
      font-size: 40px;
    }
  }

  &__employee {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0 16px;
  }

  &__employee-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;

    flex-shrink: 0;

    object-fit: cover;

    @media @w1020 {
      width: 150px;
      height: 150px;
    }
  }

  &__employee-info > p:not(:last-child) {
    margin-bottom: 8px;
  }

  &__employee-name {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    @media @w1020 {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &__employee-position {
    line-height: 18px;
    font-weight: 400;
    font-size: 13px;
    color: @gray_60;

    @media @w1020 {
      line-height: 17px;
      font-size: 14px;
    }
  }

  &__employee-phone {
    line-height: 19px;
    font-size: 14px;
    font-weight: 400;

    @media @w1020 {
      line-height: 22px;
      font-size: 16px;
    }
  }

  &__block-right {
    @media @w1020 {
      gap: 20px 0;

      max-width: 450px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px 0;

    @media @w1020 {
      gap: 20px 0;

      max-width: 450px;
    }
  }

  &__form-result {
    background-color: @white;
  }

  &__form-field {
    & > .form-input__label,
    & > .form-input-email__label {
      background-color: @white;
    }
  }
}
</style>
