import { FieldSelectInitialValue } from "~/types/field/initial-value";

export type ApartmentsType = "garage" | "commerce" | "pantry" | "apartment";

export type BreadcrumbsItem = {
  name: string;
  path: string;
};

export type OfficeItemCity = {
  address: string;

  city_id: number;
  id: number;
  lat_lng: string;
  link: string;
  phone: string;
  timetable: string;
  type: "sales" | "mobile" | "managing_company" | "developers_office";
};

export type OfficeItem = OfficeItemCity & {
  label: "Офис продаж" | "Мобильный офис" | "УК" | "Офис застройщика";
};

export type MobileOfficeItem = {
  address: string;
  label: string;
  timetable: string;
};

export type CityItem = {
  apartments_flats: boolean;
  api_id: string;
  contacts: {
    address: string;
    email: string;
    label: string;
    reception_phones: string;
    sales_phones: string;
    timetable: string;
  };
  guarantee: 1 | 0;
  id: number;
  label: string;
  microdata: {
    address: string;
    postal_code: number;
  };
  mobile_office: MobileOfficeItem[];
  name: string;
  offices: OfficeItemCity[];
  phone: string;
  roominess: string[];
  script: string;
  ym_number: number;
};

export type CityListItem = {
  id: number;
  api_id: string;
  label: string;
  name: string;
  path?: string;
  published: 0 | 1;
};

export type ComplexCityItem = {
  id: number;
  label: string;
  link: string;
  roominess: string[];
  status: "sale" | "is_done";
};

export type ComplexItem = {
  id: number;
  api_id: string;
  alias: string;
  label: string;
  city_id: string;
  city_api_d: string;
};

export type NavListItem = {
  name: string;
  path: string | { path: string; query: Record<string, unknown> };
  isActive?: boolean;
};

export type NavList = NavListItem[] | CityListItem[];

export type NavItem = {
  name: string;
  list: NavList;
};

export type AppSelect = {
  disabled?: boolean;
  modelValue: FieldSelectInitialValue;
  multiple: boolean;
  options: string[];
  searchable?: boolean;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  arrow?: {
    width: number;
    height: number;
  };
};

export type WorkingHoursItem = {
  day: number;
  from: string;
  to: string;
  is_day_off: 0 | 1;
};

export type IncomingQuery = {
  area_min_init?: string | number;
  area_max_init?: string | number;
  complex?: string;
  rooms?: string[];
  price_min_init?: string | number;
  price_max_init?: string | number;
};
