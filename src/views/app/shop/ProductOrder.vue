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
          <li class="breadcrumb-item"><a href="javascript:void(0)">Shop</a></li>
          <li class="breadcrumb-item active">
            <a href="javascript:void(0)">Order</a>
          </li>
        </ol>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th class="align-middle">
                      <div class="form-check custom-checkbox">
                        <input type="checkbox" class="form-check-input" id="checkAll" @click="inputs = !inputs">
                      </div>
                    </th>
                    <th class="align-middle">Order</th>
                    <th class="align-middle pe-7">Date</th>
                    <th class="align-middle" style="min-width: 15.5rem;">Ship To</th>
                    <th class="align-middle text-end">Status</th>
                    <th class="align-middle text-end">Amount</th>
                    <th class="no-sort"></th>
                  </tr>
                </thead>
                <tbody id="orders">
                  <tr class="btn-reveal-trigger" v-for="(
                      {
                        order,
                        address,
                        customer,
                        date,
                        email,
                        status,
                        total,
                        badge,
                      },
                        ind
                    ) in productOrder" :key="ind">
                    <td class="py-2">
                      <div :class="`form-check custom-checkbox checkbox-${badge}`">
                        <input type="checkbox" class="form-check-input" id="checkbox" :checked="inputs" />
                        <label class="form-check-label" for="checkbox"></label>
                      </div>
                    </td>
                    <td class="py-2">
                      <a href="#">
                        <strong class="order">{{ order }}</strong></a>
                      by <strong class="">{{ customer }}</strong><br /><a href="mailto:ricky@example.com">{{ email
                        }}</a>
                    </td>
                    <td class="py-2">{{ date }}</td>
                    <td class="py-2" v-html="address"></td>
                    <td class="py-2 text-end">
                      <span :class="`badge badge-${badge}`">{{ status.name }}<span :class="status.icon"></span></span>
                    </td>
                    <td class="py-2 text-end font-w600">{{ total }}</td>
                    <td class="py-2 text-end">
                      <div class="dropdown text-sans-serif">
                        <button class="btn btn-primary tp-btn-light sharp" type="button" id="order-dropdown-0"
                          data-bs-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false">
                          <span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24"></rect>
                                <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                              </g>
                            </svg></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end border py-0" aria-labelledby="order-dropdown-0">
                          <div class="py-2">
                            <a class="dropdown-item" href="javascript:void(0);">Completed</a><a class="dropdown-item"
                              href="javascript:void(0);">Processing</a><a class="dropdown-item"
                              href="javascript:void(0);">On Hold</a><a class="dropdown-item"
                              href="javascript:void(0);">Pending</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item text-danger" href="javascript:void(0);">Delete</a>
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
import { productOrder } from "@/elements/TableArrayData";

export default defineComponent({
  name: "productOrder",
  data() {
    return {
      productOrder,
    };
  },
  setup() {
    const inputs = ref(false);
    return { inputs };
  },
});
</script>

<style scoped>
.table-responsive table thead tr th::after {
  display: none !important;
}
</style>
