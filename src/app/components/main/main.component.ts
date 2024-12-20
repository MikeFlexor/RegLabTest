import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ChannelsListComponent } from '../channels-list/channels-list.component';
import { ChannelUsersComponent } from '../channel-users/channel-users.component';
import { ChatComponent } from '../chat/chat.component';
import { Store } from '@ngxs/store';
import { DataState } from '../../store/state';
import { Observable, tap } from 'rxjs';
import { Channel, MessageToShow, User } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AddChannel, AddUserToChannel, Logout, SendMessage, SetSelectedChannel } from '../../store/actions';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddUserComponent } from '../add-user/add-user.component';

@UntilDestroy({ checkProperties: true })
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
  private dialogRef: DynamicDialogRef | null = null;

  constructor(
    private store: Store,
    private router: Router,
    private dialogService: DialogService
  ) {}

  onLogout(userUuid: string): void {
    this.store.dispatch(new Logout(userUuid));
  }

  onOpenAddChannelWindow(): void {
    this.dialogRef = this.dialogService.open(AddChannelComponent, {
      header: 'Добавить новый канал',
      focusOnShow: false
    });

    this.dialogRef.onClose
      .pipe(
        tap((channelName?: string) => {
          if (channelName !== undefined) {
            this.store.dispatch(new AddChannel(channelName));
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onOpenAddUserWindow(): void {
    this.dialogRef = this.dialogService.open(AddUserComponent, {
      data: this.store.selectSnapshot(DataState.users),
      header: 'Добавить пользователя',
      focusOnShow: false
    });

    this.dialogRef.onClose
      .pipe(
        tap((user?: User) => {
          const selectedChannel = this.store.selectSnapshot(DataState.selectedChannel);
          if (user !== undefined && selectedChannel) {
            this.store.dispatch(
              new AddUserToChannel(user.uuid, selectedChannel.uuid
            ));
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onOpenSettings(): void {
    this.router.navigate(['/user']);
  }

  onSelectChannel(channel: Channel | null): void {
    this.store.dispatch(new SetSelectedChannel(channel));
  }

  onSendMessage(messageText: string): void {
    this.store.dispatch(new SendMessage(messageText));
  }
}
