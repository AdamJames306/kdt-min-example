import { createRouter, createWebHistory } from "vue-router";
import ClientUpload from "@/views/ClientUpload.vue";

const routes = [
  {
    path: "/client-upload",
    name: "ClientUpload",
    component: ClientUpload,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
