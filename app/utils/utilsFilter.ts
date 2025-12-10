import type { SelectItem } from "@nuxt/ui";

/**
 * Pagination type
 */
export type Pagination = {
    pageIndex: number;
    pageSize:number;
}

/**
 * Filter type
 */
export type Filter = {
    user?: string;
    year?:string;
    month?:string;
}

export type BaserowFilterType =
  | "equal"
  | "not_equal"
  | "contains"
  | "contains_not"
  | "higher_than"
  | "lower_than"
  | "date_equal"
  | "date_not_equal"
  | "date_before"
  | "date_after"
  | "boolean"
  | "empty"
  | "not_empty"
  | "multiple_collaborators_has";

export type BaserowFilterOperator =
  | "AND"
  | "OR";

export interface BaserowFilter {
  field: string | number;
  type: BaserowFilterType;
  value: string | number | boolean | null;
}

export class BaserowFilterBuilder {
  private filters: BaserowFilter[] = [];

  add(
    field: string | number,
    type: BaserowFilterType,
    value: string | number | boolean | null |undefined
  ) {
    if(value)
      this.filters.push({ field, type, value });
    return this; // chaining
  }
  /**
   * Retourne le tableau filters utilisable directement dans la requête Baserow
   */
  toJSON() {
    return {
      filters: {
        filter_type: "AND",
        filters: [...this.filters]
      }
    };
  }

  clear() {
    this.filters = [];
  }
}

export const getMonthSelectItems = () => {
  const years = ref<SelectItem[]>([])
  years.value.push({label: "January", value: 1})
  years.value.push({label: "February", value: 2})
  years.value.push({label: "March", value: 3})
  years.value.push({label: "April", value: 4})
  years.value.push({label: "May", value: 5})
  years.value.push({label: "June", value: 6})
  years.value.push({label: "July", value: 7})
  years.value.push({label: "August", value: 8})
  years.value.push({label: "September", value: 9})
  years.value.push({label: "October", value: 10})
  years.value.push({label: "November", value: 11})
  years.value.push({label: "December", value: 12})
  return years
}