import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../../auth_config.json';
import { AuthService } from '@auth0/auth0-angular';
import {concatMap, first} from 'rxjs/operators';
import { environment as env } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  verified;
  data = {};
  hasApiError = false;
  ping$(): Observable<any> {
    console.log(config.apiUri);
    return this.http.get(`${config.apiUri}/api/external`);
  }

  getUserData$(): Observable<any> {
    return this.auth.user$
      .pipe(
        concatMap((user) =>
          // Use HttpClient to make the call
          this.http.get(
            encodeURI(`${env.auth.audience}users/${user.sub}`),
          )
        )
      )
  }

  order$(order: any, meta: any): Observable<any> {
    this.auth.getAccessTokenSilently().subscribe(res => {
      const headers = {
        'authorization': `Bearer ${res}`,
        'content-type': 'application/json'
      }
      let history = meta.orders;
      history.push(order);
      const add = { "user_metadata": {
          "orders": history
        }
      };
      const options = {
        headers: headers,
        options: add
      };
      this.auth.user$.pipe(first()).subscribe(user => {
        this.http.patch(
          encodeURI(`${env.auth.audience}users/${user.sub}`),
          JSON.stringify(add),
          options
        ).subscribe({
            next: () => {
              this.hasApiError = false;
              alert('You have successfully ordered a pizza!');
            },
            error: () => {
              this.hasApiError = true
              alert('Something has gone wrong! Reach out to an Auth0 rep for help.');
            },
        });
      });
    });
    return this.getUserData$();
  }

}
