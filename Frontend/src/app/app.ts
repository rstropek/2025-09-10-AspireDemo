import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <nav class="nav-menu">
        <h1>{{ title() }}</h1>
        <ul>
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/mqtt" routerLinkActive="active">MQTT Testing</a></li>
        </ul>
      </nav>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .nav-menu {
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-menu h1 {
      margin: 0;
      color: #495057;
      font-size: 1.5rem;
    }

    .nav-menu ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 1rem;
    }

    .nav-menu a {
      text-decoration: none;
      color: #495057;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-menu a:hover {
      background: #e9ecef;
    }

    .nav-menu a.active {
      background: #007bff;
      color: white;
    }

    .main-content {
      flex: 1;
    }
  `],
})
export class App {
  protected readonly title = signal('Aspire Demo');
}
