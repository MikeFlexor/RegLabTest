import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ChannelsListComponent } from '../channels-list/channels-list.component';
import { ChannelUsersComponent } from '../channel-users/channel-users.component';
import { ChatComponent } from '../chat/chat.component';
import { Store } from '@ngxs/store';
import { DataState } from '../../store/state';
import { Observable } from 'rxjs';
import { Channel, MessageToShow, User } from '../../models/models';
import { CommonModule } from '@angular/common';
import { Logout, SendMessage } from '../../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    UserMenuComponent,
    ChannelsListComponent,
    ChannelUsersComponent,
    ChatComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  channelUsers$: Observable<User[]> = this.store.select(DataState.channelUsers);
  currentUser$: Observable<User | null> = this.store.select(DataState.currentUser);
  currentUserChannels$: Observable<Channel[]> = this.store.select(DataState.currentUserChannels);
  messagesToShow$: Observable<MessageToShow[]> = this.store.select(DataState.messagesToShow);
  selectedChannel$: Observable<Channel | null> = this.store.select(DataState.selectedChannel);
  users$: Observable<User[]> = this.store.select(DataState.users);

  constructor(private store: Store, private router: Router) {}

  onLogout(userUuid: string): void {
    this.store.dispatch(new Logout(userUuid));
  }

  onOpenSettings(): void {
    this.router.navigate(['/user']);
  }

  onSendMessage(messageText: string): void {
    this.store.dispatch(new SendMessage(messageText));
  }
}
