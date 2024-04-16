import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';

export interface IMessage {
  fromUser?: string;
  value?: string;
  type?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  _user: string = '';
  @Input() set user(name: string) {
    if (name) {
      this._user = name;
    }
  }

  message: IMessage = {};
  messages: IMessage[] = [];
  messages$ = new BehaviorSubject<IMessage[]>(this.messages);
  text = new FormControl('');
  channel = new BroadcastChannel('app-data');
  isWriting: boolean = false;

  ngOnInit(): void {
    document.title = this._user;
    this.text.valueChanges.subscribe((e) => {
      this.channel.postMessage({
        fromUser: this._user,
        value: e,
        type: 'event',
      });
    });
    this.channel.addEventListener('message', (event) => {
      const fromUser = event.data.fromUser;
      if (event.data.type === 'event') {
        if (event.data.value !== '') {
          this.isWriting = true;
          document.title = fromUser + ' печатает...';
          this.message.fromUser = fromUser;
        } else {
          this.isWriting = false;
          document.title = this._user;
        }
      } else {
        this.setDataSource(fromUser, event.data.value);
      }
    });
  }

  onSend() {
    this.isWriting = false;
    if (this.text.value! !== '') {
      this.channel.postMessage({
        fromUser: this._user,
        value: this.text.value!,
        type: 'source',
      });
      this.setDataSource(this._user, this.text.value!);
    }
    this.text.setValue('');
  }

  setDataSource(fromUser: string, value: string) {
    this.messages.push({ fromUser, value });
    this.messages$.next(this.messages);
  }
}
