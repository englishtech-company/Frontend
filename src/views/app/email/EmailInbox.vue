<!-- @format -->

<template>
  <div class="container-fluid">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Email</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Inbox</a></li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div :class="`col-lg-3 email-left-body ${toggleSidebar ? 'active' : ''}`">
                <EmailRightContent />
              </div>
              <div class="col-lg-9">
                <div class="email-right-box">
                  <div role="toolbar" class="toolbar ms-1 ms-sm-0 ms-xl-1 d-flex align-items-center">
                    <div class="btn-group mb-1">
                      <div class="form-check custom-checkbox">
                        <input type="checkbox" class="form-check-input" id="checkAll" @click="allCheckInputs = !allCheckInputs" />
                        <label class="form-check-label" for="checkAll"></label>
                      </div>
                    </div>
                    <div class="btn-group mb-1">
                      &nbsp;
                      <button class="btn btn-primary light px-3" type="button">
                        <i class="ti-reload"></i>
                      </button>
                    </div>
                    <div class="btn-group mb-1">
                      &nbsp;
                      <button aria-expanded="false" data-bs-toggle="dropdown" class="btn btn-primary px-3 light dropdown-toggle" type="button">More <span class="caret"></span></button>
                      <div class="dropdown-menu" style="">
                        <a href="javascript: void(0);" class="dropdown-item">Mark as Unread</a>
                        <a href="javascript: void(0);" class="dropdown-item">Add to Tasks</a>
                        <a href="javascript: void(0);" class="dropdown-item">Add Star</a>
                        <a href="javascript: void(0);" class="dropdown-item">Mute</a>
                      </div>
                    </div>
                    <div :class="`email-tools-box float-end mb-2 ${toggleSidebar ? 'active' : ''}`" @click="toggleSidebar = !toggleSidebar">
                      <i class="fa-solid fa-list-ul"></i>
                    </div>
                    <form class="form-head style-1 d-none d-sm-block ms-auto">
                      <div class="input-group search-area ms-auto w-100 d-inline-flex">
                        <input type="text" class="form-control" placeholder="Search here" />
                        <span class="input-group-text"
                          ><button class="bg-transparent border-0"><i class="flaticon-381-search-2"></i></button
                        ></span>
                      </div>
                    </form>
                  </div>
                  <div class="email-list mt-3">
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox2" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox2"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Ingredia Nutrisha, A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox3" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox3"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox4" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox4"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox5" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox5"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox6" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox6"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Ingredia Nutrisha, A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox7" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox7"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox8" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox8"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message unread">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox9" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox9"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message unread">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox10" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox10"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Ingredia Nutrisha, A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox11" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox11"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox12" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox12"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox13" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox13"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox14" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox14"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Ingredia Nutrisha, A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message unread">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox15" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox15"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox16" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox16"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox17" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox17"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox18" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox18"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Ingredia Nutrisha, A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox19" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox19"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message unread">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox20" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox20"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of</div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="message">
                      <div>
                        <div class="d-flex message-single">
                          <div class="ps-1 align-self-center">
                            <div class="form-check custom-checkbox">
                              <input type="checkbox" class="form-check-input" id="checkbox21" :checked="allCheckInputs" />
                              <label class="form-check-label" for="checkbox21"></label>
                            </div>
                          </div>
                          <div class="ms-2">
                            <button class="border-0 bg-transparent align-middle p-0">
                              <i class="fa fa-star" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                        <RouterLink to="/email-read" class="col-mail col-mail-2">
                          <div class="subject">
                            Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of
                          </div>
                          <div class="date">11:49 am</div>
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                  <!-- panel -->
                  <div class="row mt-4">
                    <div class="col-12 ps-3">
                      <nav>
                        <ul class="pagination pagination-gutter pagination-primary pagination-sm no-bg">
                          <li class="page-item page-indicator">
                            <a class="page-link" href="javascript:void()"><i class="la la-angle-left"></i></a>
                          </li>
                          <li class="page-item">
                            <a class="page-link" href="javascript:void()">1</a>
                          </li>
                          <li class="page-item active">
                            <a class="page-link" href="javascript:void()">2</a>
                          </li>
                          <li class="page-item">
                            <a class="page-link" href="javascript:void()">3</a>
                          </li>
                          <li class="page-item">
                            <a class="page-link" href="javascript:void()">4</a>
                          </li>
                          <li class="page-item page-indicator">
                            <a class="page-link" href="javascript:void()"><i class="la la-angle-right"></i></a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import EmailRightContent from "@/elements/EmailRightContent.vue";
import { emailInboxData } from "@/elements/TableArrayData";
import { RouterLink } from "vue-router";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "emailInbox",
  components: { EmailRightContent, RouterLink },
  data() {
    return {
      emailInboxData,
      toggleSidebar: false,
    };
  },
  setup() {
    const { emaiComposeMenuToggle } = storeToRefs(useStore());
    const allCheckInputs = ref(false);
    return { allCheckInputs, emaiComposeMenuToggle };
  },
});
</script>

<style scoped></style>
