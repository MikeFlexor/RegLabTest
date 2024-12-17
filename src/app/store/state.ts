import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataStateModel, LoginData, User } from "../models/models";
import { GetUsers, Login } from "./actions";
import { HttpClient } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { v4 as uuid } from 'uuid';
import { Router } from "@angular/router";

const defaultState: DataStateModel = {
  users: [],
  isAuthenticated: false
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
  static isAuthenticated(state: DataStateModel) {
    return state.isAuthenticated;
  }

  constructor(private http: HttpClient, private router: Router) {}

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

  /** Аутентификация пользователя */
  @Action(Login)
  login(ctx: StateContext<DataStateModel>, { loginData }: Login) {
    return this.http.post<boolean>(`${this.baseUrl}/login`, loginData)
      .pipe(
        tap((response) => {
          if (response) {
            ctx.patchState({ isAuthenticated: response });
            this.router.navigate(['/']);
          } else {
            // TODO Информационное сообщение
          }
        }),
        catchError(() => {
          // Поскольку без бэкенда возникнет ошибка, проверяем аутентификацию на клиенте
          if (this.validateLoginData(ctx.getState().users, loginData)) {
            ctx.patchState({ isAuthenticated: true });
            this.router.navigate(['/']);
          } else {
            // TODO Информационное сообщение
          }
          return throwError(() => new Error());
        })
      );
  }

  /** Получение тестового списка пользователей */
  private getTestUsers(): User[] {
    const users: User[] = [];
    const userNames: string[] = ['Александр', 'Елена', 'Сергей', 'Ольга',
      'Дмитрий', 'Татьяна', 'Андрей', 'Мария', 'Владимир', 'Юлия'];

    for (let i = 0; i < userNames.length; i++) {
      users.push({
        id: i,
        username: userNames[i],
        password: '111',
        isOnline: false
      } as User);
    }

    return users;
  }

  /** Проверка на корректность введенных данных авторизации */
  private validateLoginData(users: User[], loginData: LoginData): boolean {
    for (const user of users) {
      if (user.username === loginData.username && user.password === loginData.password) {
        return true;
      }
    }
    return false;
  }

  // /** Тестовое получение сгенерированного списка пользователей */
  // private getGeneratedUsers(): User[] {
  //   const users: User[] = [];
  //   const maleNames: string[] = ['Александр', 'Алексей', 'Виктор', 'Сергей',
  //     'Дмитрий', 'Михаил', 'Андрей', 'Владимир', 'Иван', 'Максим'];
  //   const femaleNames: string[] = ['Анна', 'Елена', 'Ольга', 'Светлана',
  //     'Юлия', 'Наталья', 'Татьяна', 'Мария', 'Анастасия', 'Ирина'];
  //   const surnames: string[] = ['Иванов', 'Смирнов', 'Сидоров', 'Кузнецов',
  //     'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Волков'];

  //   for (let i = 0; i < 10; i++) {
  //     const isMale: boolean = Math.random() > 0.5;
  //     const name: string = isMale
  //       ? maleNames[Math.floor(Math.random() * maleNames.length)]
  //       : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  //     const surname: string = isMale
  //       ? surnames[Math.floor(Math.random() * surnames.length)]
  //       : `${surnames[Math.floor(Math.random() * surnames.length)]}а`;

  //     users.push({
  //       id: uuid(),
  //       username: `${name} ${surname}`,
  //       password: '111',
  //       isOnline: false
  //     } as User);
  //   }

  //   return users;
  // }
}
