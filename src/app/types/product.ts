/**
 * Fixed types
 * If you need to modify these, please state your reasons in the SUBMISSION.md file.
 */

export type ProductAttributeValue = string | object | string[] | number | null;

export type ProductAttribute = {
  key: string;
  value: ProductAttributeValue;
};

export type Product = {
  id: string;
  skuId: string;
  updatedAt: number;
  createdAt: number;
  attributes: ProductAttribute[];
};
