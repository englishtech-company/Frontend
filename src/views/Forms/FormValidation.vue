<!-- @format -->

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-1">Validation</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Form</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Validation</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Form Validation</h4>
          </div>
          <div class="card-body">
            <div :class="`form-validation ${formValid ? 'was-validated' : ''}`">
              <form class="needs-validation" novalidate @submit.prevent="checkForm">
                <div class="row">
                  <div class="col-xl-6">
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom01">Username
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="text" class="form-control" id="validationCustom01" placeholder="Enter a username.."
                          required>
                        <div class="invalid-feedback">
                          Please enter a username.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom02">Email <span
                          class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="text" class="form-control" id="validationCustom02" placeholder="Your valid email.."
                          required>
                        <div class="invalid-feedback">
                          Please enter a Email.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom03">Password
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <div class="input-group pass-group">
                          <input type="password" class="form-control pass-input" id="validationCustom03"
                            placeholder="Choose a safe one.." required>
                          <span class="input-group-text pass-handle">
                            <i class="fa fa-eye-slash"></i>
                            <i class="fa fa-eye"></i>
                          </span>
                        </div>
                        <div class="invalid-feedback">
                          Please enter a password.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom04">Suggestions <span
                          class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <textarea class="form-control" id="validationCustom04" rows="5"
                          placeholder="What would you like to see?" required></textarea>
                        <div class="invalid-feedback">
                          Please enter a Suggestions.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6">
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom05">Best Skill
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <div class="dropdown bootstrap-select default-select wide form-control dropup"><select
                            class="default-select wide form-control" id="validationCustom05">
                            <option data-display="Select">Please select</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="javascript">JavaScript</option>
                            <option value="angular">Angular</option>
                            <option value="angular">React</option>
                            <option value="vuejs">Vue.js</option>
                            <option value="ruby">Ruby</option>
                            <option value="php">PHP</option>
                            <option value="asp">ASP.NET</option>
                            <option value="python">Python</option>
                            <option value="mysql">MySQL</option>
                          </select><button type="button" tabindex="-1" class="btn dropdown-toggle btn-light"
                            data-bs-toggle="dropdown" role="combobox" aria-owns="bs-select-1" aria-haspopup="listbox"
                            aria-expanded="false" title="Please select" data-id="validationCustom05">
                            <div class="filter-option">
                              <div class="filter-option-inner">
                                <div class="filter-option-inner-inner">Please select</div>
                              </div>
                            </div>
                          </button>
                          <div class="dropdown-menu " style="max-height: 308.6px; overflow: hidden; min-height: 130px;">
                            <div class="inner show" role="listbox" id="bs-select-1" tabindex="-1"
                              style="max-height: 292.6px; overflow-y: auto; min-height: 114px;"
                              aria-activedescendant="bs-select-1-0">
                              <ul class="dropdown-menu inner show" role="presentation"
                                style="margin-top: 0px; margin-bottom: 0px;">
                                <li class="selected active"><a role="option" class="dropdown-item active selected"
                                    id="bs-select-1-0" tabindex="0" aria-setsize="12" aria-posinset="1"
                                    aria-selected="true"><span class="text">Please select</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-1" tabindex="0"><span
                                      class="text">HTML</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-2" tabindex="0"><span
                                      class="text">CSS</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-3" tabindex="0"><span
                                      class="text">JavaScript</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-4" tabindex="0"><span
                                      class="text">Angular</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-5" tabindex="0"><span
                                      class="text">React</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-6" tabindex="0"><span
                                      class="text">Vue.js</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-7" tabindex="0"><span
                                      class="text">Ruby</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-8" tabindex="0"><span
                                      class="text">PHP</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-9" tabindex="0"><span
                                      class="text">ASP.NET</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-10" tabindex="0"><span
                                      class="text">Python</span></a></li>
                                <li><a role="option" class="dropdown-item" id="bs-select-1-11" tabindex="0"><span
                                      class="text">MySQL</span></a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div class="invalid-feedback">
                          Please select a one.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom06">Currency
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="text" class="form-control" id="validationCustom06" placeholder="$21.60" required>
                        <div class="invalid-feedback">
                          Please enter a Currency.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom07">Website
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="text" class="form-control" id="validationCustom07" placeholder="http://example.com"
                          required>
                        <div class="invalid-feedback">
                          Please enter a url.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom08">Phone (US)
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="number" maxlength="10" class="form-control" id="validationCustom08"
                          placeholder="212-999-0000" required>
                        <div class="invalid-feedback">
                          Please enter a phone no.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom09">Digits <span
                          class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="number" class="form-control" id="validationCustom09" placeholder="5" required>
                        <div class="invalid-feedback">
                          Please enter a digits.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom10">Number <span
                          class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="number" class="form-control" id="validationCustom10" placeholder="5.0" required>
                        <div class="invalid-feedback">
                          Please enter a num.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label" for="validationCustom11">Range [1, 5]
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-6">
                        <input type="number" class="form-control" id="validationCustom11" placeholder="4" required>
                        <div class="invalid-feedback">
                          Please select a range.
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label class="col-lg-4 col-form-label"><a href="javascript:void(0)">Terms &amp; Conditions</a>
                        <span class="text-danger">*</span>
                      </label>
                      <div class="col-lg-8">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" value="" id="validationCustom12" required>
                          <label class="form-check-label" for="validationCustom12">
                            Agree to terms and conditions
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <div class="col-lg-8 ms-auto">
                        <button type="submit" class="btn btn-primary">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Vertical Forms with icon</h4>
          </div>
          <div class="card-body">
            <div class="basic-form">
              <form :class="`form-valide-with-icon needs-validation ${formValid2 ? 'was-validated' : ''
              }`" novalidate @submit.prevent="checkForm2">
                <div class="mb-3">
                  <label class="text-label form-label" for="validationCustomUsername">Username</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fa fa-user"></i>
                    </span>
                    <input type="text" class="form-control" id="validationCustomUsername"
                      placeholder="Enter a username.." required />
                    <div class="invalid-feedback">Please Enter a username.</div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="text-label form-label" for="dz-password">Password *</label>
                  <div class="input-group transparent-append">
                    <span class="input-group-text">
                      <i class="fa fa-lock"></i>
                    </span>
                    <input :type="`${showHide ? 'text' : 'password'}`" class="form-control" id="dz-password"
                      placeholder="Choose a safe one.." required />
                    <span :class="`input-group-text show-pass ${showHide ? 'active' : ''
              }`" @click="showHide = !showHide">
                      <i class="fa fa-eye-slash"></i>
                      <i class="fa fa-eye"></i>
                    </span>
                    <div class="invalid-feedback">Please Enter a username.</div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="invalidCheck2" required />
                    <label class="form-check-label" for="invalidCheck2">
                      Check Me out
                    </label>
                  </div>
                </div>
                <button type="submit" class="btn me-2 btn-primary">
                  Submit
                </button>
                <button type="submit" class="btn btn-danger light">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import JobSelectOption from "@/elements/JobSelectOption.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "formValidation",
  components: { JobSelectOption },
  data() {
    return {};
  },
  setup() {
    const formValid = ref(false);
    const formValid2 = ref(false);
    const showHide = ref(false);
    const checkForm = () => {
      formValid.value = true;
    };
    const checkForm2 = () => {
      formValid2.value = true;
    };
    return { checkForm, formValid, formValid2, checkForm2, showHide };
  },
});
</script>

<style scoped></style>
