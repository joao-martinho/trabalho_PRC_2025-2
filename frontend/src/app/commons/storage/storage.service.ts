import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly INFO_NAME = 'auth-info';

  constructor() {}

  save(info: AuthentificationInfo) {
    localStorage.setItem(this.INFO_NAME, JSON.stringify(info));
  }

  get(): AuthentificationInfo | undefined {
    const item = localStorage.getItem(this.INFO_NAME);
    return item ? JSON.parse(item) : undefined;
  }
}
