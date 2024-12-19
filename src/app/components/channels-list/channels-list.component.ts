import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Channel } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { AddChannel, SetSelectedChannel } from '../../store/actions';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [
    FormsModule,
    ListboxModule,
    ButtonModule
  ],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsListComponent {
  private dialogRef: DynamicDialogRef | null = null;
  @Input() selectedChannel: Channel | null = null;
  @Input() userChannels: Channel[] = [];

  constructor(private store: Store, private dialogService: DialogService) {}

  onAddClick(): void {
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

  onSelectedChannelChange(): void {
    this.store.dispatch(new SetSelectedChannel(this.selectedChannel));
  }
}
