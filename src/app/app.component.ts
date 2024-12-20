import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetChannels, GetCurrentUser, GetMessages, GetUserChannels, GetUsers } from './store/actions';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetUsers());
    this.store.dispatch(new GetCurrentUser());
    this.store.dispatch(new GetChannels());
    this.store.dispatch(new GetUserChannels());
    this.store.dispatch(new GetMessages());
  }
}
