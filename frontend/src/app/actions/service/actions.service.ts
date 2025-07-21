import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../commons/storage/storage.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  private readonly HOST = 'http://localhost:3000'
 
  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  // ON DOING
  getUsers(): UsersInfo {
    const info = this.storageService.get();
    //return this.http.post(this.HOST + '/get-users', { user: info?.userId, password: info?.password }).pipe()
  }
}
