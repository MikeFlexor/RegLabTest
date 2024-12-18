import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Channel } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { AddChannel } from '../../store/actions';
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
export class ChannelsListComponent implements OnChanges {
  private dialogRef: DynamicDialogRef | null = null;
  @Input() selectedChannel: Channel | null = null;
  @Input() userChannels: Channel[] = [];

  constructor(private store: Store, private dialogService: DialogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onAddClick(): void {
    this.dialogRef = this.dialogService.open(AddChannelComponent, {
      header: 'Добавить новый канал',
      focusOnShow: false
    });

    this.dialogRef.onClose
      .pipe(
        tap((channelName: string) => {
          if (channelName !== undefined) {
            this.store.dispatch(new AddChannel(channelName));
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onSelectedChannelChange(): void {
    // TODO
  }
}
