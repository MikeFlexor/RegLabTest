import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-channel-users',
  standalone: true,
  imports: [],
  templateUrl: './channel-users.component.html',
  styleUrl: './channel-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelUsersComponent { }
