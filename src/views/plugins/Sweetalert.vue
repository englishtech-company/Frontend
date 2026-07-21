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
          <li class="breadcrumb-item">
            <a href="javascript:void(0)">Components</a>
          </li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Sweet Alert</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Wrong</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-danger btn sweet-wrong" @click="showAlert('wrong')">
                  Sweet Wrong
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Message</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-info btn sweet-message" @click="showAlert('message')">
                  Sweet Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Text</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-primary btn sweet-text" @click="showAlert('text')">
                  Sweet Text
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Success</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-success btn sweet-success" @click="showAlert('success')">
                  Sweet Success
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Confirm</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-warning btn sweet-confirm" @click="showAlert('confirm')">
                  Sweet Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Confirm Or Cancel</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-warning btn sweet-success-cancel" @click="showAlert('cancel')">
                  Sweet Confirm Or Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Image Message</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-info btn sweet-image-message" @click="showAlert('image-message')">
                  Sweet Image Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet HTML</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-primary btn sweet-html" @click="showAlert('html')">
                  Sweet HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Auto Close</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-danger btn sweet-auto" @click="showAlert('auto')">
                  Sweet Auto btn-close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Prompt</h4>
            <div class="card-content">
              <div class="sweetalert">
                <button class="btn btn-success btn sweet-prompt" @click="showAlert('prompt')">
                  Sweet Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Sweet Ajax</h4>
            <div class="card-content"></div>
            <div class="sweetalert">
              <button class="btn btn-info btn sweet-ajax" @click="showAlert('ajax')">
                Sweet Ajax
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// @ts-ignore
import Swal from "sweetalert2";
import IMAGE from "@/constent/Theme";

export default defineComponent({
  name: "sweetalerts_",
  components: {},
  setup() {
    return {};
  },
  methods: {
    showAlert(value: string) {
      switch (value) {
        case "wrong":
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong !!",
          });
          break;
        case "message":
          Swal.fire("Hey, Here s a message !!");
          break;
        case "text":
          Swal.fire({
            title: "Hey, Here s a message !!",
            text: "It s pretty, isn t it?",
          });
          break;
        case "success":
          Swal.fire({
            icon: "success",
            title: "Success Alert",
            text: "This is a success alert.",
          });
          break;
        case "confirm":
          Swal.fire({
            icon: "warning",
            title: "Are you sure to delete ?",
            text: "You will not be able to recover this imaginary file !!",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            showCancelButton: true,
          });
          break;
        case "cancel":
          Swal.fire({
            icon: "warning",
            title: "Are you sure to delete ?",
            text: "You will not be able to recover this imaginary file !!",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            showCancelButton: true,
          });
          break;
        case "image-message":
          Swal.fire({
            imageUrl: IMAGE.imageHand,
            title: "Sweet !!",
            text: "true",
          });
          break;
        case "html":
          Swal.fire({
            title: "Sweet !!",
            text: "true",
          });
          break;
        case "auto":
          Swal.fire({
            title: "Sweet auto close alert !!",
            text: "Hey, i will close in 2 seconds !!",
          });
          setTimeout(() => {
            Swal.close();
          }, 2000);
          break;

        case "prompt":
          Swal.fire({
            title: "Enter an input !!",
            text: "Write something interesting !!",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            showCancelButton: true,
          });
          break;
        case "ajax":
          Swal.fire({
            icon: "warning",
            title: "Sweet ajax request !!",
            text: "Submit to run ajax request !!",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
            showCancelButton: true,
          });
          break;
        default:
          break;
      }
    },
  },
});
</script>
<style>
.swal2-image {
  width: 20% !important;
}
</style>
