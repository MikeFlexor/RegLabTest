import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ChannelsListComponent } from '../channels-list/channels-list.component';
import { ChannelUsersComponent } from '../channel-users/channel-users.component';
import { ChatComponent } from '../chat/chat.component';
import { Store } from '@ngxs/store';
import { DataState } from '../../store/state';
import { Observable } from 'rxjs';
import { Channel, User } from '../../models/models';
import { CommonModule } from '@angular/common';

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
  currentUser$: Observable<User | null> = this.store.select(DataState.currentUser);
  currentUserChannels$: Observable<Channel[]> = this.store.select(DataState.currentUserChannels);
  selectedChannel$: Observable<Channel | null> = this.store.select(DataState.selectedChannel);

  constructor(private store: Store) {}
}
