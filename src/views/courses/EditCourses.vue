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
                    <h4>Edit Course</h4>
                </div>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">

                    <li class="breadcrumb-item"><a href="javascript:void(0);">Courses</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0);">Edit Course</a></li>
                </ol>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Courses Details</h4>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Course_Name">Course Name</label>
                                        <input id="Course_Name" type="text" class="form-control" value="Programming"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Course_Code">Course Code</label>
                                        <input id="Course_Code" type="text" class="form-control" value="Pro#005"
                                            required>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="form-label" for="Course_Details">Course Details</label>
                                        <textarea id="Course_Details" class="form-control" rows="5"
                                            required>Why is Early Education Essential</textarea>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="datepicker">Start Form</label>
                                        <div class="input-hasicon mb-xl-0 mb-3">
                                            <VueDatePicker v-model="date" :enable-time-picker="false" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Course_Duration">Course Duration</label>
                                        <input id="Course_Duration" type="text" class="form-control" value="3 Year"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Course_Price">Course Price</label>
                                        <input id="Course_Price" type="text" class="form-control" value="$1500"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Professor_Name">Professor Name</label>
                                        <input id="Professor_Name" type="text" class="form-control" value="Jimmy Morris"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Maximum_Students">Maximum Students</label>
                                        <input id="Maximum_Students" type="text" class="form-control" value="200"
                                            required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="form-label" for="Contact_Number">Contact Number</label>
                                        <input id="Contact_Number" type="text" class="form-control"
                                            value="+01 123 456 7890" required>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="form-group fallback w-100">
                                        <label class="form-label d-block" for="Course_Photo">Course Photo</label>
                                        <input id="Course_Photo" type="file" class="form-control" data-default-file=""
                                            required>
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