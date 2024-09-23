import {useRoute} from "vue-router";
import type {BreadcrumbValue} from "@/types/breadcrumb";

export function useBreadcrumb() {
  const route = useRoute();
  return route.meta.breadcrumb as BreadcrumbValue[];
}
