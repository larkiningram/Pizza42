import { Component } from '@angular/core';
import { AuthClientConfig } from '@auth0/auth0-angular';
import {first} from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '@auth0/auth0-angular';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MetadataModel} from "../../types/metadata.model";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css'],
})
export class ExternalApiComponent {
  responseJson: string;
  audience = this.configFactory.get()?.audience;
  hasApiError = false;
  metadata: MetadataModel = {orders: []};
  orders = { 'orders': [] };
  form: FormGroup;
  submitted = false;
  isEmailVerified = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private http: HttpClient,
    private configFactory: AuthClientConfig,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
          size: ['', Validators.required],
          quantity: ['', [Validators.required, Validators.pattern(/^[0-9]+/)]]
        }
    );
    this.getUserData();
    this.checkIfEmailVerified();
  }

  getUserData() {
    this.api.getUserData$().pipe(first()).subscribe({
      next: (res) => {
        this.hasApiError = false;
        this.metadata = {orders: []};
        if (res.user_metadata.hasOwnProperty('orders')) {
          this.metadata.orders = res.user_metadata['orders'];
        }
        console.log(this.metadata);
        console.log(res);
      },
      error: () => this.hasApiError = true,
    });
  }

  checkIfEmailVerified(): Observable<boolean> {
    this.api.getUserData$().pipe(first()).subscribe({
      next: (res) => {
        console.log(res);
        this.hasApiError = false;
        this.isEmailVerified = res['email_verified'] !== false;
      },
      error: () => this.hasApiError = true,
    });
    return of(this.isEmailVerified);
  }

  // pingApi() {
  //   this.api.ping$().subscribe({
  //     next: (res) => {
  //       this.hasApiError = false;
  //       this.responseJson = JSON.stringify(res, null, 2).trim();
  //     },
  //     error: () => this.hasApiError = true,
  //   });
  // }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  order() {
    if (!!this.isEmailVerified) {
      this.orders = this.form.value;
      this.orders['order_time'] = new Date();
      this.api.order$(this.form.value, this.metadata).pipe(first()).subscribe({
        next: (res) => {
          this.hasApiError = false;
          this.responseJson = JSON.stringify(res, null, 2).trim();
          this.onReset();
        },
        error: () => this.hasApiError = true,
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.isEmailVerified);
    if (this.form.invalid) {
      return;
    }
    if (this.isEmailVerified !== true) {
      alert('Please verify your email address before you order');
    } else {
      this.order();
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
