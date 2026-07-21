<!-- @format -->

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Forms</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Wizard</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12 col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Form step</h4>
          </div>
          <div class="card-body">
            <div id="smartwizard" class="form-wizard order-create">
              <Steppy class="tab-content" v-model:step="step">
                <template #1>
                  <div id="wizard_Service" class="tab-pane" role="tabpanel">
                    <div class="row">
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">First Name<span class="required">*</span></label>
                          <input type="text" name="firstName" class="form-control" placeholder="Parsley" required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Last Name<span class="required">*</span></label>
                          <input type="text" name="lastName" class="form-control" placeholder="Montana" required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Email Address<span class="required">*</span></label>
                          <input type="email" class="form-control" id="inputGroupPrepend2"
                            aria-describedby="inputGroupPrepend2" placeholder="example@example.com.com" required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Phone Number<span class="required">*</span></label>
                          <input type="text" name="phoneNumber" class="form-control" placeholder="(+1)408-657-9007"
                            required />
                        </div>
                      </div>
                      <div class="col-lg-12 mb-3 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Where are you from<span class="required">*</span></label>
                          <input type="text" name="place" class="form-control" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template #2>
                  <div id="wizard_Time" class="tab-pane" role="tabpanel">
                    <div class="row">
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Company Name<span class="required">*</span></label>
                          <input type="text" name="firstName" class="form-control" placeholder="Cellophane Square"
                            required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Company Email Address<span
                              class="required">*</span></label>
                          <input type="email" class="form-control" id="emial1" placeholder="example@example.com.com"
                            required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Company Phone Number<span
                              class="required">*</span></label>
                          <input type="number" name="phoneNumber" class="form-control" placeholder="(+1)408-657-9007"
                            required />
                        </div>
                      </div>
                      <div class="col-lg-6 mb-2 wizard-colum">
                        <div class="mb-3">
                          <label class="text-dark form-label">Your position in Company<span
                              class="required">*</span></label>
                          <input type="text" name="place" class="form-control" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template #3>
                  <div id="wizard_Details" class="tab-pane" role="tabpanel">
                    <div class="row align-items-center">
                      <div class="col-sm-4 mb-2 text-start" style="color: var(--text-color) !important">
                        <h4>Monday *</h4>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="9.00" type="number" name="input1" id="input1" />
                        </div>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="6.00" type="number" name="input2" id="input2" />
                        </div>
                      </div>
                    </div>
                    <div class="row align-items-center">
                      <div class="col-sm-4 mb-2 text-start" style="color: var(--text-color) !important">
                        <h4>Tuesday *</h4>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="9.00" type="number" name="input3" id="input3" />
                        </div>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="6.00" type="number" name="input4" id="input4" />
                        </div>
                      </div>
                    </div>
                    <div class="row align-items-center">
                      <div class="col-sm-4 mb-2 text-start" style="color: var(--text-color) !important">
                        <h4>Wednesday *</h4>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="9.00" type="number" name="input5" id="input5" />
                        </div>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="6.00" type="number" name="input6" id="input6" />
                        </div>
                      </div>
                    </div>
                    <div class="row align-items-center">
                      <div class="col-sm-4 mb-2 text-start" style="color: var(--text-color) !important">
                        <h4>Thrusday *</h4>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="9.00" type="number" name="input7" id="input7" />
                        </div>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="6.00" type="number" name="input8" id="input8" />
                        </div>
                      </div>
                    </div>
                    <div class="row align-items-center">
                      <div class="col-sm-4 mb-2 text-start" style="color: var(--text-color) !important">
                        <h4>Friday *</h4>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="9.00" type="number" name="input9" id="input9" />
                        </div>
                      </div>
                      <div class="col-6 col-sm-4 mb-2">
                        <div class="mb-3">
                          <input class="form-control" value="6.00" type="number" name="input10" id="input10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template #4>
                  <div id="wizard_Payment" class="tab-pane" role="tabpanel">
                    <div class="row emial-setup">
                      <div class="col-lg-3 col-sm-6 col-6">
                        <div class="mb-3">
                          <label for="mailclient11" class="mailclinet mailclinet-gmail">
                            <input type="radio" name="emailclient" id="mailclient11" />
                            <span class="mail-icon">
                              <i class="mdi mdi-google-plus" aria-hidden="true"></i>
                            </span>
                            <span class="mail-text">I'm using Gmail</span>
                          </label>
                        </div>
                      </div>
                      <div class="col-lg-3 col-sm-6 col-6">
                        <div class="mb-3">
                          <label for="mailclient12" class="mailclinet mailclinet-office">
                            <input type="radio" name="emailclient" id="mailclient12" />
                            <span class="mail-icon">
                              <i class="mdi mdi-office" aria-hidden="true"></i>
                            </span>
                            <span class="mail-text">I'm using Office</span>
                          </label>
                        </div>
                      </div>
                      <div class="col-lg-3 col-sm-6 col-6">
                        <div class="mb-3">
                          <label for="mailclient13" class="mailclinet mailclinet-drive">
                            <input type="radio" name="emailclient" id="mailclient13" />
                            <span class="mail-icon">
                              <i class="mdi mdi-google-drive" aria-hidden="true"></i>
                            </span>
                            <span class="mail-text">I'm using Drive</span>
                          </label>
                        </div>
                      </div>
                      <div class="col-lg-3 col-sm-6 col-6">
                        <div class="mb-3">
                          <label for="mailclient14" class="mailclinet mailclinet-another">
                            <input type="radio" name="emailclient" id="mailclient14" />
                            <span class="mail-icon">
                              <i class="fa fa-question-circle" aria-hidden="true"></i>
                            </span>
                            <span class="mail-text">Another Service</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="skip-email text-center">
                          <p>
                            Or if want skip this step entirely and setup it
                            later
                          </p>
                          <a href="javascript:void(0)">Skip step</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Steppy>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// @ts-ignore
import { Steppy } from "vue3-steppy";

export default defineComponent({
  name: "formWizard",
  components: { Steppy },
  setup() {
    const step = ref(1);
    return { step };
  },
});
</script>

<style>
[data-theme-version="dark"] .form-wizard {
  --wizardbg: #182237;
  --text-color: #fff;
}

[data-theme-version="light"] .form-wizard {
  --wizardbg: #fff;
  --text-color: #182237;
}

.card .card-body .steppy-item.current .steppy-item-counter {
  border-color: var(--primary);
  background-color: var(--primary);
  width: 48px !important;
  height: 48px !important;
}

.card .card-body .wrapper-steppy {
  padding: 0;
}

.steppy-item.success .steppy-item-counter {
  width: 48px !important;
  height: 48px !important;
}

.steppy-item-counter {
  width: 48px !important;
  height: 48px !important;
}

.card .card-body .steppy-item.success .steppy-item-counter {
  border-color: var(--primary);
  background-color: var(--primary);
}

.card .card-body .steppy-progress-bar {
  background-color: var(--primary);
}

.card .card-body .steppy-item.success .steppy-item-counter .icon-success {
  fill: #fff !important;
}

.card .card-body .steppy-item-title {
  display: none;
}

.card .card-body .steppy-pane {
  box-shadow: none;
  background: transparent !important;
}

.card .card-body .wizard-colum div {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.card .card-body .btn--default-2 {
  background-color: var(--primary);
  border: 0;
  padding: 0.75rem 1.125rem;
  color: #fff;
  border-radius: 0.25rem;
  font-weight: 400;
}

.card .card-body .steppy-pane {
  background-color: var(--wizardbg);
}
</style>
