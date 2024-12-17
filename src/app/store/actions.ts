import { LoginData } from "../models/models";

const stateName = 'Data';

export class GetUsers {
  static readonly type = `[${stateName}] GetUsers`;
}

export class Login {
  static readonly type = `[${stateName}] Login`;
  constructor(public readonly loginData: LoginData) {}
}
