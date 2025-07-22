import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from '../commons/authentification/authentification.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActionsService } from './service/actions.service';
import { CommonModule } from '@angular/common';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface Types {
  value: string,
  viewValue: string
}

@Component({
  selector: 'app-actions',
  imports: [
    FormsModule,
    MatTabsModule,
    MatRippleModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class Actions implements OnInit, OnDestroy {

  @ViewChild('userToSendInput') userToSendInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  displayedUsersColumns: string[] = ['id', 'name', 'victories'];
  usersInfo: UserInfo[] = [];

  displayedMessageColumn: string[] = ['id', 'message'];
  messageInfo: MessageInfo[] = [];

  displayedPlayersColumns: string[] = ['id', 'name', 'state'];
  playersInfo: PlayerInfo[] = [];

  displayedCardColumn: string[] = ['card', 'suit'];
  cardInfo: CardInfo[] = [];

  selectedType: string = 'ENTER';

  sendMessageFormGroup!: FormGroup;

  types: Types[] = [
    { value: 'ENTER', viewValue: 'ENTER' },
    { value: 'STOP', viewValue: 'STOP' },
    { value: 'QUIT', viewValue: 'QUIT' }
  ]

  userToSendMessageControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}|[0]')]);
  messageControl = new FormControl('', [Validators.required]);

  private pollingSub!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthentificationService,
    private readonly actionsService: ActionsService
  ) {
    this.authService.validate();
  }

  ngOnInit(): void {
    this.pollingSub = interval(6000).subscribe(() => {
      this.actionsService.getUsers().subscribe();
    });

    this.sendMessageFormGroup = new FormGroup({
      to: this.userToSendMessageControl,
      message: this.messageControl
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers(): void {
    this.actionsService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => this.usersInfo = d);
  }

  getMessage(): void {
    this.actionsService.getMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(m => this.messageInfo = [m]);
  }

  sendMessage(): void {
    if (this.sendMessageFormGroup.valid) {
      this.actionsService.sendMessage({ to: this.userToSendInput?.nativeElement.value, message: this.messageInput?.nativeElement.value });
    } else {
      this.sendMessageFormGroup.markAllAsTouched();
      // Object.keys(this.sendMessageFormGroup.controls).forEach(key => {
      //   this.sendMessageFormGroup.get(key)?.markAsTouched();
      // });
    }
  }

  getPlayers(): void {
    this.actionsService.getPlayers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => this.playersInfo =  p)
  }

  getCard(): void {
    this.actionsService.getCards()
      .pipe(takeUntil(this.destroy$))
      .subscribe(c => this.cardInfo = c);
  }

  sendGame(): void {
    this.actionsService.sendGame(this.selectedType);
  }
}
