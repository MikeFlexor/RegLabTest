import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageToShow } from '../../models/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  @Input() channelName: string = '';
  @Input() messages: MessageToShow[] = [];
  messageText: string = '';
  @Output() sendMessage = new EventEmitter<string>();

  onSendClick(): void {
    if (this.messageText.length) {
      this.sendMessage.emit(this.messageText);
      this.messageText = '';
    }
  }
}
