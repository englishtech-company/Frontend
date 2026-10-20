import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/lib/permissions/access";

/**
 * Domínio: Pedagógico
 * Módulos: Alunos, Professores, Turmas, Aulas, Reposições, Calendário
 *
 * Workspaces (Fase 2):
 *   /aulas-workspace → AulasHostView  (Aulas + Reposições em abas)
 *
 * Aliases legados registrados neste módulo:
 *   /alunos      → /students
 *   /professores → /teachers
 *   /turmas      → /group-classes
 *   /aulas       → /aulas-workspace  (agora aponta para o workspace)
 *   /reposicoes  → /aulas-workspace  (consolidado no mesmo workspace)
 */
export const pedagogicoRoutes: RouteRecordRaw[] = [
  // ─── Alunos ──────────────────────────────────────────────────────────────
  // Legacy alias: /alunos → /students
  {
    path: "/alunos",
    redirect: "/students",
  },
  {
    path: "/students",
    name: "Students",
    component: () => import("../views/admin/students/StudentList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.students.view },
  },
  {
    path: "/students/create",
    name: "StudentCreate",
    component: () => import("../views/admin/students/StudentForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.students.create },
  },
  {
    path: "/students/:id/edit",
    name: "StudentEdit",
    component: () => import("../views/admin/students/StudentForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.students.update },
  },
  {
    path: "/students/:id",
    name: "StudentView",
    component: () => import("../views/admin/students/StudentView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.students.view },
  },
  // Lessons nested under Student
  {
    path: "/students/:studentId/lessons/create",
    name: "StudentLessonCreate",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.create },
  },
  {
    path: "/students/:studentId/lessons/:id/edit",
    name: "StudentLessonEdit",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.update },
  },

  // ─── Professores ─────────────────────────────────────────────────────────
  // Legacy alias: /professores → /teachers
  {
    path: "/professores",
    redirect: "/teachers",
  },
  {
    path: "/teachers",
    name: "Teachers",
    component: () => import("../views/admin/teachers/TeacherList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.teachers.view },
  },
  {
    path: "/teachers/create",
    name: "TeacherCreate",
    component: () => import("../views/admin/teachers/TeacherForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.teachers.create },
  },
  {
    path: "/teachers/:id/edit",
    name: "TeacherEdit",
    component: () => import("../views/admin/teachers/TeacherForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.teachers.update },
  },
  {
    path: "/teachers/:id",
    name: "TeacherView",
    component: () => import("../views/admin/teachers/TeacherView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.teachers.view },
  },

  // ─── Turmas ───────────────────────────────────────────────────────────────
  // Legacy alias: /turmas → /group-classes
  {
    path: "/turmas",
    redirect: "/group-classes",
  },
  {
    path: "/group-classes",
    name: "GroupClasses",
    component: () =>
      import("../views/admin/group-classes/GroupClassList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.groupClasses.view },
  },
  {
    path: "/group-classes/create",
    name: "GroupClassCreate",
    component: () =>
      import("../views/admin/group-classes/GroupClassForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.groupClasses.create,
    },
  },
  {
    path: "/group-classes/:id",
    name: "GroupClassView",
    component: () =>
      import("../views/admin/group-classes/GroupClassView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.groupClasses.view },
  },
  {
    path: "/group-classes/:id/edit",
    name: "GroupClassEdit",
    component: () =>
      import("../views/admin/group-classes/GroupClassForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.groupClasses.update,
    },
  },
  // Lessons nested under GroupClass
  {
    path: "/group-classes/:groupClassId/lessons/create",
    name: "GroupClassLessonCreate",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.create },
  },
  {
    path: "/group-classes/:groupClassId/lessons/:id/edit",
    name: "GroupClassLessonEdit",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.update },
  },

  // ─── Workspace: Aulas + Reposições ──────────────────────────────────────
  // AulasHostView consolida a listagem de aulas e a aba de reposições.
  // As permissões individuais são resolvidas pelo redirect guard do host.
  {
    path: "/aulas-workspace",
    name: "AulasWorkspace",
    component: () =>
      import("../views/admin/aulas/AulasHostView.vue"),
    meta: {
      layout3: "layout3",
      // Guard dinâmico no host — sem permissão única: qualquer uma das duas serve
      permission: PERMISSIONS.lessons.view,
    },
  },

  // ─── Aulas ────────────────────────────────────────────────────────────────
  // Legacy alias: /aulas → workspace
  {
    path: "/aulas",
    redirect: "/aulas-workspace",
  },
  {
    path: "/lessons",
    name: "Lessons",
    component: () => import("../views/admin/lessons/LessonList.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.view },
  },
  {
    path: "/lessons/create",
    name: "LessonCreate",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.create },
  },
  {
    path: "/lessons/:id",
    name: "LessonView",
    component: () => import("../views/admin/lessons/LessonView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.view },
  },
  {
    path: "/lessons/:id/edit",
    name: "LessonEdit",
    component: () => import("../views/admin/lessons/LessonForm.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.update },
  },

  // ─── Reposições ───────────────────────────────────────────────────────────
  // Legacy alias: /reposicoes → workspace (aba reposições)
  {
    path: "/reposicoes",
    redirect: "/aulas-workspace",
  },
  {
    path: "/makeup-classes",
    name: "MakeupClasses",
    component: () =>
      import("../views/admin/makeup-classes/MakeupClassList.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.makeupClasses.view,
    },
  },
  {
    path: "/makeup-classes/create",
    name: "MakeupClassCreate",
    component: () =>
      import("../views/admin/makeup-classes/MakeupClassForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.makeupClasses.create,
    },
  },
  {
    path: "/makeup-classes/:id/edit",
    name: "MakeupClassEdit",
    component: () =>
      import("../views/admin/makeup-classes/MakeupClassForm.vue"),
    meta: {
      layout3: "layout3",
      permission: PERMISSIONS.makeupClasses.update,
    },
  },

  // ─── Calendário ───────────────────────────────────────────────────────────
  {
    path: "/calendar",
    name: "Calendar",
    component: () => import("../views/admin/calendar/CalendarView.vue"),
    meta: { layout3: "layout3", permission: PERMISSIONS.lessons.view },
  },
];
