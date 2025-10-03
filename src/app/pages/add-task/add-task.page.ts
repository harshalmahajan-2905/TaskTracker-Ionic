import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { CameraService } from '../../services/camera.service';
import { TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  taskForm: FormGroup;
  isLoading = false;
  selectedImage: string | undefined;
  TaskStatus = TaskStatus;
  minDate = new Date().toISOString();

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private cameraService: CameraService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: [this.getDefaultDueDate(), [Validators.required]],
      status: [TaskStatus.PENDING, [Validators.required]]
    });
  }

  ngOnInit() {}

  private getDefaultDueDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Creating task...',
        duration: 10000
      });
      await loading.present();

      try {
        const taskData = {
          ...this.taskForm.value,
          image: this.selectedImage
        };

        await this.taskService.createTask(taskData);
        await loading.dismiss();
        
        const toast = await this.toastController.create({
          message: 'Task created successfully!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();

        this.router.navigate(['/tasks']);
      } catch (error: any) {
        await loading.dismiss();
        this.showErrorAlert(error.message || 'Failed to create task');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
      const toast = await this.toastController.create({
        message: 'Please fill in all required fields',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Remove Image',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.selectedImage = undefined;
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async takePicture() {
    try {
      const hasPermission = await this.cameraService.requestPermissions();
      if (!hasPermission) {
        this.showErrorAlert('Camera permissions are required to take photos');
        return;
      }

      const image = await this.cameraService.takePicture();
      if (image) {
        this.selectedImage = image;
        const toast = await this.toastController.create({
          message: 'Photo captured successfully!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      this.showErrorAlert('Failed to capture photo');
    }
  }

  private async selectFromGallery() {
    try {
      const hasPermission = await this.cameraService.requestPermissions();
      if (!hasPermission) {
        this.showErrorAlert('Photo permissions are required to select images');
        return;
      }

      const image = await this.cameraService.selectFromGallery();
      if (image) {
        this.selectedImage = image;
        const toast = await this.toastController.create({
          message: 'Image selected successfully!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      this.showErrorAlert('Failed to select image');
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

  private markFormGroupTouched() {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get dueDate() { return this.taskForm.get('dueDate'); }
  get status() { return this.taskForm.get('status'); }
}
