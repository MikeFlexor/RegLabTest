import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { Logout } from '../../store/actions';
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
  @Input() user: User | null = null;

  constructor(private store: Store, private router: Router) {}

  onLogoutClick(): void {
    const userUuid = this.user ? this.user.uuid : '';
    this.store.dispatch(new Logout(userUuid));
  }

  onSettingsClick(): void {
    this.router.navigate(['/user']);
  }
}
