/**
 * Fixed types
 * If you need to modify these, please state your reasons in the SUBMISSION.md file.
 */

import { AttributeFieldType, AttributeGroup } from "../enums/attribute";

export type AttributeOption = {
  // common
  required?: boolean;
  order?: number;

  // text, long text, rich text
  maxLength?: number;
  minLength?: number;
  regex?: string;

  // number, measure
  maximum?: number; // only for number
  minimum?: number; // only for number
  integer?: boolean;
  unitList?: string[]; // only for unit list

  // Multi-select, dropdown
  selection?: string[];

  // price
  currency?: string;

  // disable state
  disabled?: boolean;

  // date, datetime
  dateFormat?: string;
  timezone?: string;
};

export type SupplierAttribute = {
  id: string;
  createdAt: number;
  updatedAt: number;
  type: AttributeFieldType;
  name: string;
  key: string;
  option?: AttributeOption;
  description?: string;
  group?: AttributeGroup;
  placeHolder?: string;
};

export type ValidSupplierAttributeForMatching = keyof Pick<
  SupplierAttribute,
  | "id"
  | "key"
  | "id"
  | "key"
  | "name"
  | "type"
  | "group"
  | "placeHolder"
  | "description"
  | "createdAt"
  | "updatedAt"
>;
