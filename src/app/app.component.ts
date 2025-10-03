import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  async ngOnInit() {
    await this.authService.init();
    await this.taskService.init();
  }
}

