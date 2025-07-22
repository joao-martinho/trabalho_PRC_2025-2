import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { StorageService } from '../commons/storage/storage.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement> | undefined;

  formGroup!: FormGroup;

  userFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}')])
  passFormControl = new FormControl('', [Validators.required, Validators.pattern('[a-z]{5}')])

  hide = signal(true);

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
      this.formGroup = new FormGroup({
        user : this.userFormControl,
        password : this.passFormControl
      })
  }
  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  next() {
    if (this.formGroup.valid) {
      const userId = this.userInput?.nativeElement.value;
      const pass = this.passwordInput?.nativeElement.value;
      if (userId && pass) {
        const info: AuthentificationInfo = {
          userId,
          password: pass
        }
        this.storageService.save(info);
        this.router.navigate(['actions']);
      }
    } else {
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsTouched();
      });
    }
  }
}
