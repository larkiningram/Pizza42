import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/api.service';
import { concatMap, tap, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.css']
})
export class HomeContentComponent implements OnInit {
  faLink = faLink;
  constructor(public auth: AuthService, private api: ApiService, private http: HttpClient) { }

  ngOnInit(): void { }
}
