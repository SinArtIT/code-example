export type ApartmentSliderToolsData = {
  apartmentId?: string;
  tour?: string;
  currentPicture?: string;
};

export type ApartmentSliderData = {
  sliderList?: string[];
  tools: {
    apartmentId?: string;
    tour?: string;
  };
};

export type ApartmentInfoListItem = {
  area: number;
  building_number: string;
  entrance_number: string;
  floor: number;
  link: string;
  price: number;
};

export type ApartmentInfoData = {
  area?: number;
  bookingSize?: number;
  buildingNumber?: string;
  costPerSquare?: number;
  complexId?: number | string;
  deadlineDate?: string;
  entranceNumber?: string;
  finishingType?: string;
  floor?: number;
  maxFloor?: number;
  mortgageRate?: number;
  mortgagePrice?: number;
  pantries: ApartmentInfoListItem[];
  parking: ApartmentInfoListItem[];
  price?: number;
  promotionPrice?: number;
  roominess?: string;
  releaseDate?: string;
  tags: {
    id: string;
    tag_hex_color: string;
    tag_icon_url: string;
    tag_title: string;
  }[];
  queue?: string;
};

export type ApartmentListItemData = {
  area: number;
  id: number;
  roominess: string;
  number: number;
  floor: number;
  floorMax: number;
  price: number;
  promotionPrice: number;
  mortgagePrice: number;
  image: string;
  tags: { id: string; tag_title: string }[];
};

export type ApartmentListData = {
  complexId?: number;
  area?: number;
  buildingNumber?: string;
  entranceNumber?: string;
  roominess?: string;
};
