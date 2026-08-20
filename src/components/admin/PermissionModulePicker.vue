<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  countSelectedInModule,
  countSelectedInSubmodule,
  getModulePermissions,
  groupPermissions,
  isModuleFullySelected,
  isSubmoduleFullySelected,
  type PermissionModule,
  type PermissionSubmodule,
} from "@/lib/permissionGroups";
import type { Permission } from "@/lib/types";

const props = defineProps<{
  permissions: Permission[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const expandedModules = ref<Set<string>>(new Set());

const modules = computed(() => groupPermissions(props.permissions));

const allPermissionNames = computed(() =>
  props.permissions.map((permission) => permission.name)
);

const totalSelected = computed(() => props.modelValue.length);

const allSelected = computed(
  () =>
    allPermissionNames.value.length > 0 &&
    allPermissionNames.value.every((name) => props.modelValue.includes(name))
);

function updateSelected(next: string[]) {
  emit("update:modelValue", next);
}

function toggleModuleExpand(moduleKey: string) {
  const next = new Set(expandedModules.value);
  if (next.has(moduleKey)) {
    next.delete(moduleKey);
  } else {
    next.add(moduleKey);
  }
  expandedModules.value = next;
}

function isExpanded(moduleKey: string): boolean {
  return expandedModules.value.has(moduleKey);
}

function togglePermission(permissionName: string) {
  const next = [...props.modelValue];
  const index = next.indexOf(permissionName);
  if (index >= 0) {
    next.splice(index, 1);
  } else {
    next.push(permissionName);
  }
  updateSelected(next);
}

function toggleModule(module: PermissionModule, checked: boolean) {
  const moduleNames = getModulePermissions(module).map((p) => p.name);
  const withoutModule = props.modelValue.filter((name) => !moduleNames.includes(name));
  updateSelected(checked ? [...withoutModule, ...moduleNames] : withoutModule);
}

function toggleSubmodule(submodule: PermissionSubmodule, checked: boolean) {
  const submoduleNames = submodule.permissions.map((p) => p.name);
  const withoutSubmodule = props.modelValue.filter((name) => !submoduleNames.includes(name));
  updateSelected(checked ? [...withoutSubmodule, ...submoduleNames] : withoutSubmodule);
}

function toggleAll(checked: boolean) {
  updateSelected(checked ? [...allPermissionNames.value] : []);
}

function moduleCountLabel(module: PermissionModule): string {
  const selected = countSelectedInModule(module, props.modelValue);
  return `${selected}/${getModulePermissions(module).length}`;
}

function submoduleCountLabel(submodule: PermissionSubmodule): string {
  const selected = countSelectedInSubmodule(submodule, props.modelValue);
  return `${selected}/${submodule.permissions.length}`;
}
</script>

<template>
  <div class="permission-picker">
    <div class="permission-picker__header">
      <span class="permission-picker__title">Permissões</span>
      <label v-if="permissions.length" class="permission-picker__select-all">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="allSelected"
          @change="toggleAll(($event.target as HTMLInputElement).checked)"
        />
        Selecionar todas
      </label>
    </div>

    <div v-if="permissions.length === 0" class="permission-picker__empty text-muted">
      Nenhuma permissão disponível
    </div>

    <div v-else class="permission-picker__modules">
      <div
        v-for="module in modules"
        :key="module.key"
        class="permission-module"
        :class="{
          'permission-module--expanded': isExpanded(module.key),
          'permission-module--complete': isModuleFullySelected(module, modelValue),
        }"
      >
        <button
          type="button"
          class="permission-module__trigger"
          :aria-expanded="isExpanded(module.key)"
          @click="toggleModuleExpand(module.key)"
        >
          <span class="permission-module__name">{{ module.label }}</span>
          <span class="permission-module__meta">
            <span class="permission-module__count">{{ moduleCountLabel(module) }}</span>
            <i
              class="permission-module__chevron la"
              :class="isExpanded(module.key) ? 'la-angle-down' : 'la-angle-right'"
            ></i>
          </span>
        </button>

        <div v-show="isExpanded(module.key)" class="permission-module__body">
          <label class="permission-module__sector-toggle">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="isModuleFullySelected(module, modelValue)"
              @change="toggleModule(module, ($event.target as HTMLInputElement).checked)"
            />
            {{
              isModuleFullySelected(module, modelValue)
                ? "Desmarcar setor"
                : "Selecionar setor"
            }}
          </label>

          <template v-if="module.submodules?.length">
            <div
              v-for="submodule in module.submodules"
              :key="submodule.key"
              class="permission-submodule"
            >
              <div class="permission-submodule__header">
                <span class="permission-submodule__title">{{ submodule.label }}</span>
                <span class="permission-submodule__count">
                  {{ submoduleCountLabel(submodule) }}
                </span>
              </div>

              <label class="permission-submodule__sector-toggle">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="isSubmoduleFullySelected(submodule, modelValue)"
                  @change="
                    toggleSubmodule(submodule, ($event.target as HTMLInputElement).checked)
                  "
                />
                {{
                  isSubmoduleFullySelected(submodule, modelValue)
                    ? "Desmarcar submódulo"
                    : "Selecionar submódulo"
                }}
              </label>

              <div class="permission-module__grid">
                <label
                  v-for="permission in submodule.permissions"
                  :key="permission.name"
                  class="permission-module__item"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="modelValue.includes(permission.name)"
                    @change="togglePermission(permission.name)"
                  />
                  <span>{{ permission.label }}</span>
                </label>
              </div>
            </div>
          </template>

          <div v-else class="permission-module__grid">
            <label
              v-for="permission in module.permissions"
              :key="permission.name"
              class="permission-module__item"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :checked="modelValue.includes(permission.name)"
                @change="togglePermission(permission.name)"
              />
              <span>{{ permission.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <p v-if="permissions.length" class="permission-picker__hint">
      Clique nos setores para expandir e selecionar permissões por módulo
      <span v-if="totalSelected > 0" class="permission-picker__summary">
        · {{ totalSelected }} selecionada(s)
      </span>
    </p>
  </div>
</template>

<style scoped>
.permission-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.permission-picker__title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6c757d;
}

.permission-picker__select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.permission-picker__modules {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permission-module {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.permission-module--complete:not(.permission-module--expanded) {
  border-color: color-mix(in srgb, var(--primary) 35%, #e9ecef);
  background: color-mix(in srgb, var(--primary) 6%, #fff);
}

.permission-module--expanded {
  border-color: color-mix(in srgb, var(--primary) 45%, #e9ecef);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.04);
}

.permission-module__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem 1rem;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.permission-module--expanded .permission-module__trigger {
  background: var(--primary);
  color: #fff;
}

.permission-module__name {
  font-weight: 600;
  font-size: 0.95rem;
}

.permission-module__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.permission-module__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.06);
  color: inherit;
}

.permission-module--expanded .permission-module__count {
  background: rgba(255, 255, 255, 0.18);
}

.permission-module__chevron {
  font-size: 1rem;
  line-height: 1;
}

.permission-module__body {
  padding: 1rem;
  border-top: 1px solid #f1f3f5;
  background: #fcfcfd;
}

.permission-module__sector-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.permission-module__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem 1.25rem;
}

.permission-module__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 0.625rem;
  border: 1px solid #edf0f2;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: #343a40;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.permission-module__item:has(input:checked) {
  border-color: color-mix(in srgb, var(--primary) 40%, #edf0f2);
  background: color-mix(in srgb, var(--primary) 8%, #fff);
}

.permission-submodule + .permission-submodule {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e9ecef;
}

.permission-submodule__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.permission-submodule__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

.permission-submodule__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.06);
  color: #495057;
}

.permission-submodule__sector-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  user-select: none;
}

.permission-picker__hint {
  margin: 0.875rem 0 0;
  font-size: 0.8125rem;
  color: #6c757d;
}

.permission-picker__summary {
  color: var(--primary);
  font-weight: 600;
}

.permission-picker__empty {
  padding: 1rem 0;
}
</style>
