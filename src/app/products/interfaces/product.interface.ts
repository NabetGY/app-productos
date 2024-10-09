export interface Product {
  id:          number;
  title:       string;
  price:       number;
  description: string;
  images:      string;
  creationAt:  string;
  updatedAt:   string;
  category:    Category;
  maker:       string;
}

export enum Category {
  Clothes = "Clothes",
  Electronics = "Electronics",
  Furniture = "Furniture",
  Miscellaneous = "Miscellaneous",
  Shoes = "Shoes",
}
