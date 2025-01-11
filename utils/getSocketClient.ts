import Stomp from "stompjs";
import SockJS from "sockjs-client";

const getSocketClient = (): Stomp.Client => {
  const socketBaseUrl = process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL;
  if (!socketBaseUrl) throw "Error on getting socket base url";
  const socket = new SockJS(socketBaseUrl);
  return Stomp.over(socket);
};

export default getSocketClient;
