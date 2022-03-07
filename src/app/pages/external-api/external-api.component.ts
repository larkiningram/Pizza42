import { Component } from '@angular/core';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { concatMap, tap, pluck, first } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import AuthService from the Auth0 Angular SDK to get access to the user
import { AuthService } from '@auth0/auth0-angular';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MetadataModel} from "../../types/metadata.model";
import {UserMetadataComponent} from "../../components/user-metadata/user-metadata.component";

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css'],
})
export class ExternalApiComponent {
  responseJson: string;
  audience = this.configFactory.get()?.audience;
  hasApiError = false;
  token = '';
  metadata: MetadataModel = {orders: []};
  orders = { 'orders': [] };
  showForm = true;
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
  }

  getUserData() {
    this.api.getUserData$().pipe(first()).subscribe({
      next: (res) => {
        this.hasApiError = false;
        this.metadata = {orders: []};
        if (res.user_metadata.hasOwnProperty('orders')) {
          this.metadata.orders = res.user_metadata['orders'];
        }
        if (res['email_verified'] === false) {
          this.isEmailVerified = false;
          alert('Please verify your email address before you order');
        }
        this.isEmailVerified = true;
      },
      error: () => this.hasApiError = true,
    });
  }

  pingApi() {
    this.api.ping$().subscribe({
      next: (res) => {
        this.hasApiError = false;
        this.responseJson = JSON.stringify(res, null, 2).trim();
      },
      error: () => this.hasApiError = true,
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.getUserData();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (!!this.isEmailVerified) {
      this.orders = this.form.value;
      this.orders['order_time'] = new Date();
      this.api.order$(this.form.value, this.metadata).pipe(first()).subscribe({
        next: (res) => {
          this.responseJson = JSON.stringify(res, null, 2).trim();
        },
        error: () => this.hasApiError = true,
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
