import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { Channel, User } from '../../models/models';

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
  @Output() addUser = new EventEmitter();
  @Input() channelUsers: User[] = [];
  @Input() selectedChannel: Channel | null = null;

  onAddClick(): void {
    this.addUser.emit();
  }
}
