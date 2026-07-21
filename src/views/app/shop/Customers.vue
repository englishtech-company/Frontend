<!-- @format -->

<template>
  <div class="container-fluid mh-auto">
    <div class="row page-titles mx-0">
      <div class="col-sm-6 p-md-0">
        <div class="welcome-text">
          <h4>Hi, welcome back!</h4>
          <p class="mb-0">Your business dashboard template</p>
        </div>
      </div>
      <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0)">Shop</a></li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Customers</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm mb-0 table-striped">
                <thead>
                  <tr>
                    <th class=" pe-3">
                      <div class="custom-control form-check mx-2">
                        <input type="checkbox" class="form-check-input" id="checkAll" @click="inputs = !inputs">
                        <label class="form-check-label" for="checkAll"></label>
                      </div>
                    </th>
                    <th style="min-width: 15rem;">Name</th>
                    <th>Email</th>
                    <th style="min-width: 10rem;">Phone</th>
                    <th class="ps-5 width200">Billing Address
                    </th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="customers">
                  <tr class="btn-reveal-trigger" v-for="({ img, name, address, date }, ind) in customersData"
                    :key="ind">
                    <td class="py-2">
                      <div class="form-check custom-checkbox mx-2 checkbox-info">
                        <input type="checkbox" class="form-check-input" id="checkbox1" :checked="inputs" />
                        <label class="form-check-label" for="checkbox1"></label>
                      </div>
                    </td>
                    <td class="py-3">
                      <a href="#">
                        <div class="media d-flex align-items-center">
                          <div class="avatar avatar-xl me-2">
                            <div class="">
                              <img class="rounded-circle img-fluid" :src="img" width="30" alt="" />
                            </div>
                          </div>
                          <div class="media-body">
                            <h5 class="mb-0 fs--1">{{ name }}</h5>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td class="py-2">
                      <a href="mailto:ricky@example.com">info@example.com</a>
                    </td>
                    <td class="py-2">
                      <a href="tel:2012001851">(201) 200-1851</a>
                    </td>
                    <td class="py-2 ps-5">{{ address }}</td>
                    <td class="py-2">{{ date }}</td>
                    <td class="py-2 text-end">
                      <div class="dropdown">
                        <button class="btn btn-primary tp-btn-light sharp" type="button" data-bs-toggle="dropdown">
                          <span class="fs--1"><svg xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 24 24"
                              version="1.1">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24"></rect>
                                <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                              </g>
                            </svg></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end border py-0">
                          <div class="py-2">
                            <a class="dropdown-item" href="#!">Edit</a><a class="dropdown-item text-danger"
                              href="#!">Delete</a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { customersData } from "@/elements/TableArrayData";

export default defineComponent({
  name: "customes_",
  data() {
    return {
      customersData,
    };
  },
  setup() {
    const inputs = ref(false);
    return { inputs };
  },
});
</script>

<style scoped>
.card-body .table-responsive table thead tr th::after {
  display: none;
}
</style>
