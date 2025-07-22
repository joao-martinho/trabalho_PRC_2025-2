import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../commons/storage/storage.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  private readonly HOST = 'http://localhost:3000'
 
  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  getUsers(): Observable<UserInfo[]> {
    const info = this.storageService.get();
    return this.http.post<any>(this.HOST + '/get-users', { user: info?.userId, password: info?.password }).pipe(map(u => u.users));
  }

  getMessage(): Observable<MessageInfo> {
    const info = this.storageService.get();
    return this.http.post<any>(this.HOST + '/get-message', { user: info?.userId, password: info?.password });
  }

  sendMessage(input: { to: string, message: string }) {
    const info = this.storageService.get();
    this.http.post<any>(this.HOST + '/send-message', { user: info?.userId, password: info?.password, to: input.to, msg: input.message }).subscribe();
  }

  getPlayers(): Observable<PlayerInfo[]> {
    const info = this.storageService.get();
    return this.http.post<any>(this.HOST + '/get-players', { user: info?.userId, password: info?.password }).pipe(map(u => u.players));
  }

  getCards(): Observable<CardInfo[]> {
    const info = this.storageService.get();
    return this.http.post<any>(this.HOST + '/get-card', { user: info?.userId, password: info?.password }).pipe(map(c => c.cards));
  }

  sendGame(value: string): void {
    const info = this.storageService.get();
    this.http.post<any>(this.HOST + '/send-game', { user: info?.userId, password: info?.password, msg: value }).subscribe();
  }
}
