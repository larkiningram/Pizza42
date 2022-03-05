import { Component } from '@angular/core';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { concatMap, tap, pluck, first } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import AuthService from the Auth0 Angular SDK to get access to the user
import { AuthService } from '@auth0/auth0-angular';

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
  metadata = {};
  order = { "pizzaType": "cheese" }
  constructor(
    private api: ApiService,
    public auth: AuthService,
    private http: HttpClient,
    private configFactory: AuthClientConfig
  ) {}

  ngOnInit() {
    this.auth.user$
      .pipe(
        concatMap((user) =>
          // Use HttpClient to make the call
          this.http.get(
            encodeURI(`https://dev-mp1t49am.us.auth0.com/api/v2/users/${user.sub}`)
          )
        ),
        pluck('user_metadata'),
        tap((meta) => (this.metadata = meta))
      )
      .subscribe();
  }

  getUserData() {
    this.api.getUserData$().pipe(first()).subscribe({
      next: (res) => {
        this.hasApiError = false;
        if (res['email_verified'] === false) {
          alert('Please verify your email before you order!');
        }
      },
      error: () => this.hasApiError = true,
    });
  }

  orderPizza() {
    const formData =
    this.getUserData();
    this.api.order$(this.metadata).subscribe({
      next: (res) => {
        this.hasApiError = false;
        this.responseJson = JSON.stringify(res, null, 2).trim();
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
}
