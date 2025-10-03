import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    await this.loadTasks();
  }

  get tasks$(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async loadTasks(): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await this.http.get<Task[]>(`${environment.apiUrl}/tasks`, { headers }).toPromise();
      
      if (response) {
        this.tasks.next(response);
        await this.storage.set('tasks', response);
      }
    } catch (error) {
      console.error('Failed to load tasks from server, loading from local storage:', error);
      const localTasks = await this.storage.get('tasks') || [];
      this.tasks.next(localTasks);
    }
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      const headers = await this.getAuthHeaders();
      const task = await this.http.post<Task>(`${environment.apiUrl}/tasks`, taskData, { headers }).toPromise();
      
      if (task) {
        const currentTasks = this.tasks.value;
        const updatedTasks = [...currentTasks, task];
        this.tasks.next(updatedTasks);
        await this.storage.set('tasks', updatedTasks);
        return task;
      }
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const headers = await this.getAuthHeaders();
      const updatedTask = await this.http.put<Task>(`${environment.apiUrl}/tasks/${taskId}`, updates, { headers }).toPromise();
      
      if (updatedTask) {
        const currentTasks = this.tasks.value;
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          currentTasks[taskIndex] = updatedTask;
          this.tasks.next([...currentTasks]);
          await this.storage.set('tasks', currentTasks);
        }
        return updatedTask;
      }
      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await this.http.delete(`${environment.apiUrl}/tasks/${taskId}`, { headers }).toPromise();
      
      const currentTasks = this.tasks.value;
      const updatedTasks = currentTasks.filter(t => t.id !== taskId);
      this.tasks.next(updatedTasks);
      await this.storage.set('tasks', updatedTasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const headers = await this.getAuthHeaders();
      const task = await this.http.get<Task>(`${environment.apiUrl}/tasks/${taskId}`, { headers }).toPromise();
      return task || null;
    } catch (error) {
      console.error('Failed to get task:', error);
      // Fallback to local storage
      const currentTasks = this.tasks.value;
      return currentTasks.find(t => t.id === taskId) || null;
    }
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  searchTasks(query: string): Observable<Task[]> {
    const lowerQuery = query.toLowerCase();
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
      ))
    );
  }

  getUpcomingTasks(): Observable<Task[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek && task.status !== TaskStatus.COMPLETED;
      }))
    );
  }

  getOverdueTasks(): Observable<Task[]> {
    const now = new Date();
    
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate < now && task.status !== TaskStatus.COMPLETED;
      }))
    );
  }

  getTasksCount(): Observable<{total: number, pending: number, inProgress: number, completed: number}> {
    return this.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
        inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
        completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
      }))
    );
  }
}