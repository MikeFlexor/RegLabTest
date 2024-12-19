import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/models';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  @Output() logout = new EventEmitter<string>();
  @Output() openSettings = new EventEmitter();
  @Input() user: User | null = null;

  onLogoutClick(): void {
    const userUuid = this.user ? this.user.uuid : '';
    this.logout.emit(userUuid);
  }

  onSettingsClick(): void {
    this.openSettings.emit();
  }
}
