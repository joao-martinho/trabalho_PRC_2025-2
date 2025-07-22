import { Component } from '@angular/core';
import { AuthentificationService } from '../commons/authentification/authentification.service';

@Component({
  selector: 'app-actions',
  imports: [],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class Actions {

  constructor(
    private readonly authService: AuthentificationService
  ) {
    this.authService.validate();
  }
}
