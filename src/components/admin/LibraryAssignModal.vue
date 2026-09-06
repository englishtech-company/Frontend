<script lang="ts" setup>
import MultiSelect from "@/components/ui/MultiSelect.vue";
import type { SelectOption } from "@/components/ui/select.types";

defineProps<{
  title: string;
  subtitle?: string;
  studentIds: (string | number)[];
  options: SelectOption[];
  saving?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  close: [];
  save: [];
  "update:studentIds": [value: (string | number)[]];
}>();
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered" style="z-index: 1056">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Fechar"
            :disabled="saving"
            @click="emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <p v-if="subtitle" class="text-muted mb-3">{{ subtitle }}</p>

          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

          <MultiSelect
            id="library-assign-students"
            :model-value="studentIds"
            label="Alunos"
            :options="options"
            placeholder="Selecione os alunos"
            @update:model-value="emit('update:studentIds', $event)"
          />
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="saving"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="saving"
            @click="emit('save')"
          >
            {{ saving ? "Salvando..." : "Salvar atribuição" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
