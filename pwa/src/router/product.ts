import ViewList from "@/views/product/ViewList.vue";
import ViewCreate from "@/views/product/ViewCreate.vue";
import ViewUpdate from "@/views/product/ViewUpdate.vue";
import ViewShow from "@/views/product/ViewShow.vue";

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
  list: { title: names.list.label, redirect: { name: names.list.slug } },
  create: { title: names.create.label, redirect: { name: names.create.slug } },
  update: { title: names.update.label, redirect: { name: names.update.slug } },
  show: { title: names.show.label, redirect: { name: names.show.slug } },
};

export default [
  {
    name: names.list.slug,
    path: "/",
    component: ViewList,
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create.slug,
    path: "/create",
    component: ViewCreate,
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update.slug,
    path: "/edit/:id",
    component: ViewUpdate,
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show.slug,
    path: "/show/:id",
    component: ViewShow,
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
