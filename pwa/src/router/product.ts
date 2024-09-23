const names = {
  list: {
    slug: "ProductList",
    label: "Products"
  },
  create: {
    slug: "ProductCreate",
    label: "Create new product"
  },
  update: {
    slug: "ProductUpdate",
    label: "Update product"
  },
  show: {
    slug: "ProductShow",
    label: "Product card"
  },
};

const breadcrumbs = {
  list: { title: names.list.label, to: { name: names.list.slug } },
  create: { title: names.create.label, to: { name: names.create.slug } },
  update: { title: names.update.label, to: { name: names.update.slug } },
  show: { title: names.show.label, to: { name: names.show.slug } },
};

export default [
  {
    name: names.list.slug,
    path: "/",
    component: () => import("@/views/product/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create.slug,
    path: "/create",
    component: () => import("@/views/product/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update.slug,
    path: "/edit/:id",
    component: () => import("@/views/product/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show.slug,
    path: "/show/:id",
    component: () => import("@/views/product/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
