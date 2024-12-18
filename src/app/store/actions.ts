import { LoginData } from "../models/models";

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
