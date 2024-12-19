import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit {
  selectedUser: User | null = null;
  users: User[] = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.users = this.config.data;
  }

  onAddClick(): void {
    this.dialogRef.close(this.selectedUser);
  }
}
