export enum AUTH_URL {
  LOG_IN = "/auth/log-in",
  REGISTER = "/auth/register",
  LOG_OUT = "/auth/log-out",
  CHECK_VALID_REGISTER_INFO = "/auth/check-valid-register-info",
  GET_OTP = "/auth/get-otp",
  VERIFY_OTP = "/auth/verify-otp",
}

export enum ACCOUNT_URL {
  BASE = "accounts",
  SEARCH = "/accounts/search",
  SEARCH_BY_PHONE_NUMBERS = "/accounts/search-by-phone-numbers",
}

export enum POST_URL {
  BASE = "/posts",
  SEARCH = "/posts/search",
}

export enum COMMENT_URL {
  BASE = "/comments",
  SEARCH = "/comments/search",
}

export enum REACTION_URL {
  BASE = "/reactions",
}

export enum MESSENGER_URL {
  BASE = "/messengers",
  FIND_BY_MEMBERS = "/messengers/find-by-members",
  FIND_PERSONAL_BY_MEMBERS = "/messengers/find-personal-by-members",
  SEARCH = "/messengers/search",
  SEARCH_BY_ACCOUNT = "/messengers/search-by-account",
}

export enum MESSAGE_URL {
  BASE = "/messages",
  SEARCH = "/messages/search",
}

export enum RELATIONSHIP_URL {
  BASE = "/relationships",
  ACCEPT_REQUEST = "/relationships/accept",
  DELETE = "/relationships/delete-by-ids",
  GET_FRIEND_REQUESTS = "/relationships/get-friend-requests",
}

export enum COMMENT_REPORT_URL {
  BASE = "/comment-reports",
  SEARCH = "/comment-reports/search",
}

export enum FPT_AI_URL {
  IDENTIFY = "/vision/idr/vnm/",
  FACE_MATCH = "/dmp/checkface/v1",
}

export enum ROOM_URL {
  BASE = "/rooms",
  VIDEO_CALL = "/app/rooms/video-call",
}
