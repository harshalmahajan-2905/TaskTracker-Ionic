import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePicture(): Promise<string | undefined> {
    try {
      // Check if running on native platform
      if (Capacitor.isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        return image.dataUrl;
      } else {
        // Web fallback - use file input for camera
        return await this.selectImageFromFile('camera');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  }

  async selectFromGallery(): Promise<string | undefined> {
    try {
      // Check if running on native platform
      if (Capacitor.isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos
        });
        return image.dataUrl;
      } else {
        // Web fallback - use file input for gallery
        return await this.selectImageFromFile('gallery');
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // Check if running on native platform
      if (Capacitor.isNativePlatform()) {
        const permissions = await Camera.requestPermissions();
        return permissions.camera === 'granted' && permissions.photos === 'granted';
      } else {
        // Web fallback - permissions are handled by browser
        return true;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  private async selectImageFromFile(source: 'camera' | 'gallery'): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      // For camera, try to use camera if available
      if (source === 'camera') {
        input.capture = 'environment'; // Use back camera if available
      }

      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            resolve(e.target.result);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(file);
        } else {
          resolve(undefined);
        }
      };

      input.oncancel = () => {
        resolve(undefined);
      };

      // Trigger file selection
      input.click();
    });
  }
}

