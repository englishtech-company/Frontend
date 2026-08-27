<!-- @format -->

<template>
  <div class="header">
    <div class="header-content">
      <nav class="navbar navbar-expand">
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav header-right">
            <li class="nav-item dropdown notification_dropdown">
              <a :class="`nav-link bell dlab-theme-mode p-0 ${themeIcon ? 'active' : ''}`" href="javascript:void(0);" @click="mode">
                <i id="icon-light" class="fas fa-sun"></i>
                <i id="icon-dark" class="fas fa-moon"></i>
              </a>
            </li>
            <li class="nav-item dropdown notification_dropdown">
              <a class="nav-link bell ai-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown">
                <svg
                  id="icon-user"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-bell"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <div class="pulse-css"></div>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <ul class="list-unstyled">
                  <li class="media dropdown-item align-items-center gap-3">
                    <span class="success"><i class="ti-user"></i></span>
                    <div class="media-body">
                      <a href="javascript:void(0);">
                        <p><strong>Martin</strong> has added a <strong>customer</strong> Successfully</p>
                      </a>
                    </div>
                    <span class="notify-time">3:20 am</span>
                  </li>
                  <li class="media dropdown-item align-items-center gap-3">
                    <span class="primary"><i class="ti-shopping-cart"></i></span>
                    <div class="media-body">
                      <a href="javascript:void(0);">
                        <p><strong>Jennifer</strong> purchased Light Dashboard 2.0.</p>
                      </a>
                    </div>
                    <span class="notify-time">3:20 am</span>
                  </li>
                  <li class="media dropdown-item align-items-center gap-3">
                    <span class="danger"><i class="ti-bookmark"></i></span>
                    <div class="media-body">
                      <a href="javascript:void(0);">
                        <p><strong>Robin</strong> marked a <strong>ticket</strong> as unsolved.</p>
                      </a>
                    </div>
                    <span class="notify-time">3:20 am</span>
                  </li>
                  <li class="media dropdown-item align-items-center gap-3">
                    <span class="primary"><i class="ti-heart"></i></span>
                    <div class="media-body">
                      <a href="javascript:void(0);">
                        <p><strong>David</strong> purchased Light Dashboard 1.0.</p>
                      </a>
                    </div>
                    <span class="notify-time">3:20 am</span>
                  </li>
                  <li class="media dropdown-item align-items-center gap-3">
                    <span class="success"><i class="ti-image"></i></span>
                    <div class="media-body">
                      <a href="javascript:void(0);">
                        <p><strong> James.</strong> has added a<strong>customer</strong> Successfully</p>
                      </a>
                    </div>
                    <span class="notify-time">3:20 am</span>
                  </li>
                </ul>
                <a class="all-notification" href="javascript:void(0);">See all notifications <i class="ti-arrow-right"></i></a>
              </div>
            </li>
            <li class="nav-item dropdown header-profile">
              <a class="nav-link" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-label="Menu do usuário">
                <span class="header-profile__icon">
                  <i class="fa fa-user" aria-hidden="true"></i>
                </span>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <RouterLink to="/profile" class="dropdown-item ai-icon">
                  <svg
                    id="icon-user1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-user"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span class="ms-2">Perfil</span>
                </RouterLink>
                <a href="#" class="dropdown-item ai-icon" @click.prevent="logoutHandler">
                  <svg
                    id="icon-logout"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-log-out"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span class="ms-2">Logout</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>

  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Job Title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Company Name<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="Name" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Position<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="Name" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Job Category<span class="text-danger scale5 ms-2">*</span></label>
              <div class="dropdown bootstrap-select nice-select default-select wide form-control solid">
                <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'QA Analyst' }, { title: 'IT Manager' }, { title: 'Systems Analyst' }]" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Job Type<span class="text-danger scale5 ms-2">*</span></label>
              <div class="dropdown bootstrap-select nice-select default-select wide form-control solid">
                <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'Part-Time' }, { title: 'Full-Time' }, { title: 'Freelencer' }]" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">No. of Vancancy<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="Name" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Select Experience<span class="text-danger scale5 ms-2">*</span></label>
              <div class="dropdown bootstrap-select nice-select default-select wide form-control solid dropup">
                <JobSelectOption :options="[{ title: '1 yr' }, { title: '2 yr' }, { title: '3 yr' }, { title: '4 yr' }]" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Posted Date<span class="text-danger scale5 ms-2">*</span></label>
              <div class="input-group">
                <div class="input-group-text"><i class="far fa-clock"></i></div>
                <input type="date" name="datepicker" class="form-control" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Last Date To Apply<span class="text-danger scale5 ms-2">*</span></label>
              <div class="input-group">
                <div class="input-group-text"><i class="far fa-clock"></i></div>
                <input type="date" name="datepicker" class="form-control" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Close Date<span class="text-danger scale5 ms-2">*</span></label>
              <div class="input-group">
                <div class="input-group-text"><i class="far fa-clock"></i></div>
                <input type="date" name="datepicker" class="form-control" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Select Gender:<span class="text-danger scale5 ms-2">*</span></label>
              <div class="dropdown bootstrap-select nice-select default-select wide form-control solid dropup">
                <JobSelectOption :options="[{ title: 'Choose...' }, { title: 'Male' }, { title: 'Female' }]" />
              </div>
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Salary Form<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="$" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Salary To<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="$" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Enter City:<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="$" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Enter State:<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="State" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Enter Counter:<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="State" aria-label="name" />
            </div>
            <div class="col-xl-6 col-md-6 mb-4">
              <label class="form-label font-w600">Enter Education Level:<span class="text-danger scale5 ms-2">*</span></label>
              <input type="text" class="form-control solid" placeholder="Education Level" aria-label="name" />
            </div>
            <div class="col-xl-12 mb-4">
              <label class="form-label font-w600">Description:<span class="text-danger scale5 ms-2">*</span></label>
              <textarea class="form-control solid" rows="5" aria-label="With textarea"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, watch } from "vue";
import { SVGImage } from "@/constent/Theme";
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";
import router from "@/router";
import JobSelectOption from "@/elements/JobSelectOption.vue";

export default defineComponent({
  name: "header_",
  components: { RouterLink, JobSelectOption },
  data() {
    return SVGImage;
  },
  setup() {
    const auth = useAuthStore();
    const size = ref(false);
    const title = ref("Dashboard");
    const themeIcon = ref(false);
    const bodyTheme = ref<string | any>("light");
    watchEffect(() => {
      const pageTitle = router.currentRoute.value.fullPath.split("/");
      if (pageTitle[1] == "" || pageTitle[1] == "dark") {
        title.value = "Dashboard";
      } else {
        title.value = String(router.currentRoute.value.name == "light" || router.currentRoute.value.name == "dark" ? "Dashboard" : router.currentRoute.value.name);
      }
    });

    const observer = new MutationObserver(() => {
      bodyTheme.value = document.body.getAttribute("data-theme-version");
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme-version"],
    });
    watch(
      bodyTheme,
      (from) => {
        from == "dark" ? (themeIcon.value = true) : (themeIcon.value = false);
      },
      { immediate: true }
    );

    return { size, title, themeIcon, bodyTheme, auth };
  },
  methods: {
    fullScreen() {
      this.size = !this.size;
      if (document.querySelector("html")) {
        !document.querySelector("html")?.requestFullscreen() ? document.querySelector("html")?.requestFullscreen() : document.exitFullscreen();
      }
    },
    mode() {
      if (this.bodyTheme == "light") {
        document.body.setAttribute("data-theme-version", "dark");
      } else {
        document.body.setAttribute("data-theme-version", "light");
      }
    },
    async logoutHandler() {
      await this.auth.logout();
      await router.push("/page-login");
    },
  },
});
</script>

<style scoped>
.header-profile__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #e9ecef;
  color: var(--primary, #600024);
  font-size: 1rem;
}
</style>
