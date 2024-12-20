import { Channel, LoginData } from "../models/models";

const stateName = 'Data';

export class GetUsers {
  static readonly type = `[${stateName}] GetUsers`;
}

export class GetCurrentUser {
  static readonly type = `[${stateName}] GetCurrentUser`;
}

export class GetChannels {
  static readonly type = `[${stateName}] GetChannels`;
}

export class GetUserChannels {
  static readonly type = `[${stateName}] GetUserChannels`;
}

export class Login {
  static readonly type = `[${stateName}] Login`;
  constructor(public readonly loginData: LoginData) {}
}

export class Logout {
  static readonly type = `[${stateName}] Logout`;
  constructor(public readonly userUuid: string) {}
}

export class AddChannel {
  static readonly type = `[${stateName}] AddChannel`;
  constructor(public readonly channelName: string) {}
}

export class SetSelectedChannel {
  static readonly type = `[${stateName}] SetSelectedChannel`;
  constructor(public readonly selectedChannel: Channel | null) {}
}

export class AddUserToChannel {
  static readonly type = `[${stateName}] AddUserToChannel`;
  constructor(
    public readonly userUuid: string,
    public readonly channelUuid: string
  ) {}
}

export class GetMessages {
  static readonly type = `[${stateName}] GetMessages`;
}

export class SendMessage {
  static readonly type = `[${stateName}] SendMessage`;
  constructor(public readonly messageText: string) {}
}

export class RenameUser {
  static readonly type = `[${stateName}] RenameUser`;
  constructor(public readonly userName: string) {}
}
