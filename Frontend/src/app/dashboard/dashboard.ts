import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private httpClient = inject(HttpClient);

  pingResponse = signal<string>('');
  greeterResponse = signal<string>('');

  ngOnInit(): void {
    this.httpClient.get<{ message: string }>(`${environment.apiBaseUrl}/ping`).subscribe(response => {
      this.pingResponse.set(response.message);
    });

    this.httpClient.get<{ message: string }>(`${environment.apiBaseUrl}/callGreeter`).subscribe(response => {
      this.greeterResponse.set(response.message);
    });
  }
}
