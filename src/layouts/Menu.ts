/** @format */

import { reactive } from "vue";

interface sumMenuDownType {
  child?: string;
  to?: string;
}
interface subMenuType {
  menu?: string;
  to?: string;
  className?: string;
  subMenuDownItems?: sumMenuDownType[];
}

interface menuType {
  icons?: string;
  title?: string;
  className?: string;
  to?: string;
  subMenuItems?: subMenuType[];
}



const MenuItems = reactive<menuType[]>([
  {
    icons: "la la-home",
    title: "Dashboard",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Dashboard 1", to: "/" },
      { menu: "Dashboard 2", to: "/index-2" },
      { menu: "Dashboard 3", to: "/index-3" },
    ],
  },
  { icons: "la la-calendar", title: "Event Management", to: "/event-management" },
  {
    icons: "la la-user",
    title: "Professors",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Professor", to: "/all-professors" },
      { menu: "Add Professor", to: "/add-professor" },
      { menu: "Edit Professor", to: "/edit-professor" },
      { menu: "Professor Profile", to: "/professor-profile" },
    ],
  },
  {
    icons: "la la-users",
    title: "Students",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Students", to: "/all-students" },
      { menu: "Add Students", to: "/add-student" },
      { menu: "Edit Students", to: "/edit-student" },
      { menu: "About Students", to: "/about-student" },
    ],
  },


  {
    icons: "la la-graduation-cap",
    title: "Courses",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Courses", to: "/all-courses" },
      { menu: "Add Courses", to: "/add-courses" },
      { menu: "Edit Courses", to: "/edit-courses" },
      { menu: "About Courses", to: "/about-courses" },
    ],
  },


  {
    icons: "la la-book",
    title: "Library",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Library", to: "/all-library" },
      { menu: "Add Library", to: "/add-library" },
      { menu: "Edit Library", to: "/edit-library" },
    ],
  },



  {
    icons: "la la-building",
    title: "Departments",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Departments", to: "/all-departments" },
      { menu: "Add Departments", to: "/add-departments" },
      { menu: "Edit Departments", to: "/edit-departments" },
    ],
  },

  {
    icons: "la la-users",
    title: "Staff",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Staff", to: "/all-staff" },
      { menu: "Add Staff", to: "/add-staff" },
      { menu: "Edit Staff", to: "/edit-staff" },
      { menu: "Staff Profile", to: "/staff-profile" },
    ],
  },

  {
    icons: "la la-gift",
    title: "Holiday",
    className: "sub-menu",
    subMenuItems: [
      { menu: "All Holiday", to: "/all-holiday" },
      { menu: "Add Holiday", to: "/add-holiday" },
      { menu: "Edit Holiday", to: "/edit-holiday" },
      { menu: "Holiday Calendar", to: "/holiday-calendar" },
    ],
  },


  {
    icons: "la la-dollar",
    title: "Fees",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Fees Collection", to: "/fees-collection" },
      { menu: "Add Fees", to: "/add-fees" },
      { menu: "Fees Receipt", to: "/fees-receipt" },
    ],
  },


  { title: "Apps", className: "menu-title" },

  {
    icons: "la la-users",
    title: "Apps",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Profile", to: "/app-profile" },
      // { menu: "Edit Profile", to: "/edit-profile" },
      { menu: "Post Details", to: "/post-details" },
      { menu: "Edit Profile", to: "/edit-profile" },
      // {
      //   menu: "Users Manager",
      //   className: "sub-menu-down",
      //   subMenuDownItems: [
      //     { child: "User", to: "/user" },
      //     { child: "Add User", to: "/edit-profile" },
      //     // { child: 'Roles Listing', to: '/user-roles' },
      //     // { child: 'Add Roles', to: '/add-role' },
      //     { child: "Profile 1", to: "/app-profile-1" },
      //     { child: "Profile 2", to: "/app-profile-2" },
      //     { child: "Edit Profile", to: "/edit-profile" },
      //     { child: "Post Details", to: "/post-details" },
      //   ],
      // },
      // {
      //   menu: 'Customer Manager',
      //   className: 'sub-menu-down',
      //   subMenuDownItems: [
      //     { child: 'Customer', to: '/customer' },
      //     { child: 'Customer Profile', to: '/customer-profile' }
      //   ]
      // },
      // { menu: 'Contacts', to: '/contacts' },
      // {
      //   menu: "Project",
      //   className: "sub-menu-down",
      //   subMenuDownItems: [
      //     { child: "Project List", to: "/project-list" },
      //     { child: "Project Card", to: "/project-card" },
      //   ],
      // },
      // {
      //   menu: "User",
      //   className: "sub-menu-down",
      //   subMenuDownItems: [
      //     { child: "User List", to: "/user-list-datatable" },
      //     { child: "User Card", to: "/user-list-column" },
      //   ],
      // },
      // {
      //   menu: "Contact",
      //   className: "sub-menu-down",
      //   subMenuDownItems: [
      //     { child: "Contact List", to: "/contact-list" },
      //     { child: "Contact Card", to: "/contact-card" },
      //   ],
      // },
      {
        menu: "Email",
        className: "sub-menu-down",
        subMenuDownItems: [
          { child: "Compose", to: "/email-compose" },
          { child: "Inbox", to: "/email-inbox" },
          { child: "Read", to: "/email-read" },
        ],
      },
      { menu: "Calendar", to: "/app-calender" },
      {
        menu: "Shop",
        className: "sub-menu-down",
        subMenuDownItems: [
          { child: "Product Grid", to: "/ecom-product-grid" },
          { child: "Product List", to: "/ecom-product-list" },
          { child: "Product Details", to: "/ecom-product-detail" },
          { child: "Order", to: "/ecom-product-order" },
          { child: "Checkout", to: "/ecom-checkout" },
          { child: "Invoice", to: "/ecom-invoice" },
          { child: "Customers", to: "/ecom-customes" },
        ],
      },
    ],
  },
  {
    icons: "flaticon-381-database-1",
    title: "CMS",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Content", to: "/content" },
      // { menu: "Add Content", to: "/add-content" },
      { menu: "Menus", to: "/menu" },
      { menu: "Email Template", to: "/email-template" },
      { menu: "Blog", to: "/blog" },
      { menu: "Add Content", to: "/add-content" },
      { menu: "Add Email", to: "/add-email" },
      { menu: "Add Blog", to: "/add-blog" },
      { menu: "Blog Category", to: "/blog-category" },
    ],
  },

  {
    icons: "la la-signal",
    title: "Charts",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Flot", to: "/chart-flot" },
      { menu: "Apax", to: "/chart-apax" },
      { menu: "Chartjs", to: "/chart-chartjs" },
    ],
  },


  { title: "components", className: "menu-title" },

  // {
  //   icons: "flaticon-093-waving",
  //   title: "Jobs",
  //   className: "sub-menu",
  //   subMenuItems: [
  //     { menu: "Job Lists", to: "/job-list" },
  //     { menu: "Job View", to: "/job-view" },
  //     { menu: "Job Application", to: "/job-application" },
  //     { menu: "Apply Job", to: "/apply-job" },
  //     { menu: "New Job", to: "/new-job" },
  //     { menu: "User Profile", to: "/user-profile" },
  //   ],
  // },
  // {
  //   icons: `flaticon-093-waving`,
  //   title: "Tasks",
  //   to: "/task",
  // },
  // { icons: SVGImage.iconSvg3, title: "Projects", to: "/project" },

  {
    icons: "la la-globe",
    title: "Bootstrap",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Accordion", to: "/ui-accordion" },
      { menu: "Alert", to: "/ui-alert" },
      { menu: "Badge", to: "/ui-badge" },
      { menu: "Button", to: "/ui-button" },
      { menu: "Modal", to: "/ui-modal" },
      { menu: "Button Group", to: "/ui-button-group" },
      { menu: "List Group", to: "/ui-list-group" },
      { menu: "Media Object", to: "/ui-media-object" },
      { menu: "Cards", to: "/ui-card" },
      { menu: "Carousel", to: "/ui-carousel" },
      { menu: "Dropdown", to: "/ui-dropdown" },
      { menu: "Popover", to: "/ui-popover" },
      { menu: "Progressbar", to: "/ui-progressbar" },
      { menu: "Tab", to: "/ui-tab" },
      { menu: "Typography", to: "/ui-typography" },
      { menu: "Pagination", to: "/ui-pagination" },
      { menu: "Grid", to: "/ui-grid" },
    ],
  },
  {
    icons: "la la-plus-square-o",
    title: "Plugins",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Select 2", to: "/uc-select2" },
      { menu: "Nestable", to: "/uc-nestable" },
      { menu: "Sweet Alert", to: "/uc-sweetalert" },
      { menu: "Toastr", to: "/uc-toastr" },
      { menu: "Jqv Map", to: "/map-jqvmap" },
      { menu: "Light Gallery", to: "/uc-lightgallery" },
    ],
  },
  { icons: "la la-desktop", title: "Widget", to: "/widget-basic" },
  { title: "Table", className: "menu-title" },
  {
    icons: "la la-file-text",
    title: "Forms",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Form Elements", to: "/form-element" },
      { menu: "Wizard", to: "/form-wizard" },
      { menu: "CkEditor", to: "/form-ckeditor" },
      { menu: "Pickers", to: "/form-pickers" },
      { menu: "Form Validate", to: "/form-validation" },
    ],
  },
  { title: "Forms", className: "menu-title" },
  {
    icons: "la la-table",
    title: "Table",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Bootstrap", to: "/table-bootstrap-basic" },
      { menu: "Datatable", to: "/table-datatable-basic" },
    ],
  },
  { title: "Extra", className: "menu-title" },
  {
    icons: "la la-th-list",
    title: "Pages",
    className: "sub-menu",
    subMenuItems: [
      { menu: "Register", to: "/page-register" },
      { menu: "Login", to: "/page-login" },
      {
        menu: "Error",
        className: "sub-menu-down",
        subMenuDownItems: [
          { child: "Error 400", to: "/page-error-400" },
          { child: "Error 403", to: "/page-error-403" },
          { child: "Error 404", to: "/page-error-404" },
          { child: "Error 500", to: "/page-error-500" },
          { child: "Error 503", to: "/page-error-503" },
        ],
      },
      { menu: "Lock Screen", to: "/page-lock-screen" },
    ],
  },
]);
export default MenuItems;
