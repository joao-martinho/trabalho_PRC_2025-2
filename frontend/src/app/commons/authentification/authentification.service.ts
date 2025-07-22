import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  
  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService
  ) {}

  validate() {
    if (!this.storageService.get()) {
      this.router.navigate(['']);
    }
  }
}
