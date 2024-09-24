import type { Item } from "./item";

export interface Product extends Item {
  article?: string;
  name?: string;
}
