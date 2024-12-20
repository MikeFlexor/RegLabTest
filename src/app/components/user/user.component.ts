import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataState } from '../../store/state';
import { User } from '../../models/models';
import { Observable } from 'rxjs';
import { RenameUser } from '../../store/actions';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  currentUser$: Observable<User | null> = this.store.select(DataState.currentUser);
  newUsername: string = '';

  constructor(private store: Store, private router: Router) {}

  onGoToChatClick(): void {
    this.router.navigate(['/']);
  }

  onRenameClick(): void {
    this.store.dispatch(new RenameUser(this.newUsername));
  }
}
