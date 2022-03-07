import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import config from '../../auth_config.json';
import {AuthService} from '@auth0/auth0-angular';
import {concatMap, first, mergeMap} from 'rxjs/operators';
import {environment as env} from '../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient, private auth: AuthService) {
    }

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

    getToken$(user: any, add: any): Observable<any> {
        this.auth.getAccessTokenSilently().pipe(
            mergeMap(token => this.patchOrder$(user, add, token)),
        ).subscribe();
        return of();
    }

    patchOrder$(user: any, add: any, token: any) {
        const headers = {
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
        const options = {
            headers: headers,
            options: add
        };
        this.http.patch(
            encodeURI(`${env.auth.audience}users/${user.sub}`),
            JSON.stringify(options.options),
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
        return of();
    }

    order$(order: any, meta: any): Observable<any> {
        console.log('in order$')
        let history = meta.orders;
        history.push(order);
        const add = {
            "user_metadata": {
                "orders": history
            }
        };
        this.auth.user$.pipe(
            first(),
            mergeMap(user => this.getToken$(user, add)),
        ).subscribe(res => console.log(res));
        return of();
    }
}
