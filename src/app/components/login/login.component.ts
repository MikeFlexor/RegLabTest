import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { Login } from '../../store/actions';
import { LoginData } from '../../models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  form: FormGroup;

  constructor(private store: Store, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    const loginData: LoginData = {
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value
    };
    this.store.dispatch(new Login(loginData));
  }
}
