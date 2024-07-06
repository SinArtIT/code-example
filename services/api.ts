import request from "~/services/request";
import {
  ApiApartmentsListItem,
} from "~/types/api";

export default class Api {
  static getFavoriteList(id_list: (number | string)[]) {
    return request<{ data: ApiApartmentsListItem[]; success: 0 | 1 }>({
      path: "/favourite/list",
      config: {
        method: "POST",
        body: JSON.stringify({
          guid_ids: id_list
        })
      }
    });
  }
}
