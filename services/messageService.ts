import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { MESSAGE_URL } from "./url";

const messageService = {
  // getMessagesRef(messengerId: string) {
  //   return ref(database, `messengers/${messengerId}/messages`);
  // },
  async create(request: RequestInterfaces.IEditMessageRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(MESSAGE_URL.BASE, request, config);
  },
  async search(request: RequestInterfaces.ISearchMessageRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(MESSAGE_URL.SEARCH, request, config);
  },
  async get(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${MESSAGE_URL.BASE}/${id}`, config);
  },
};

export default messageService;
