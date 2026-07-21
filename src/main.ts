import "bootstrap";
import "vue3-colorpicker/style.css";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/assets/css/bootstrap-select.min.css";
import "vue-select/dist/vue-select.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "vue3-toastify/dist/index.css";
import "@vuepic/vue-datepicker/dist/main.css";
// import 'swiper/css/scrollbar';
import "swiper/css";
// import "@/assets/other/jquery-smartwizard/dist/css/smart_wizard_all.min.css";
import "@/assets/css/common.css";
import "@/assets/css/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import VueDatePicker from "@vuepic/vue-datepicker";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");

// main.ts

// app.use(Vue3Toastify, {
//     autoClose: 3000,
// } as ToastContainerOptions);

// // app.use(CKEditor);
// app.component("VueDatePicker", VueDatePicker);
