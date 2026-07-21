<script lang="ts" setup>
import { ref } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';



const date = ref(new Date())
</script>



<template>
    <div class="container-fluid">
        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <div class="welcome-text">
                    <h4>Add Departments</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">

                    <li class="breadcrumb-item"><a href="javascript:void(0);">Departments</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Add Departments</a></li>
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
                                        <label for="Department_Name" class="form-label">Department Name</label>
                                        <input id="Department_Name" placeholder="Department Name" type="text"
                                            class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Head_Of_Department" class="form-label">Head Of Department</label>
                                        <input id="Head_Of_Department" placeholder="Head Of Department" type="text"
                                            class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="datepicker" class="form-label">Department Start Date</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <VueDatePicker v-model="date" :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="Student_Capacity" class="form-label">Student Capacity</label>
                                        <input id="Student_Capacity" placeholder="Student Capacity" type="text"
                                            class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label for="Department_Details" class="form-label">Department
                                            Details</label>
                                        <textarea id="Department_Details" placeholder="Department Details"
                                            class="form-control" rows="5" required></textarea>
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