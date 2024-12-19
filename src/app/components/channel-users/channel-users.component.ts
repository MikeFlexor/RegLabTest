import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Store } from '@ngxs/store';
import { Channel, User } from '../../models/models';
import { AddUserComponent } from '../add-user/add-user.component';
import { AddUserToChannel } from '../../store/actions';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-channel-users',
  standalone: true,
  imports: [
    FormsModule,
    ListboxModule,
    ButtonModule
  ],
  templateUrl: './channel-users.component.html',
  styleUrl: './channel-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelUsersComponent {
  @Input() channelUsers: User[] = [];
  @Input() selectedChannel: Channel | null = null;
  @Input() users: User[] = [];
  private dialogRef: DynamicDialogRef | null = null;

  constructor(private store: Store, private dialogService: DialogService) {}

  onAddClick(): void {
    this.dialogRef = this.dialogService.open(AddUserComponent, {
      data: this.users,
      header: 'Добавить пользователя',
      focusOnShow: false
    });

    this.dialogRef.onClose
      .pipe(
        tap((user?: User) => {
          if (user !== undefined && this.selectedChannel) {
            this.store.dispatch(
              new AddUserToChannel(user.uuid, this.selectedChannel.uuid
            ));
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
