import { v4 as uuid } from 'uuid';
import { Channel, Message, User, UserChannel } from "../models/models";

export class TestData {
  /** Получение тестового списка пользователей */
  static getTestUsers(): User[] {
    const usersString = localStorage.getItem('users');
    if (usersString) {
      return JSON.parse(usersString) as User[];
    }

    const users: User[] = [];
    const userNames: string[] = ['Александр', 'Елена', 'Сергей', 'Ольга', 'Дмитрий', 'Татьяна', 'Андрей', 'Мария', 'Владимир', 'Юлия'];

    for (let i = 0; i < userNames.length; i++) {
      users.push({
        uuid: i.toString(),
        username: userNames[i],
        password: '111',
        isOnline: false
      } as User);
    }

    localStorage.setItem('users', JSON.stringify(users));
    return users;
  }

  /** Получение тестового списка каналов */
  static getTestChannels(): Channel[] {
    const channelsString = localStorage.getItem('channels');
    if (channelsString) {
      return JSON.parse(channelsString) as Channel[];
    }

    const channels: Channel[] = [];
    const channelNames: string[] = ['Рабочие вопросы', 'Флудилка', 'Мужские разговоры', 'Женские секреты'];

    for (let i = 0; i < channelNames.length; i++) {
      channels.push({ uuid: i.toString(), name: channelNames[i] } as Channel);
    }

    localStorage.setItem('channels', JSON.stringify(channels));
    return channels;
  }

  /** Получение тестового списка каналов пользователей */
  static getTestUserChannels(): UserChannel[] {
    const userChannelsString = localStorage.getItem('userChannels');
    if (userChannelsString) {
      return JSON.parse(userChannelsString) as UserChannel[];
    }

    const userChannels: UserChannel[] = [];

    for (let i = 0; i < 10; i++) {
      const userUuid: string = i.toString();
      userChannels.push({ userUuid, channelUuid: '0' } as UserChannel);
      userChannels.push({ userUuid, channelUuid: '1' } as UserChannel);
      if (i % 2) {
        userChannels.push({ userUuid, channelUuid: '3' } as UserChannel);
      } else {
        userChannels.push({ userUuid, channelUuid: '2' } as UserChannel);
      }
    }

    localStorage.setItem('userChannels', JSON.stringify(userChannels));
    return userChannels;
  }

  /** Получение тестового списка сообщений */
  static getTestMessages(): Message[] {
    const messagesString = localStorage.getItem('messages');
    if (messagesString) {
      return JSON.parse(messagesString) as Message[];
    }

    const messages: Message[] = [];
    messages.push({ uuid: uuid(), fromUser: '5', channelUuid: '0', content: 'Коллеги, сегодня планерка в 11:00' } as Message);
    messages.push({ uuid: uuid(), fromUser: '5', channelUuid: '0', content: 'Всем быть!' } as Message);
    messages.push({ uuid: uuid(), fromUser: '2', channelUuid: '0', content: 'У нас, наверное, встреча с заказчиком еще не закончится к этому времени' } as Message);
    messages.push({ uuid: uuid(), fromUser: '5', channelUuid: '0', content: 'Предупредите Александра Сергеевича' } as Message);
    messages.push({ uuid: uuid(), fromUser: '0', channelUuid: '0', content: 'Я понял' } as Message);
    messages.push({ uuid: uuid(), fromUser: '0', channelUuid: '0', content: 'Как закончите с заказчиком, сразу к нам в переговорную' } as Message);
    messages.push({ uuid: uuid(), fromUser: '0', channelUuid: '0', content: 'Мы там надолго' } as Message);
    messages.push({ uuid: uuid(), fromUser: '2', channelUuid: '0', content: 'Да, хорошо!' } as Message);
    messages.push({ uuid: uuid(), fromUser: '8', channelUuid: '1', content: 'Всем привет!' } as Message);
    messages.push({ uuid: uuid(), fromUser: '8', channelUuid: '1', content: 'В субботу кто-то желает на шашлыки?))' } as Message);
    messages.push({ uuid: uuid(), fromUser: '1', channelUuid: '1', content: 'Дождь же передавали, вроде' } as Message);
    messages.push({ uuid: uuid(), fromUser: '6', channelUuid: '1', content: 'Да не факт еще' } as Message);
    messages.push({ uuid: uuid(), fromUser: '6', channelUuid: '1', content: 'Но если будет дождь, можно тогда ко мне на дачу' } as Message);
    messages.push({ uuid: uuid(), fromUser: '6', channelUuid: '1', content: 'В беседку под крышу' } as Message);
    messages.push({ uuid: uuid(), fromUser: '8', channelUuid: '1', content: 'О, супер!' } as Message);
    messages.push({ uuid: uuid(), fromUser: '9', channelUuid: '1', content: 'Мы с Таней хотим)' } as Message);
    messages.push({ uuid: uuid(), fromUser: '1', channelUuid: '1', content: 'Ну, я то тоже не против' } as Message);
    messages.push({ uuid: uuid(), fromUser: '4', channelUuid: '2', content: 'Вот это матч вчера был! Кто смотрел?' } as Message);
    messages.push({ uuid: uuid(), fromUser: '6', channelUuid: '2', content: 'Ага, интересный' } as Message);
    messages.push({ uuid: uuid(), fromUser: '8', channelUuid: '2', content: 'Опять вы про Спартак? Раз в год и палка стреляет)))' } as Message);
    messages.push({ uuid: uuid(), fromUser: '3', channelUuid: '3', content: 'Девочки, посоветуйте хорошего мастера по ногтям, чтоб недалеко отсюда' } as Message);
    messages.push({ uuid: uuid(), fromUser: '3', channelUuid: '3', content: 'А то моя переехала, далековато теперь ездить' } as Message);
    messages.push({ uuid: uuid(), fromUser: '3', channelUuid: '3', content: 'Хочу у кого-то нового попробовать' } as Message);
    messages.push({ uuid: uuid(), fromUser: '7', channelUuid: '3', content: 'У меня есть рядом, я всем довольна. Сейчас номер скину' } as Message);
    messages.push({ uuid: uuid(), fromUser: '7', channelUuid: '3', content: '8-800-555-35-35' } as Message);

    localStorage.setItem('messages', JSON.stringify(messages));
    return messages;
  }
}
