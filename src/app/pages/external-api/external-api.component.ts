import { Component } from '@angular/core';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { concatMap, tap, pluck } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http';

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
  order = { "pizza": true }
  constructor(
    private api: ApiService,
    public auth: AuthService,
    private http: HttpClient,
    private configFactory: AuthClientConfig
  ) {}

  orderPizza() {
    this.auth.user$
      .pipe(
        concatMap((user) =>
          // Use HttpClient to make the call
          this.http.post(
            encodeURI(`https://dev-mp1t49am.us.auth0.com/api/v2/users/${user.sub}`),
            this.order
          )
        )
      )
      .subscribe();
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
