<script lang="ts" setup>
import { ref } from "vue";
import VueDatepicker from "@vuepic/vue-datepicker";
import JobSelectOption from "@/elements/JobSelectOption.vue";



const date = ref(new Date().toUTCString())
const date2 = ref(new Date())


</script>



<template>
    <div class="container-fluid">
        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <div class="welcome-text">
                    <h4>Edit Holiday</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0);">Holiday</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Edit Holiday</a></li>
                </ol>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Add Holiday</h4>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Title">Title</label>
                                        <input id="Title" type="text" class="form-control" value="Festival" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Holiday Types</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Republic Day' },
                                                { title: 'Independence Day' },
                                                { title: 'Memorial Day ' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker">Holiday Start Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <!-- <input id="datepicker" name="datepicker"
                                                class="datepicker-default form-control" value="14 August, 2021"
                                                required>
                                            <div class="icon"><i class="far fa-calendar"></i></div> -->
                                            <VueDatepicker class="datepicker-default" v-model="date"
                                                :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class=" col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker1">Holiday End Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <!-- <input id="datepicker1" name="datepicker"
                                                class="datepicker-default form-control" value="15 August, 2021"
                                                required>
                                            <div class="icon"><i class="far fa-calendar"></i></div> -->
                                            <VueDatepicker class="datepicker-default" v-model="date"
                                                :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Holiday_Details">Holiday Details</label>
                                        <textarea id="Holiday_Details" class="form-control" rows="5"
                                            required>Lorem Ipsum is simply dummy</textarea>
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