import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
}

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  private httpClient = inject(HttpClient);

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isEditing = signal<boolean>(false);
  status = signal<string>('');
  
  // Form fields
  userName = signal<string>('');
  userEmail = signal<string>('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.status.set('Loading users...');
    this.httpClient.get<User[]>(`${environment.apiBaseUrl}/users`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.status.set(`Loaded ${users.length} users`);
      },
      error: (error) => {
        this.status.set(`Error loading users: ${error.message}`);
        this.users.set([]);
      }
    });
  }

  createUser(): void {
    if (!this.userName().trim() || !this.userEmail().trim()) {
      this.status.set('Name and email are required');
      return;
    }

    const newUser: User = {
      name: this.userName().trim(),
      email: this.userEmail().trim()
    };

    this.status.set('Creating user...');
    this.httpClient.post<User>(`${environment.apiBaseUrl}/users`, newUser).subscribe({
      next: (user) => {
        this.users.update(users => [...users, user]);
        this.clearForm();
        this.status.set(`User "${user.name}" created successfully`);
      },
      error: (error) => {
        this.status.set(`Error creating user: ${error.message}`);
      }
    });
  }

  editUser(user: User): void {
    this.selectedUser.set(user);
    this.isEditing.set(true);
    this.userName.set(user.name);
    this.userEmail.set(user.email);
  }

  updateUser(): void {
    const user = this.selectedUser();
    if (!user || !this.userName().trim() || !this.userEmail().trim()) {
      this.status.set('Name and email are required');
      return;
    }

    const updatedUser: User = {
      ...user,
      name: this.userName().trim(),
      email: this.userEmail().trim()
    };

    this.status.set('Updating user...');
    this.httpClient.put(`${environment.apiBaseUrl}/users/${user.id}`, updatedUser).subscribe({
      next: () => {
        this.users.update(users => 
          users.map(u => u.id === user.id ? updatedUser : u)
        );
        this.clearForm();
        this.status.set(`User "${updatedUser.name}" updated successfully`);
      },
      error: (error) => {
        this.status.set(`Error updating user: ${error.message}`);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete "${user.name}"?`)) {
      return;
    }

    this.status.set('Deleting user...');
    this.httpClient.delete(`${environment.apiBaseUrl}/users/${user.id}`).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== user.id));
        if (this.selectedUser()?.id === user.id) {
          this.clearForm();
        }
        this.status.set(`User "${user.name}" deleted successfully`);
      },
      error: (error) => {
        this.status.set(`Error deleting user: ${error.message}`);
      }
    });
  }

  clearForm(): void {
    this.selectedUser.set(null);
    this.isEditing.set(false);
    this.userName.set('');
    this.userEmail.set('');
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
}
