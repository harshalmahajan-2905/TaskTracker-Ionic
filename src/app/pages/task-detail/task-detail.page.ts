import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {
  task: Task | null = null;
  isLoading = true;
  taskId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      await this.loadTask();
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  private async loadTask() {
    this.isLoading = true;
    
    try {
      this.task = await this.taskService.getTaskById(this.taskId);
      
      if (!this.task) {
        throw new Error('Task not found');
      }
    } catch (error: any) {
      this.showErrorAlert(error.message || 'Failed to load task');
      this.router.navigate(['/tasks']);
    } finally {
      this.isLoading = false;
    }
  }

  editTask() {
    if (this.task) {
      this.router.navigate(['/edit-task', this.task.id]);
    }
  }

  async deleteTask() {
    if (!this.task) return;

    const alert = await this.alertController.create({
      header: 'Delete Task',
      message: `Are you sure you want to delete "${this.task.title}"?`,
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
              await this.taskService.deleteTask(this.task!.id);
              
              const toast = await this.toastController.create({
                message: 'Task deleted successfully',
                duration: 2000,
                color: 'success',
                position: 'bottom'
              });
              await toast.present();
              
              this.router.navigate(['/tasks']);
            } catch (error) {
              this.showErrorAlert('Failed to delete task');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async toggleTaskStatus() {
    if (!this.task) return;

    let newStatus: TaskStatus;
    
    switch (this.task.status) {
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

    const loading = await this.loadingController.create({
      message: 'Updating status...',
      duration: 5000
    });
    await loading.present();

    try {
      await this.taskService.updateTask(this.task.id, { status: newStatus });
      this.task.status = newStatus;
      
      const toast = await this.toastController.create({
        message: 'Task status updated successfully',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      this.showErrorAlert('Failed to update task status');
    } finally {
      await loading.dismiss();
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
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

  getNextStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'Start Task';
      case TaskStatus.IN_PROGRESS:
        return 'Complete Task';
      case TaskStatus.COMPLETED:
        return 'Reset to Pending';
      default:
        return 'Update Status';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOverdue(): boolean {
    if (!this.task) return false;
    const now = new Date();
    const dueDate = new Date(this.task.dueDate);
    return dueDate < now && this.task.status !== TaskStatus.COMPLETED;
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
