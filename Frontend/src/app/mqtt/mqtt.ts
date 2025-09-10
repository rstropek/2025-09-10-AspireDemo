import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-mqtt',
  imports: [],
  templateUrl: './mqtt.html',
  styleUrls: ['./mqtt.css'],
})
export class Mqtt implements OnDestroy {
  private httpClient = inject(HttpClient);

  messageToSend = signal<string>('Hello MQTT!');
  sendStatus = signal<string>('');
  receivedMessages = signal<string[]>([]);
  isStreaming = signal<boolean>(false);
  
  private eventSource: EventSource | null = null;

  sendMessage(): void {
    this.sendStatus.set('Sending...');
    
    this.httpClient.post(`${environment.apiBaseUrl}/sendMessage`, 
      { message: this.messageToSend() })
      .subscribe({
        next: (response: any) => {
          this.sendStatus.set(`Message sent: ${response.Message}`);
        },
        error: (error) => {
          this.sendStatus.set(`Error: ${error.message}`);
        }
      });
  }

  startStreaming(): void {
    if (this.isStreaming()) return;

    this.isStreaming.set(true);
    this.receivedMessages.set([]);
    
    this.eventSource = new EventSource(`${environment.apiBaseUrl}/messages`);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const timestamp = new Date(data.timestamp).toLocaleTimeString();
        const messageText = `[${timestamp}] ${data.message}`;
        
        this.receivedMessages.update(messages => [messageText, ...messages].slice(0, 20));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      this.stopStreaming();
    };
  }

  stopStreaming(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isStreaming.set(false);
  }

  clearMessages(): void {
    this.receivedMessages.set([]);
  }

  ngOnDestroy(): void {
    this.stopStreaming();
  }
}
