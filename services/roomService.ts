import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { ROOM_URL } from "./url";
import { Interfaces } from "@/data/interfaces/model";
import Stomp from "stompjs";

const roomService = {
  async sendWebRTCData(request: Interfaces.IWebRTC, client: Stomp.Client) {
    try {
      return client.send(ROOM_URL.VIDEO_CALL, {}, JSON.stringify(request));
    } catch (error) {
      throw error;
    }
  },
};

export default roomService;
