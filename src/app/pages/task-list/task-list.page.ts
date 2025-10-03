import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  isOnline = true;
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed' = 'all';
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.loadTasks();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions() {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilters();
        this.isLoading = false;
      });
  }

  async loadTasks() {
    try {
      await this.taskService.loadTasks();
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.isLoading = false;
    }
  }

  async doRefresh(event: any) {
    try {
      await this.taskService.loadTasks();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      event.target.complete();
    }
  }

  filterTasks(status: 'all' | 'pending' | 'in-progress' | 'completed') {
    this.currentFilter = status;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.tasks];

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(task => task.status === this.currentFilter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    }

    this.filteredTasks = filtered;
  }

  addTask() {
    this.router.navigate(['/add-task']);
  }

  viewTask(taskId: string) {
    this.router.navigate(['/task', taskId]);
  }

  editTask(taskId: string) {
    this.router.navigate(['/edit-task', taskId]);
  }

  async deleteTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.taskService.deleteTask(task.id);
              this.showToast('Task deleted successfully', 'success');
            } catch (error) {
              this.showToast('Error deleting task', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async toggleTaskStatus(task: Task) {
    let newStatus: TaskStatus;
    
    switch (task.status) {
      case TaskStatus.PENDING:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.COMPLETED;
        break;
      case TaskStatus.COMPLETED:
        newStatus = TaskStatus.PENDING;
        break;
      default:
        newStatus = TaskStatus.PENDING;
    }

    try {
      await this.taskService.updateTask(task.id, { status: newStatus });
      this.showToast('Task status updated', 'success');
    } catch (error) {
      this.showToast('Error updating task', 'danger');
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'warning';
      case TaskStatus.IN_PROGRESS:
        return 'primary';
      case TaskStatus.COMPLETED:
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'time-outline';
      case TaskStatus.IN_PROGRESS:
        return 'play-circle-outline';
      case TaskStatus.COMPLETED:
        return 'checkmark-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  private async showOfflineToast() {
    const toast = await this.toastController.create({
      message: 'You are offline. Changes will sync when back online.',
      duration: 3000,
      color: 'warning',
      position: 'top'
    });
    await toast.present();
  }
}

