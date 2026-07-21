import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { el: "#app", top: 0, behavior: "smooth" };
  },
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: () => import("../views/dashboard/Dashboard.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/index-2",
      name: "Dashboard 2",
      component: () => import("../views/dashboard/Dashboard2.vue"),
      meta: { layout3: "layout3" },
    }, {
      path: "/index-3",
      name: "Dashboard 3",
      component: () => import("../views/dashboard/Dashboard3.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/event-management",
      name: "Event Management",
      component: () => import("../views/EventManagment.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-professors",
      name: "All Professors",
      component: () => import("../views/Professor/AllProfessor.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-professor",
      name: "Add Professor",
      component: () => import("../views/Professor/AddProfessor.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-professor",
      name: "Edit Professor",
      component: () => import("../views/Professor/EditProfessor.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/professor-profile",
      name: "Professor Profile",
      component: () => import("../views/Professor/ProfessorProfile.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-students",
      name: "All Students",
      component: () => import("../views/students/AllStudents.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-student",
      name: "Add Student",
      component: () => import("../views/students/AddStudents.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-student",
      name: "Edit Student",
      component: () => import("../views/students/EditStudents.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/about-student",
      name: "About Student",
      component: () => import("../views/students/AboutStudents.vue"),
      meta: { layout: "layout" },
    },

    {
      path: "/all-courses",
      name: "All Courses",
      component: () => import("../views/courses/AllCourses.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-courses",
      name: "Add Courses",
      component: () => import("../views/courses/AddCourses.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-courses",
      name: "Edit Courses",
      component: () => import("../views/courses/EditCourses.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/about-courses",
      name: "About Courses",
      component: () => import("../views/courses/AboutCourses.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-library",
      name: "All Library",
      component: () => import("../views/library/AllLibrary.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-library",
      name: "Add Library",
      component: () => import("../views/library/AddLibrary.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-library",
      name: "Edit Library",
      component: () => import("../views/library/EditLibrary.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-departments",
      name: "All Departments",
      component: () => import("../views/dipartment/AllDipartment.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-departments",
      name: "Add Departments",
      component: () => import("../views/dipartment/AddDipartment.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-departments",
      name: "Edit Departments",
      component: () => import("../views/dipartment/EditDipartment.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-staff",
      name: "All Staff",
      component: () => import("../views/staff/AllStarff.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-staff",
      name: "Add Staff",
      component: () => import("../views/staff/AddStarff.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-staff",
      name: "Edit Staff",
      component: () => import("../views/staff/EditStarff.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/staff-profile",
      name: "Staff Profile",
      component: () => import("../views/staff/StaffProfile.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/all-holiday",
      name: "All Holiday",
      component: () => import("../views/holiday/AllHoliday.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-holiday",
      name: "Add Holiday",
      component: () => import("../views/holiday/AddHoliday.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-holiday",
      name: "Edit Holiday",
      component: () => import("../views/holiday/EditHoliday.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/holiday-calendar",
      name: "Holiday Calender",
      component: () => import("../views/holiday/HolidayCalendar.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/fees-collection",
      name: "Fees Collection",
      component: () => import("../views/fees/FeeCollection.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/add-fees",
      name: "Add Fees",
      component: () => import("../views/fees/AddFee.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/fees-receipt",
      name: "Fees Receipt",
      component: () => import("../views/fees/FeeReceipt.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/edit-profile",
      name: "Edit Profile",
      component: () => import("../views/app/userManeger/AddUser.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/app-profile",
      name: "Profile",
      component: () => import("../views/app/userManeger/AppProfile1.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/post-details",
      name: "Post Details",
      component: () => import("../views/app/userManeger/PostDetail.vue"),
      meta: { layout3: "layout3" },
    },
    // {
    //   path: "/page-chat",
    //   name: "Page Chat",
    //   component: () => import("../views/app/Chat.vue"),
    //   meta: { layout3: "layout3" },
    // },
    // {
    //   path: "/project-list",
    //   name: "Project List",
    //   component: () => import("../views/app/project/ProjectList.vue"),
    //   meta: { layout: "layout" },
    // },
    // {
    //   path: "/project-card",
    //   name: "Project Card",
    //   component: () => import("../views/app/project/ProjectCard.vue"),
    //   meta: { layout: "layout" },
    // },
    {
      path: "/email-compose",
      name: "Compose",
      component: () => import("../views/app/email/Compose.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/email-inbox",
      name: "Inbox",
      component: () => import("../views/app/email/EmailInbox.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/email-read",
      name: "Read",
      component: () => import("../views/app/email/EmailRead.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/app-calender",
      name: "App Calendar",
      component: () => import("../views/app/AppCalendar.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-product-grid",
      name: "Product-Grid",
      component: () => import("../views/app/shop/ProductGrid.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-product-list",
      name: "Product List",
      component: () => import("../views/app/shop/ProductList.vue"),
      meta: { layout3: "layout3" },
    },
    // {
    //   path: "/user-list-datatable",
    //   name: "User List Datatable",
    //   component: () => import("../views/app/User/UserList.vue"),
    //   meta: { layout: "layout" },
    // },
    // {
    //   path: "/user-list-column",
    //   name: "User List Column",
    //   component: () => import("../views/app/User/UserCard.vue"),
    //   meta: { layout: "layout" },
    // },
    // {
    //   path: "/contact-list",
    //   name: "Contact List",
    //   component: () => import("../views/app/contact/ContactList.vue"),
    //   meta: { layout: "layout" },
    // },
    // {
    //   path: "/contact-card",
    //   name: "Contact Card",
    //   component: () => import("../views/app/contact/ContactCard.vue"),
    //   meta: { layout: "layout" },
    // },
    {
      path: "/ecom-product-detail",
      name: "Product-Detail",
      component: () => import("../views/app/shop/ProductDetails.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-product-order",
      name: "Product-Order",
      component: () => import("../views/app/shop/ProductOrder.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-checkout",
      name: "Checkout",
      component: () => import("../views/app/shop/Checkout.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-invoice",
      name: "Invoice",
      component: () => import("../views/app/shop/Invoice.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ecom-customes",
      name: "Customers",
      component: () => import("../views/app/shop/Customers.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/content",
      name: "Content",
      component: () => import("../views/cms/Content.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/menu",
      name: "Menu",
      component: () => import("../views/cms/Menu.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/email-template",
      name: "Email Template",
      component: () => import("../views/cms/EmailTemplate.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/blog",
      name: "Blog",
      component: () => import("../views/cms/Blog.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/add-email",
      name: "Email Template ",
      component: () => import("../views/cms/AddEmail.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/add-content",
      name: "Add Content",
      component: () => import("../views/cms/AddContent.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/add-blog",
      name: "Add Blog",
      component: () => import("../views/cms/AddBlog.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/blog-category",
      name: "Blog Category",
      component: () => import("../views/cms/BlogCategory.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/chart-flot",
      name: "Chart-Flot",
      component: () => import("../views/charts/Flot.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/chart-apax",
      name: "Chart-Apex",
      component: () => import("../views/charts/Morris.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/chart-chartjs",
      name: "Chart-Chartjs",
      component: () => import("../views/charts/ChartJs.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-accordion",
      name: "Accordion",
      component: () => import("../views/bootstrap/Accordian.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-alert",
      name: "Alert",
      component: () => import("../views/bootstrap/Alerts.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-badge",
      name: "Badge",
      component: () => import("../views/bootstrap/Badge.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-button",
      name: "Button",
      component: () => import("../views/bootstrap/Buttons.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-modal",
      name: "Modal",
      component: () => import("../views/bootstrap/Modal.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/ui-button-group",
      name: "Button Group",
      component: () => import("../views/bootstrap/ButtonGroup.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-list-group",
      name: "List Group",
      component: () => import("../views/bootstrap/ListGroup.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-media-object",
      name: "Media Object",
      component: () => import("../views/bootstrap/MediaObject.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-card",
      name: "Card",
      component: () => import("../views/bootstrap/Card.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-carousel",
      name: "Carousel",
      component: () => import("../views/bootstrap/Carousel.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-dropdown",
      name: "Dropdown",
      component: () => import("../views/bootstrap/Dropdown.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-popover",
      name: "Popover",
      component: () => import("../views/bootstrap/Popover.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/ui-progressbar",
      name: "Progressbar",
      component: () => import("../views/bootstrap/Progressbar.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-tab",
      name: "Tab",
      component: () => import("../views/bootstrap/Tab.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-typography",
      name: "Typography",
      component: () => import("../views/bootstrap/Typography.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-pagination",
      name: "Pagination",
      component: () => import("../views/bootstrap/Pagination.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/ui-grid",
      name: "Grid",
      component: () => import("../views/bootstrap/Grid.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/uc-select2",
      name: "Select2",
      component: () => import("../views/plugins/Select2.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/uc-nestable",
      name: "Nestable",
      component: () => import("../views/plugins/Nestable.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/uc-sweetalert",
      name: "Sweet Alert",
      component: () => import("../views/plugins/Sweetalert.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/uc-toastr",
      name: "Toastr",
      component: () => import("../views/plugins/Toastr.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/map-jqvmap",
      name: "Jqvmap",
      component: () => import("../views/plugins/JqvMap.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/uc-lightgallery",
      name: "Light Gallery",
      component: () => import("../views/plugins/LightGallery.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/widget-basic",
      name: "Widget",
      component: () => import("../views/Widget.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/form-element",
      name: "Form-Element",
      component: () => import("../views/Forms/FormElement.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/form-wizard",
      name: "Form-Wizard",
      component: () => import("../views/Forms/FormWizard.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/form-ckeditor",
      name: "Ckeditor",
      component: () => import("../views/Forms/Ckeditor.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/form-pickers",
      name: "Pickers",
      // @ts-ignore
      component: () => import("../views/Forms/FormPickers.vue"),
      meta: { layout: "layout" },
    },
    {
      path: "/form-validation",
      name: "Form-Validation",
      component: () => import("../views/Forms/FormValidation.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/table-bootstrap-basic",
      name: "Table-Bootstrap",
      component: () => import("../views/table/TableBootstrap.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/table-datatable-basic",
      name: "Table-Data-Table",
      component: () => import("../views/table/TableDatabase.vue"),
      meta: { layout3: "layout3" },
    },
    {
      path: "/page-login",
      name: "page_login",
      component: () => import("../views/pages/Login.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-register",
      name: "page_register",
      component: () => import("../views/pages/Register.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-forgot-password",
      name: "page_forgot_password",
      component: () => import("../views/pages/ForgetPassword.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-400",
      name: "page_error_400",
      component: () => import("../views/pages/error/Error400.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-403",
      name: "page_error_403",
      component: () => import("../views/pages/error/Error403.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-404",
      name: "page_error_404",
      component: () => import("../views/pages/error/Error404.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-500",
      name: "page_error_500",
      component: () => import("../views/pages/error/Error500.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-error-503",
      name: "page_error_503",
      component: () => import("../views/pages/error/Error503.vue"),
      meta: { layout4: "layout4" },
    },
    {
      path: "/page-lock-screen",
      name: "page_lock_screen",
      component: () => import("../views/pages/LockScreen.vue"),
      meta: { layout4: "layout4" },
    },
  ],
});

const publicPaths = new Set([
  "/page-login",
  "/page-register",
  "/page-forgot-password",
  "/page-error-400",
  "/page-error-403",
  "/page-error-404",
  "/page-error-500",
  "/page-error-503",
  "/page-lock-screen",
]);

router.beforeEach(async (to) => {
  const { useAuthStore } = await import("@/stores/auth");
  const auth = useAuthStore();

  if (!auth.bootstrapped) {
    await auth.fetchMe();
  }

  const isPublic = publicPaths.has(to.path);

  if (!isPublic && !auth.isAuthenticated) {
    return { path: "/page-login", query: { redirect: to.fullPath } };
  }

  if (to.path === "/page-login" && auth.isAuthenticated) {
    return { path: "/" };
  }

  return true;
});

export default router;
