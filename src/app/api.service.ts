import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import config from '../../auth_config.json';
import { AuthService } from '@auth0/auth0-angular';
import { concatMap, tap, pluck } from 'rxjs/operators';
import { environment as env } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  verified;
  data = {};
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
      console.log('history', history);
      const options = {
        headers: headers,
        options: add
      };
      this.auth.user$.subscribe(user => {
        this.http.patch(
          encodeURI(`${env.auth.audience}users/${user.sub}`),
          JSON.stringify(add),
          options
        ).subscribe(res => console.log('res', res));
      });
    });
    return this.getUserData$();
  }

}
