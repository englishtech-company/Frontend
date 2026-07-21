<script lang="ts" setup>
import { ref } from "vue";
import JobSelectOption from '@/elements/JobSelectOption.vue';
import VueDatePicker from "@vuepic/vue-datepicker";


const date = ref(new Date())
</script>



<template>
    <div class="container-fluid">
        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <div class="welcome-text">
                    <h4>Edit Library</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">

                    <li class="breadcrumb-item"><a href="javascript:void(0);">Library</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Edit Library</a></li>
                </ol>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Edit Library</h4>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Title">Title</label>
                                        <input id="Title" type="text" class="form-control"
                                            value="Integration Specialist" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Subject</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Subject' },
                                                { title: 'Politics' },
                                                { title: 'Designing' },
                                                { title: 'Computer' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Auther_Name">Auther Name</label>
                                        <input id="Auther_Name" type="text" class="form-control" value="Jimmy Morris"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Publisher">Publisher</label>
                                        <input id="Publisher" type="text" class="form-control" value="Nashid Martines"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Department</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Department' },
                                                { title: 'Computer' },
                                                { title: 'Data Entry' },
                                                { title: 'Management' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Asset type</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Asset type' },
                                                { title: 'Book' },
                                                { title: 'Newspaper' },
                                                { title: 'Comics' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker">Purchase Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <!-- <input name="datepicker" class="datepicker-default form-control"
                                                id="datepicker" value="7 August, 2021" required>
                                            <div class="icon"><i class="far fa-calendar"></i></div> -->
                                            <VueDatePicker class="datepicker-default" v-model="date"
                                                :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Price">Price</label>
                                        <input id="Price" type="text" class="form-control" value="90$" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label">Status</label>
                                        <div class="dropdown bootstrap-select form-control">
                                            <JobSelectOption :options="[
                                                { title: 'Status' },
                                                { title: 'In Stock' },
                                                { title: 'Out Of Stock' },
                                            ]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Assets_Details">Assets Details</label>
                                        <textarea id="Assets_Details" class="form-control" rows="5"
                                            required>The Shocking Revelation of Education</textarea>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <button type="submit" class="btn btn-primary">Submit</button>{{ " " }}
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