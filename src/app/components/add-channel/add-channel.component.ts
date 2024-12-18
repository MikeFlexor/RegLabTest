import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChannelComponent {
  channelName: string = '';

  constructor(private dialogRef: DynamicDialogRef) {}

  onAddClick(): void {
    this.dialogRef.close(this.channelName);
  }
}
