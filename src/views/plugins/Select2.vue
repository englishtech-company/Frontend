<!-- @format -->

<template>
  <div class="container-fluid select_option_2">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="javascript:void(0)">Components</a>
          </li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Select2</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Single select boxes</h4>
              <p>Select2 can take a regular select box like this...</p>
            </div>
            <v-select
              placeholder="Alabama"
              :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
              label="title"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Multi-select boxes</h4>
              <p>
                Select2 also supports multi-value select boxes. The select below
                is declared with the multiple
                <mark class="text-primary">attribute</mark>.
              </p>
            </div>

            <v-select
              class="multi-select"
              multiple
              :options="[
                { title: 'Alabama' },
                { title: 'Wyoming' },
                { title: 'dlf' },
              ]"
              label="title"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Dropdown option groups</h4>
              <p>
                In HTML, <code>&lt;option&gt;</code> elements can be grouped by
                wrapping them with in <br />
                an <code>&lt;optgroup&gt;</code> element:
              </p>
            </div>

            <v-select
              class="multi-select"
              placeholder="Nested option 1"
              :options="[
                { title: 'Nested option 1' },
                { title: 'Nested option 2' },
                { title: 'Nested option 3' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Disabling options</h4>
              <p>
                Select2 will correctly handle disabled options when
                <code>disabled</code> attribute is set) and from remote srouces
                where the object has <code>disabled: true</code> set.
              </p>
            </div>
            <v-select
              placeholder="First"
              class="multi-select"
              :options="[
                { title: 'First' },
                { title: 'Second (disabled)' },
                { title: 'Third' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Disabling a Select2 control</h4>
              <p>
                Select2 will respond to the <code>disabled</code> attribute on
                <code>&lt;select&gt;</code> elements. You can also initialize
                Select2 with <code>disabled: true</code> to get the same effect.
              </p>
            </div>

            <div class="mb-3">
              <v-select
                :disabled="DisablingSelect2"
                placeholder="Alabama"
                class="js-example-disabled"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>
            <div class="mb-3">
              <v-select
                :disabled="DisablingSelect2"
                multiple
                class="js-example-disabled"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>

            <button
              @click="DisablingSelect2 = false"
              class="btn btn-primary me-2"
              id="js-programmatic-enable"
            >
              Enable
            </button>
            <button
              @click="DisablingSelect2 = true"
              class="btn btn-danger light"
              id="js-programmatic-disable"
            >
              Disable
            </button>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Select2 With Labels</h4>
              <p>
                You can, and should, use a <code>&lt;label&gt;</code> with
                Select2, just like any other
                <code>&lt;select&gt;</code> element.
              </p>
            </div>

            <label class="mb-4 select2-label" for="id_label_single">
              <span class="d-block" style="color: var(--text-dark)"
                >Click this to highlight the single select element</span
              >
              <br />
              <v-select
                style="color: var(--border)"
                class="select2-with-label-single js-states d-block"
                placeholder="Alabama"
                id="id_label_single"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </label>

            <label class="select2-label" for="id_label_multiple">
              <span class="d-block" style="color: var(--text-dark)"
                >Click this to highlight the multiple select element</span
              >
              <br />

              <v-select
                multiple
                class="select2-with-label-multiple js-states"
                id="id_label_multiple"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Container Width</h4>
              <p>
                The two Select2 boxes below are styled to <code>50%</code> and
                <code>75%</code> width respectively to support responsive
                design:
              </p>
            </div>

            <div class="mb-3">
              <v-select
                class="select2-width-50"
                placeholder="Alabama"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>
            <div class="mb-3">
              <v-select
                class="select2-width-75"
                multiple
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Themes</h4>
              <p>
                Select2 supports custom themes using the
                <code>theme</code> option so you can style Select2 to match the
                rest of your application.
              </p>
            </div>

            <div class="mb-3">
              <v-select
                class="select2-width-50"
                placeholder="Alabama"
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>
            <div class="mb-3">
              <v-select
                class="select2-width-75"
                multiple
                :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
                label="title"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Ajax (remote data)</h4>
              <p>
                Select2 comes with AJAX support built in, using jQuery's AJAX
                methods. In this example, we can search for repositories using
                GitHub's API:
              </p>
            </div>
            <v-select
              class="js-data-example-ajax w-100"
              v-model="selectedItem"
              :options="items"
              item-text="name"
              item-value="id"
              label="name"
              :filterable="true"
            >
            </v-select>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Loading array data</h4>
              <p>
                You may use the <code>data</code> configuration option to load
                dropdown options from a local array.
              </p>
            </div>
            <v-select
              class="js-example-data-array"
              placeholder="enhancement"
              :options="[
                { title: 'enhancement' },
                { title: 'bug' },
                { title: 'duplicate' },
                { title: 'invalid' },
                { title: 'wontfix' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Automatic Selection</h4>
              <p>
                Select2 can be configured to automatically select the currently
                highlighted result when the dropdown is btn-closed by using the
                <code>selectOnbtn-close</code> option:
              </p>
            </div>
            <v-select
              id="automatic-selection"
              placeholder="Alabama"
              :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Remain open after selection</h4>
              <p>
                Select2 will automatically btn-close the dropdown when an
                element is selected, similar to what is done with a normal
                select box. You may use the
                <code>btn-closeOnSelect</code> option to prevent the dropdown
                from closing when a result is selected:
              </p>
            </div>
            <v-select
              id="remain-open"
              placeholder="Alabama"
              :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Dropdown placement</h4>
              <p>
                The <code>dropdownParent</code> option allows you to pick an
                alternative element for the dropdown to be appended to:
              </p>
            </div>
            <v-select
              id="dropdown-placement"
              placeholder="Alabama"
              :options="[{ title: 'Alabama' }, { title: 'Wyoming' }]"
              label="title"
            />
            <div id="select2-modal"></div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Limiting the number of selections</h4>
              <p>
                Select2 multi-value select boxes can set restrictions regarding
                the maximum number of options that can be selected. The select
                below is declared with the
                <code>multiple</code> attribute with
                <code>maximumSelectionLength</code> in the select2 options.
              </p>
            </div>
            <v-select
              id="limit-selection"
              multiple
              :options="[
                { title: 'Alabama' },
                { title: 'Wyoming' },
                { title: 'Lorem' },
                { title: 'Ipsum' },
                { title: 'Dolor' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Dynamic option creation</h4>
              <p>
                In addition to a prepopulated menu of options, Select2 can
                dynamically create new options from text input by the user in
                the search box. This feature is called "tagging". To enable
                tagging, set the <code>tags</code> option to <code>true</code>:
              </p>
            </div>
            <v-select
              id="dynamic-option-creation"
              placeholder="Red"
              :options="[
                { title: 'Red' },
                { title: 'Green' },
                { title: 'Yellow' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Tagging with multi-value select boxes</h4>
              <p>
                Tagging can also be used in multi-value select boxes. In the
                example below, we set the
                <code>multiple</code> attribute on a Select2 control that also
                has <code>tags: true</code> enabled:
              </p>
            </div>
            <v-select
              id="multi-value-select"
              multiple
              :options="[
                { title: 'orange' },
                { title: 'white' },
                { title: 'purple' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Single select placeholders</h4>
              <p>
                Select2 supports displaying a placeholder value using the
                <code>placeholder</code> configuration option. The placeholder
                value will be displayed until a selection is made.
              </p>
            </div>
            <v-select
              class="single-select-placeholder js-states"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Multi-select placeholders</h4>
              <p>
                For multi-selects, you must <strong>not</strong> have an empty
                <code>&lt;option&gt;</code>element:
              </p>
            </div>
            <v-select
              class="multi-select-placeholder js-states"
              multiple
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Default selection placeholders</h4>
              <p>
                Alternatively, the value of the <code>placeholder</code> option
                can be a data object representing a default selection
                (<code>&lt;option&gt;</code>). In this case the
                <code>id</code> of the data object should match the
                <code>value</code> of the corresponding default selection.
              </p>
            </div>
            <v-select
              class="default-placeholder"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Customizing how results are matched</h4>
              <p>
                When users filter down the results by entering search terms into
                the search box, Select2 uses an internal "matcher" to match
                search terms to results. You may customize the way that Select2
                matches search terms by specifying a callback for the
                <code>matcher</code> configuration option.
              </p>
            </div>
            <v-select
              class="customize-result"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Matching grouped options</h4>
              <p>
                Only first-level objects will be passed in to the
                <code>matcher</code> callback. If you are working with nested
                data, you must iterate through the <code>children</code> array
                and match them individually. This allows for more advanced
                matching when working with nested objects, allowing you to
                handle them however you want.
              </p>
            </div>
            <v-select
              class="match-grouped-options"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
                { title: 'Nevada' },
                { title: 'Oregon' },
                { title: 'Washington' },
                { title: 'Arizona' },
                { title: 'Colorado' },
                { title: 'Idaho' },
                { title: 'Mountana' },
                { title: 'Nebraska' },
                { title: 'New Mexic' },
                { title: 'Utah' },
                { title: 'Wyoming' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Minumum search term length</h4>
              <p>
                You may set a minimum search term length by using the
                <code>minimumInputLength</code> option:
              </p>
            </div>
            <v-select
              class="minimum-search-length"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Maximum search term length</h4>
              <p>
                You may limit the maximum length of search terms by using the
                <code>maximumInputLength</code> option:
              </p>
            </div>
            <v-select
              class="maximum-search-length"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Programmatically add new options</h4>
              <p>
                New options can be added to a Select2 control programmatically
                by creating a new Javascript
                <code>Option</code> object and appending it to the control:
              </p>
            </div>
            <v-select
              class="add-new-options"
              :options="[{ title: 'New Item' }]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Create if not exists</h4>
              <p>
                You can use <code>.find</code> to select the option if it
                already exists, and create it otherwise:
              </p>
            </div>
            <v-select
              class="create-if-not-exists"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Using jQuery selector</h4>
              <p>
                Selected items can also be accessed via the
                <code>:selected</code> jQuery selector:
              </p>
            </div>
            <v-select
              class="jquery-selector"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">RTL support</h4>
              <p>
                Select2 will work on RTL websites if the
                <code>dir</code> attribute is set on the
                <code>&lt;select&gt;</code
                ><span
                  class="copy-to-clipboard"
                  title="Copy to clipboard"
                ></span>
                or any parents of it. You can also initialize Select2 with the
                <code>dir: "rtl"</code
                ><span
                  class="copy-to-clipboard"
                  title="Copy to clipboard"
                ></span>
                configuration option.
              </p>
            </div>
            <v-select
              class="rtl-select2"
              dir="rtl"
              placeholder="Alaska"
              :options="[
                { title: 'Alaska' },
                { title: 'Hawaii' },
                { title: 'California' },
              ]"
              label="title"
            />
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Destroying the Select2 control</h4>
              <p>
                The <code>destroy</code> method will remove the Select2 widget
                from the target element. It will revert back to a standard
                <code>select</code> control:
              </p>
            </div>

            <div class="mb-4">
              <select v-if="Distroy">
                <option value="Alaska">Alaska</option>
                <option value="Hawaii">Hawaii</option>
                <option value="California">California</option>
              </select>
              <v-select
                v-else
                class="destroy-selector"
                placeholder="Alaska"
                :options="[
                  { title: 'Alaska' },
                  { title: 'Hawaii' },
                  { title: 'California' },
                ]"
                label="title"
              />
            </div>
            <button
              @click="Distroy = true"
              id="destroy-selector-trigger"
              class="btn btn-primary"
            >
              Destroy Select2
            </button>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Opening the dropdown</h4>
              <p>
                Select2 will trigger a few different events when different
                actions are taken using the component, allowing you to add
                custom hooks and perform actions.
              </p>
            </div>

            <div class="mb-4">
              <v-select
                class="opening-dropdown"
                ref="openDropDownMenu"
                placeholder="Alaska"
                :options="[
                  { title: 'Alaska' },
                  { title: 'Hawaii' },
                  { title: 'California' },
                ]"
                label="title"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Opening/Closing the dropdown</h4>
              <p>
                Select2 will trigger a few different events when different
                actions are taken using the component, allowing you to add
                custom hooks and perform actions.
              </p>
            </div>
            <div class="mt-4">
              <v-select
                class="open-close-dropdown"
                ref="openDropDownMenu"
                placeholder="Alaska"
                :options="[
                  { title: 'Alaska' },
                  { title: 'Hawaii' },
                  { title: 'California' },
                ]"
                label="title"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Select2 methods</h4>
              <p>
                Select2 has several built-in methods that allow programmatic
                control of the component.
              </p>
            </div>

            <label class="select2-label form-label">Single select</label> <br />
            <div class="mt-4">
              <v-select
                class="single-event-unbind"
                ref="openDropDownMenu"
                :options="[
                  { title: 'Alaska' },
                  { title: 'Hawaii' },
                  { title: 'California' },
                ]"
                label="title"
                placeholder="Alaska"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <h4 class="card-title">Select2 methods</h4>
              <p>
                Select2 has several built-in methods that allow programmatic
                control of the component.
              </p>
            </div>
            <label class="select2-label form-label">Multiple select</label>
            <br />
            <div class="mt-4">
              <v-select
                class="js-example-programmatic-multi"
                multiple
                ref="openDropDownMenu"
                :options="[{ title: 'Hawaii' }, { title: 'California' }]"
                label="title"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
// @ts-ignore
import vSelect from "vue-select";

export default {
  components: { vSelect },
  setup() {
    const DisablingSelect2 = ref(false);
    const Distroy = ref(false);
    return { DisablingSelect2, Distroy };
  },
  data() {
    return {
      selectedItem: null,
      items: [],
      books: [
        { title: "Old Man's War" },
        { title: "The Lock Artist" },
        { title: "HTML5" },
        { title: "Right Ho Jeeves" },
        { title: "The Code of the Wooster" },
        { title: "Thank You Jeeves" },
      ],
    };
  },
};
</script>

<style>
[data-theme-version="dark"] .select_option_2 {
  --selectbg: #242424;
  --border: #dfdfdf6b;
}

[data-theme-version="light"] .select_option_2 {
  --selectbg: #fff;
  --border: #44444460;
}

.vs__open-indicator {
  transform: scale(0.6) !important;
}

.vs--open .vs__open-indicator {
  transform: rotate(180deg) scale(0.6) !important;
}

.vs__dropdown-menu {
  background-color: var(--selectbg);
}

.vs__dropdown-toggle {
  border: 1px solid var(--border);
}

.vs__selected {
  color: var(--border);
}

.vs__selected {
  color: var(--primary);
  background-color: var(--rgba-primary-1);
}

.vs--multiple {
  color: var(--primary);
}
</style>
