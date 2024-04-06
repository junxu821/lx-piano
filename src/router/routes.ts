import { Component } from "vue";
export default [{
  
    path: "/lx-piano",
    name: "index",
    component: (): Component => import("@/views/PianoPc/index.vue"),
    mata: {
      title: "首页",
    },
  },
];
