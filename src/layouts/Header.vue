<!-- @format -->

<template>
  <div class="header">
    <div class="header-content">
      <nav class="navbar navbar-expand">
        <div class="collapse navbar-collapse justify-content-between">
          <div class="header-left">
            <div class="search_bar dropdown">
              <span class="search_icon p-3 c-pointer" data-bs-toggle="dropdown">
                <i class="mdi mdi-magnify"></i>
              </span>
              <div class="dropdown-menu p-0 m-0">
                <form>
                  <input class="form-control" type="search" placeholder="Search" aria-label="Search" />
                </form>
              </div>
            </div>
          </div>
          <ul class="navbar-nav header-right">
            <li class="nav-item dropdown notification_dropdown">
              <a :class="`nav-link bell dlab-theme-mode p-0 ${themeIcon ? 'active' : ''}`" href="javascript:void(0);" @click="mode">
                <i id="icon-light" class="fas fa-sun"></i>
                <i id="icon-dark" class="fas fa-moon"></i>
              </a>
            </li>
            <li class="nav-item dropdown notification_dropdown">
              <a class="nav-link bell-link" href="javascript:void(0);" @click="chatboxHandler">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22.871" viewBox="0 0 24 22.871">
                  <g data-name="Layer 2" transform="translate(-2 -2)">
                    <path
                      id="Path_9"
                      data-name="Path 9"
                      d="M23.268,2H4.73A2.733,2.733,0,0,0,2,4.73V17.471A2.733,2.733,0,0,0,4.73,20.2a.911.911,0,0,1,.91.91v1.94a1.82,1.82,0,0,0,2.83,1.514l6.317-4.212a.9.9,0,0,1,.5-.153h4.436a2.742,2.742,0,0,0,2.633-2L25.9,5.462A2.735,2.735,0,0,0,23.268,2Zm.879,2.978-3.539,12.74a.915.915,0,0,1-.88.663H15.292a2.718,2.718,0,0,0-1.514.459L7.46,23.051v-1.94a2.733,2.733,0,0,0-2.73-2.73.911.911,0,0,1-.91-.91V4.73a.911.911,0,0,1,.91-.91H23.268a.914.914,0,0,1,.879,1.158Z"
                      transform="translate(0 0)"
                    />
                    <path id="Path_10" data-name="Path 10" d="M7.91,10.82h4.55a.91.91,0,1,0,0-1.82H7.91a.91.91,0,1,0,0,1.82Z" transform="translate(-0.45 -0.63)" />
                    <path id="Path_11" data-name="Path 11" d="M16.1,13H7.91a.91.91,0,1,0,0,1.82H16.1a.91.91,0,1,0,0-1.82Z" transform="translate(-0.45 -0.99)" />
                  </g>
                </svg>
                <span class="badge light text-white bg-primary rounded-circle">76</span>
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
            <li class="nav-item dropdown notification_dropdown">
              <a class="nav-link ai-icon" href="javascript:void(0);" data-bs-toggle="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="23.262" height="24" viewBox="0 0 23.262 24">
                  <g id="icon" transform="translate(-1565 90)">
                    <path
                      id="setting_1_"
                      data-name="setting (1)"
                      d="M30.45,13.908l-1-.822a1.406,1.406,0,0,1,0-2.171l1-.822a1.869,1.869,0,0,0,.432-2.385L28.911,4.293a1.869,1.869,0,0,0-2.282-.818l-1.211.454a1.406,1.406,0,0,1-1.88-1.086l-.213-1.276A1.869,1.869,0,0,0,21.475,0H17.533a1.869,1.869,0,0,0-1.849,1.567L15.47,2.842a1.406,1.406,0,0,1-1.88,1.086l-1.211-.454a1.869,1.869,0,0,0-2.282.818L8.126,7.707a1.869,1.869,0,0,0,.432,2.385l1,.822a1.406,1.406,0,0,1,0,2.171l-1,.822a1.869,1.869,0,0,0-.432,2.385L10.1,19.707a1.869,1.869,0,0,0,2.282.818l1.211-.454a1.406,1.406,0,0,1,1.88,1.086l.213,1.276A1.869,1.869,0,0,0,17.533,24h3.943a1.869,1.869,0,0,0,1.849-1.567l.213-1.276a1.406,1.406,0,0,1,1.88-1.086l1.211.454a1.869,1.869,0,0,0,2.282-.818l1.972-3.415a1.869,1.869,0,0,0-.432-2.385ZM27.287,18.77l-1.211-.454a3.281,3.281,0,0,0-4.388,2.533l-.213,1.276H17.533l-.213-1.276a3.281,3.281,0,0,0-4.388-2.533l-1.211.454L9.75,15.355l1-.822a3.281,3.281,0,0,0,0-5.067l-1-.822L11.721,5.23l1.211.454A3.281,3.281,0,0,0,17.32,3.151l.213-1.276h3.943l.213,1.276a3.281,3.281,0,0,0,4.388,2.533l1.211-.454,1.972,3.414h0l-1,.822a3.281,3.281,0,0,0,0,5.067l1,.822ZM19.5,7.375A4.625,4.625,0,1,0,24.129,12,4.63,4.63,0,0,0,19.5,7.375Zm0,7.375A2.75,2.75,0,1,1,22.254,12,2.753,2.753,0,0,1,19.5,14.75Z"
                      transform="translate(1557.127 -90)"
                    ></path>
                  </g>
                </svg>

                <span class="badge light text-white bg-primary rounded-circle">15</span>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <div id="DZ_W_TimeLine02" class="widget-timeline dlab-scroll style-1 p-3 height370">
                  <ul class="timeline">
                    <li>
                      <div class="timeline-badge primary"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>10 minutes ago</span>
                        <h6 class="mb-0">Youtube, a video-sharing website, goes live <strong class="text-primary">$500</strong>.</h6>
                      </a>
                    </li>
                    <li>
                      <div class="timeline-badge info"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>20 minutes ago</span>
                        <h6 class="mb-0">New order placed <strong class="text-info">#XF-2356.</strong></h6>
                        <p class="mb-0">Quisque a consequat ante Sit amet magna at volutapt...</p>
                      </a>
                    </li>
                    <li>
                      <div class="timeline-badge danger"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>30 minutes ago</span>
                        <h6 class="mb-0">john just buy your product <strong class="text-warning">Sell $250</strong></h6>
                      </a>
                    </li>
                    <li>
                      <div class="timeline-badge success"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>15 minutes ago</span>
                        <h6 class="mb-0">StumbleUpon is acquired by eBay.</h6>
                      </a>
                    </li>
                    <li>
                      <div class="timeline-badge warning"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>20 minutes ago</span>
                        <h6 class="mb-0">Mashable, a news website and blog, goes live.</h6>
                      </a>
                    </li>
                    <li>
                      <div class="timeline-badge dark"></div>
                      <a class="timeline-panel text-muted" href="javascript:void(0);">
                        <span>20 minutes ago</span>
                        <h6 class="mb-0">Mashable, a news website and blog, goes live.</h6>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li class="nav-item dropdown header-profile">
              <a class="nav-link" href="javascript:void(0);" role="button" data-bs-toggle="dropdown">
                <img src="../assets/images/profile/education/pic1.jpg" width="20" alt="" />
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <RouterLink to="/app-profile" class="dropdown-item ai-icon">
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
                  <span class="ms-2">Profile </span>
                </RouterLink>
                <RouterLink to="/email-inbox" class="dropdown-item ai-icon">
                  <svg
                    id="icon-inbox"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-mail"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span class="ms-2">Inbox </span>
                </RouterLink>
                <a to="/page-login" class="dropdown-item ai-icon">
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
                  <span class="ms-2">Logout </span>
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
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";
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
    const store = useStore();
    const { openChatbox } = storeToRefs(store);
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

    return { openChatbox, size, title, themeIcon, bodyTheme };
  },
  methods: {
    chatboxHandler() {
      this.openChatbox = true;
    },
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
  },
});
</script>

<style scoped></style>
