import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { Login } from '../../store/actions';
import { LoginData } from '../../models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private store: Store) {}

  onLoginClick(): void {
    const loginData: LoginData = {
      username: this.username,
      password: this.password
    };
    this.store.dispatch(new Login(loginData));
  }
}
