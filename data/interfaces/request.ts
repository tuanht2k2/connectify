import { Interfaces } from "./model";

export namespace RequestInterfaces {
  export interface IIndentifyRequest {
    image: Interfaces.IMultipartFile;
  }

  export interface IFaceMatchRequest {
    file: Interfaces.IMultipartFile[];
  }

  export interface ICommonSearchRequest {
    page: number;
    pageSize: number;
    keyword: string;
    sortBy: string;
    sortDir: "ASC" | "DESC";
  }

  export interface ICommonDeleteRequest {
    ids: string[];
  }

  export interface ILoginRequest {
    phoneNumber: string;
    password: string;
  }

  export interface IRegisterRequest {
    username?: string;
    email?: string;
    password?: string;
    displayName?: string;
    identificationNumber?: string;
    dob?: Date;
    address?: string;
    gender?: number;
    fullName?: string;
    phoneNumber?: string;
  }

  export interface IEditPostRequest {
    content?: string;
    type?: string;
    audience?: string;
    files?: any;
  }

  export interface IEditCommentRequest {
    postId: string;
    content?: string;
    files?: any;
  }

  export interface ISearchPostRequest extends ICommonSearchRequest {
    createdBy?: string;
    group?: string;
    audience?: "PUBLIC" | "PRIVATE" | "FRIENDS";
  }

  export interface ISearchCommentRequest extends ICommonSearchRequest {
    postId?: string;
    createdBy?: string;
  }

  //reaction
  export interface IEditReactionRequest {
    id?: string;
    postId?: string;
    type?: "LIKE" | "LOVE" | "FUNNY" | "SAD" | "ANGRY";
  }

  // chat
  export interface IEditMessengerRequest {
    id?: string;
    name?: string;
    members?: string[];
    type: "GROUP" | "PERSONAL";
  }

  export interface IEditMessageRequest {
    messengerId: string;
    content: string;
  }

  export interface ISearchMessageRequest {
    messengerId?: string;
  }

  export interface ISearchMessengerByAccountRequest {
    accountId?: string;
  }

  export interface ISearchAccountByPhoneNumbers {
    phoneNumbers: string[];
  }

  export interface IEditRelationshipRequest {
    id?: string;
    receiverId?: string;
    status?: "PENDING" | "FRIEND" | "DELETED";
  }

  export interface IEditCommentReportRequest {
    commentId?: string;
    reason?: string;
  }

  export interface IEditDeviceRequest {
    deviceId: string;
  }

  export interface IGetOtpRequest {
    phoneNumber: string;
  }

  export interface IVerifyOtpRequest {
    phoneNumber: string;
    otp: string;
  }
}
