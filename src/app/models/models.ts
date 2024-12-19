export interface DataStateModel {
  users: User[];
  currentUser: User | null;
  channels: Channel[];
  userChannels: UserChannel[];
  currentUserChannels: Channel[];
  selectedChannel: Channel | null;
  channelUsers: User[];
  messages: Message[];
  messagesToShow: MessageToShow[];
}

export interface User {
  uuid: string;
  username: string;
  password: string;
  isOnline: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface Channel {
  uuid: string;
  name: string;
}

export interface UserChannel {
  userUuid: string;
  channelUuid: string;
}

export interface AddChannelData {
  userUuid: string;
  channelName: string;
}

export interface Message {
  uuid: string;
  fromUser: string;
  channelUuid: string;
  content: string;
}

export interface MessageToShow {
  username: string;
  text: string;
}
