import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddChannelData, Channel, DataStateModel, LoginData, Message, MessageToShow, User, UserChannel } from "../models/models";
import { AddChannel, AddUserToChannel, GetChannels, GetCurrentUser, GetMessages, GetUserChannels, GetUsers, Login, Logout, RenameUser, SendMessage, SetSelectedChannel } from "./actions";
import { HttpClient } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { v4 as uuid } from 'uuid';
import { Router } from "@angular/router";

const defaultState: DataStateModel = {
  users: [],
  currentUser: null,
  channels: [],
  userChannels: [],
  currentUserChannels: [],
  selectedChannel: null,
  channelUsers: [],
  messages: [],
  messagesToShow: []
};

@State<DataStateModel>({
  name: 'Data',
  defaults: defaultState
})
@Injectable()
export class DataState {
  private readonly baseUrl = 'http://localhost:3001';

  @Selector()
  static users(state: DataStateModel) {
    return state.users;
  }

  @Selector()
  static currentUser(state: DataStateModel) {
    return state.currentUser;
  }

  @Selector()
  static currentUserChannels(state: DataStateModel) {
    return state.currentUserChannels;
  }

  @Selector()
  static selectedChannel(state: DataStateModel) {
    return state.selectedChannel;
  }

  @Selector()
  static channelUsers(state: DataStateModel) {
    return state.channelUsers;
  }

  @Selector()
  static messagesToShow(state: DataStateModel) {
    return state.messagesToShow;
  }

  constructor(private http: HttpClient, private router: Router) {}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка пользователей */
  @Action(GetUsers)
  getUsers(ctx: StateContext<DataStateModel>) {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
      .pipe(
        tap((response) => {
          ctx.patchState({ users: response });
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, получаем тестовый список пользователей на клиенте
          ctx.patchState({ users: this.getTestUsers() });
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение текущего пользователя */
  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<DataStateModel>) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString) as User;
      ctx.patchState({ currentUser });
    } else {
      ctx.patchState({ currentUser: null });
    }

    const currentUserChannelsString = localStorage.getItem('currentUserChannels');
    if (currentUserChannelsString) {
      const currentUserChannels = JSON.parse(currentUserChannelsString) as Channel[];
      ctx.patchState({ currentUserChannels});
    } else {
      ctx.patchState({ currentUserChannels: [] });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение общего списка каналов */
  @Action(GetChannels)
  getChannels(ctx: StateContext<DataStateModel>) {
    return this.http.get<Channel[]>(`${this.baseUrl}/channels`)
      .pipe(
        tap((response) => {
          ctx.patchState({ channels: response });
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, получаем общий список каналов из локалстора
          const channelsString = localStorage.getItem('channels');
          if (channelsString) {
            const channels = JSON.parse(channelsString) as Channel[];
            ctx.patchState({ channels });
          } else {
            localStorage.setItem('channels', JSON.stringify([]));
            ctx.patchState({ channels: [] });
          }
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка каналов пользователей */
  @Action(GetUserChannels)
  getUserChannels(ctx: StateContext<DataStateModel>) {
    return this.http.get<UserChannel[]>(`${this.baseUrl}/userChannels`)
      .pipe(
        tap((response) => {
          ctx.patchState({ userChannels: response });
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, получаем список каналов пользователей из локалстора
          const userChannelsString = localStorage.getItem('userChannels');
          if (userChannelsString) {
            const userChannels = JSON.parse(userChannelsString) as UserChannel[];
            ctx.patchState({ userChannels });
          } else {
            localStorage.setItem('userChannels', JSON.stringify([]));
            ctx.patchState({ userChannels: [] });
          }
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Аутентификация пользователя */
  @Action(Login)
  login(ctx: StateContext<DataStateModel>, { loginData }: Login) {
    return this.http.post<User>(`${this.baseUrl}/login`, loginData)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.patchState({ currentUser: response });
            this.router.navigate(['/']);
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, проверяем аутентификацию на клиенте
          const users = ctx.getState().users;
          const user = this.getUserByLoginData(users, loginData);
          if (user) {
            const foundUser = users
              .find((i) => i.username === loginData.username);
            if (foundUser) {
              foundUser.isOnline = true;
            }
            ctx.patchState({ users, currentUser: foundUser });
            const currentUserChannels = this.getCurrentUserChannels(ctx.getState());
            ctx.patchState({ currentUserChannels });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            localStorage.setItem('currentUserChannels', JSON.stringify(currentUserChannels));
            this.router.navigate(['/']);
          } else {
            // TODO Информационное сообщение
          }
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Выход пользователя */
  @Action(Logout)
  logout(ctx: StateContext<DataStateModel>, { userUuid }: Logout) {
    return this.http.post<boolean>(`${this.baseUrl}/logout`, userUuid)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.patchState({ currentUser: null });
            this.router.navigate(['/login']);
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, выходим на клиенте
          const users = ctx.getState().users;
          const foundUser = users.find((i) => i.uuid === userUuid);
          if (foundUser) {
            foundUser.isOnline = false;
          }
          ctx.patchState({
            users,
            currentUser: null,
            selectedChannel: null,
            channelUsers: [],
            messagesToShow: []
          });
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentUserChannels');
          this.router.navigate(['/login']);
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Добавление канала */
  @Action(AddChannel)
  addChannel(ctx: StateContext<DataStateModel>, { channelName }: AddChannel) {
    const state = ctx.getState();
    const userUuid = state.currentUser ? state.currentUser.uuid : '';
    const addChannelData: AddChannelData = { userUuid, channelName };

    return this.http.post<boolean>(`${this.baseUrl}/channels`, addChannelData)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.dispatch(new GetChannels());
            ctx.dispatch(new GetUserChannels());
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, добавляем и сохраняем данные на клиенте
          const channelUuid: string = uuid();

          const channels = state.channels;
          channels.push({
            uuid: channelUuid,
            name: channelName
          } as Channel);

          const userChannels = state.userChannels;
          userChannels.push({
            userUuid: state.currentUser ? state.currentUser.uuid : '',
            channelUuid
          } as UserChannel);

          const currentUserChannels = [...state.currentUserChannels];
          currentUserChannels.push({
            uuid: channelUuid,
            name: channelName
          } as Channel);

          ctx.patchState({ channels, userChannels, currentUserChannels });
          localStorage.setItem('channels', JSON.stringify(channels));
          localStorage.setItem('userChannels', JSON.stringify(userChannels));
          localStorage.setItem('currentUserChannels', JSON.stringify(currentUserChannels));

          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Установка выбранного канала */
  @Action(SetSelectedChannel)
  setSelectedChannel(
    ctx: StateContext<DataStateModel>,
    { selectedChannel }: SetSelectedChannel
  ) {
    ctx.patchState({ selectedChannel });
    const channelUsers = this.getChannelUsers(ctx.getState());
    ctx.patchState({ channelUsers });
    const messagesToShow = selectedChannel
      ? this.getMessagesToShow(ctx.getState())
      : [];
    return ctx.patchState({ messagesToShow });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Добавление пользователя в канал */
  @Action(AddUserToChannel)
  addUserToChannel(
    ctx: StateContext<DataStateModel>,
    { userUuid, channelUuid }: AddUserToChannel
  ) {
    const state = ctx.getState();
    const userChannels = state.userChannels;
    const existUserChannel = userChannels
      .find((i) => i.userUuid === userUuid && i.channelUuid === channelUuid);

    if (existUserChannel) {
      return;
    }

    const data: UserChannel = { userUuid, channelUuid };

    return this.http.post<boolean>(`${this.baseUrl}/userChannels`, data)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.dispatch(new GetUserChannels());
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, добавляем и сохраняем пользователя на клиенте
          userChannels.push({ userUuid, channelUuid } as UserChannel);
          localStorage.setItem('userChannels', JSON.stringify(userChannels));
          const channelUsers = this.getChannelUsers(state);
          ctx.patchState({ userChannels, channelUsers });
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка сообщений */
  @Action(GetMessages)
  getMessages(ctx: StateContext<DataStateModel>) {
    return this.http.get<Message[]>(`${this.baseUrl}/messages`)
      .pipe(
        tap((response) => {
          ctx.patchState({ messages: response });
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, получаем тестовый список сообщений на клиенте
          ctx.patchState({ messages: this.getTestMessages() });
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Отправка сообщения */
  @Action(SendMessage)
  sendMessage(ctx: StateContext<DataStateModel>, { messageText }: SendMessage) {
    const state = ctx.getState();

    if (!state.currentUser || !state.selectedChannel) {
      return;
    }

    const message: Message = {
      uuid: uuid(),
      fromUser: state.currentUser.uuid,
      channelUuid: state.selectedChannel.uuid,
      content: messageText
    };

    return this.http.post<boolean>(`${this.baseUrl}/messages`, message)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.dispatch(new GetMessages());
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, добавляем и сохраняем сообщение на клиенте
          const messages = state.messages;
          messages.push(message);
          localStorage.setItem('messages', JSON.stringify(messages));
          const messagesToShow = this.getMessagesToShow(state);
          ctx.patchState({ messages, messagesToShow });
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Переименование пользователя */
  @Action(RenameUser)
  renameUser(ctx: StateContext<DataStateModel>, { username }: RenameUser) {
    const state = ctx.getState();
    const user = state.currentUser;
    if (!user) {
      return;
    }
    user.username = username;

    return this.http.put<boolean>(`${this.baseUrl}/users`, user)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.dispatch(new GetUsers());
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, переименовываем пользователя на клиенте
          const users = state.users;
          const foundUser = users.find((i) => i.uuid === user.uuid);
          if (foundUser) {
            foundUser.username = username;
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('users', JSON.stringify(users));
          ctx.patchState({ users, currentUser: user });
          return throwError(() => new Error());
        })
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение тестового списка пользователей */
  private getTestUsers(): User[] {
    const usersString = localStorage.getItem('users');
    if (usersString) {
      const users = JSON.parse(usersString) as User[];
      return users;
    }

    const users: User[] = [];
    const userNames: string[] = ['Александр', 'Елена', 'Сергей', 'Ольга',
      'Дмитрий', 'Татьяна', 'Андрей', 'Мария', 'Владимир', 'Юлия'];

    for (let i = 0; i < userNames.length; i++) {
      users.push({
        uuid: uuid(),
        username: userNames[i],
        password: '111',
        isOnline: false
      } as User);
    }

    localStorage.setItem('users', JSON.stringify(users));
    return users;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение тестового списка сообщений */
  private getTestMessages(): Message[] {
    const messagesString = localStorage.getItem('messages');
    if (messagesString) {
      const messages = JSON.parse(messagesString) as Message[];
      return messages;
    }

    const messages: Message[] = [];
    localStorage.setItem('messages', JSON.stringify(messages));
    return messages;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение пользователя по введенным данным аутентификации */
  private getUserByLoginData(users: User[], loginData: LoginData): User | null {
    for (const user of users) {
      if (user.username === loginData.username && user.password === loginData.password) {
        return user;
      }
    }
    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка каналов, с которым привязан текущий пользователь */
  private getCurrentUserChannels(data: DataStateModel): Channel[] {
    const channels: Channel[] = [];
    const currentUserChannels = data.userChannels
      .filter((i) => i.userUuid === data.currentUser?.uuid);

    for (const channel of currentUserChannels) {
      const foundChannelName = data.channels
        .find((i) => i.uuid === channel.channelUuid);
      if (foundChannelName) {
        channels.push({
          uuid: channel.channelUuid,
          name: foundChannelName.name
        } as Channel);
      }
    }

    return channels;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка пользователей, привязанных к каналу */
  private getChannelUsers(data: DataStateModel): User[] {
    const users: User[] = [];
    const userChannels = data.userChannels
      .filter((i) => i.channelUuid === data.selectedChannel?.uuid);

    for (const channel of userChannels) {
      const foundUser = data.users.find((i) => i.uuid === channel.userUuid);
      if (foundUser) {
        users.push(foundUser);
      }
    }

    return users;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** Получение списка отображаемых в чате сообщений, в зависимости от выбранного канала */
  private getMessagesToShow(data: DataStateModel): MessageToShow[] {
    if (!data.currentUser || !data.selectedChannel) {
      return [];
    }

    const messagesToShow: MessageToShow[] = [];
    const messages = data.messages
      .filter((i) => i.channelUuid === data.selectedChannel?.uuid);
    for (const message of messages) {
      const foundUser = data.users.find((i) => i.uuid === message.fromUser);
      if (foundUser) {
        messagesToShow.push({
          username: foundUser.username,
          text: message.content
        } as MessageToShow);
      }
    }

    return messagesToShow;
  }
}
