<template>
  <div>
    <AppError
      :status-code="error.statusCode"
      :status-message="error.statusMessage"
    />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

interface IProps {
  error: NuxtError;
}

defineProps<IProps>();
</script>

<style lang="less"></style>
