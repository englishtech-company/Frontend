<script lang="ts" setup>
import { ref } from 'vue'
import VueDatepicker from "@vuepic/vue-datepicker";
import JobSelectOption from "@/elements/JobSelectOption.vue";




const date = ref(new Date());



</script>


<template>
    <div class="container-fluid">

        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <div class="welcome-text">
                    <h4>Add Fees</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0);">Fees</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Add Fees</a></li>
                </ol>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12 col-xxl-12 col-sm-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Add Department</h5>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Roll_No">Roll No.</label>
                                        <input placeholder="Roll No" id="Roll_No" type="text" class="form-control"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Student_Name">Student Name</label>
                                        <input placeholder="Student Name" id="Student_Name" type="text"
                                            class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Department</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Department' },
                                                { title: 'Computer' },
                                                { title: 'Arts' },
                                                { title: 'Commerce' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group mb-4">
                                        <label class="form-label">Type</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Fess Type' },
                                                { title: 'Annual' },
                                                { title: 'Exam' },
                                                { title: 'Other' },
                                            ]" />
                                        </div>


                                    </div>
                                </div>
                                <div>
                                    <div class="form-group row">
                                        <div class="form-check col-lg-3 ms-3">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault"
                                                id="flexRadioDefault1" required>
                                            <label class="form-check-label" for="flexRadioDefault1">
                                                Option 1
                                            </label>
                                        </div>
                                        <div class="form-check col-lg-3 ms-3">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault"
                                                id="flexRadioDefault2" required>
                                            <label class="form-check-label" for="flexRadioDefault2">
                                                Option 2
                                            </label>
                                        </div>
                                        <div class="form-check col-lg-3 ms-3">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault"
                                                id="flexRadioDefault3" required>
                                            <label class="form-check-label" for="flexRadioDefault3">
                                                Option 3
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Ammount">Ammount</label>
                                        <input placeholder="Ammount" id="Ammount" type="text" class="form-control"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group mb-4">
                                        <label class="form-label" for="datepicker">Collection Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <VueDatepicker class="datepicker-default" v-model="date"
                                                :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group mb-4">
                                        <label class="form-label">Payment Type</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Payment Type' },
                                                { title: 'Cash' },
                                                { title: 'Cheque' },
                                                { title: 'Other' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Payment_Reference_Number">Payment Reference
                                            Number</label>
                                        <input placeholder="Payment Reference Number" id="Payment_Reference_Number"
                                            type="number" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group mb-4">
                                        <label class="form-label">Status</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Status' },
                                                { title: 'Paid' },
                                                { title: 'Unpaid' },
                                                { title: 'Pending' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Payment_Details">Payment Details</label>
                                        <textarea placeholder="Payment Details" id="Payment_Details"
                                            class="form-control" rows="5" required></textarea>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <button type="submit" class="btn btn-primary">Submit</button>{{ ' ' }}
                                    <button type="submit" class="btn btn-danger light">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>