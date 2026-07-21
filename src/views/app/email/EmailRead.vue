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
          <li class="breadcrumb-item active"><a href="javascript:void(0)">Read</a></li>
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
                  <div :class="`email-tools-box float-end mb-2 ${toggleSidebar ? 'active' : ''}`" @click="toggleSidebar = !toggleSidebar">
                    <i class="fa-solid fa-list-ul"></i>
                  </div>

                  <div class="right-box-padding">
                    <div class="toolbar mb-4 mt-0" role="toolbar">
                      <div class="btn-group mb-1 me-1">
                        <button type="button" class="btn btn-primary light px-3"><i class="fa fa-archive"></i></button>
                        <button type="button" class="btn btn-primary light px-3"><i class="fa fa-exclamation-circle"></i></button>
                        <button type="button" class="btn btn-primary light px-3"><i class="fa fa-trash"></i></button>
                      </div>
                      <div class="btn-group mb-1 me-1">
                        <button type="button" class="btn btn-primary light dropdown-toggle px-3" data-bs-toggle="dropdown"><i class="fa fa-folder"></i> <b class="caret m-l-5"></b></button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item" href="javascript: void(0);">Social</a>
                          <a class="dropdown-item" href="javascript: void(0);">Promotions</a>
                          <a class="dropdown-item" href="javascript: void(0);">Updates</a>
                          <a class="dropdown-item" href="javascript: void(0);">Forums</a>
                        </div>
                      </div>
                      <div class="btn-group mb-1 me-1">
                        <button type="button" class="btn btn-primary light dropdown-toggle px-3" data-bs-toggle="dropdown"><i class="fa fa-tag"></i> <b class="caret m-l-5"></b></button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item" href="javascript: void(0);">Updates</a>
                          <a class="dropdown-item" href="javascript: void(0);">Social</a>
                          <a class="dropdown-item" href="javascript: void(0);">Promotions</a>
                          <a class="dropdown-item" href="javascript: void(0);">Forums</a>
                        </div>
                      </div>
                      <div class="btn-group mb-1">
                        <button type="button" class="btn btn-primary light dropdown-toggle v" data-bs-toggle="dropdown">More <span class="caret m-l-5"></span></button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item" href="javascript: void(0);">Mark as Unread</a> <a class="dropdown-item" href="javascript: void(0);">Add to Tasks</a>
                          <a class="dropdown-item" href="javascript: void(0);">Add Star</a> <a class="dropdown-item" href="javascript: void(0);">Mute</a>
                        </div>
                      </div>
                    </div>
                    <div class="read-content">
                      <div class="media pt-3 d-sm-flex d-block justify-content-between">
                        <div class="clearfix mb-3 d-flex align-items-center">
                          <img class="me-3 rounded" alt="image" src="../../../assets/images/avatar/1.jpg" width="70" height="70" />
                          <div class="media-body me-2">
                            <h5 class="text-primary mb-0 mt-1">Ingredia Nutrisha</h5>
                            <p class="mb-0">20 May 2021</p>
                          </div>
                        </div>
                        <div class="clearfix mb-3">
                          <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-title="Reply" class="btn btn-primary px-3 my-1 light me-2"><i class="fa fa-reply"></i> </a>
                          <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-title="Forward" class="btn btn-primary px-3 my-1 light me-2"><i class="fas fa-arrow-right"></i> </a>
                          <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-title="Deleted" class="btn btn-primary px-3 my-1 light me-2"><i class="fa fa-trash"></i></a>
                        </div>
                      </div>
                      <hr />
                      <div class="media mb-2 mt-3">
                        <div class="media-body">
                          <span class="float-end">07:23 AM</span>
                          <h5 class="my-1 text-primary">A collection of textile samples lay spread</h5>
                          <p class="read-content-email">To: Me, info@example.com</p>
                        </div>
                      </div>
                      <div class="read-content-body">
                        <h5 class="mb-4">Hi,Ingredia,</h5>
                        <p class="mb-2">
                          <strong>Ingredia Nutrisha,</strong> A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture
                        </p>
                        <p class="mb-2">
                          Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum
                          decided to leave for the far World of Grammar. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
                          dapibus in, viverra quis, feugiat a, tellus.
                        </p>
                        <p class="mb-2">
                          Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
                          Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam
                          rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
                        </p>
                        <h5 class="pt-3">Kind Regards</h5>
                        <p>Mr Smith</p>
                        <hr />
                      </div>
                      <button class="btn btn-secondary btn-sm me-1"><i class="fa-solid fa-reply me-1"></i>Reply</button>
                      <button class="btn btn-primary btn-sm"><i class="fa-solid fa-forward me-1"></i>Forward</button>
                      <hr />
                      <div class="mb-3 pt-3">
                        <textarea name="write-email" id="write-email" cols="30" rows="5" class="form-control" placeholder="It's really an amazing.I want to know more about it..!"></textarea>
                      </div>
                    </div>
                    <div class="text-end">
                      <button class="btn btn-primary" type="button">Send</button>
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
import { defineComponent, reactive } from "vue";
import EmailRightContent from "@/elements/EmailRightContent.vue";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "email_",
  components: { EmailRightContent },
  data() {
    return {
      tootipIcon: [
        { icon: "fa fa-reply", name: "Reply" },
        { icon: "fa fa-arrow-right", name: "Forward" },
        { icon: "fa fa-trash", name: "Delet" },
      ],
      toggleSidebar: false,
    };
  },
  setup() {
    const { emaiComposeMenuToggle } = storeToRefs(useStore());
    const tooltip = reactive({
      reply: false,
      index: NaN,
    });
    return { emaiComposeMenuToggle, tooltip };
  },
});
</script>
