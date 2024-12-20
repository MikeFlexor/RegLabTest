import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

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
  @Output() addChannel = new EventEmitter();
  @Output() selectChannel = new EventEmitter<Channel | null>();
  @Input() selectedChannel: Channel | null = null;
  @Input() userChannels: Channel[] = [];

  onAddClick(): void {
    this.addChannel.emit();
  }

  onSelectedChannelChange(): void {
    this.selectChannel.emit(this.selectedChannel);
  }
}
