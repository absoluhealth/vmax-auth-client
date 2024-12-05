import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  _httpClient: HttpClient;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  email: string = '';
  logoutURL: string = '';
  users: any[] = [];

  ngOnInit(): void {
    // Access query parameters
    this.route.queryParams.subscribe((params) => {
      const queryParam = params['uuid']; // Replace 'yourParam' with the name of your query parameter
      console.log('Query parameter value:', queryParam);

      const headers = new HttpHeaders({
        'app-id': '1', // Replace with your token
        'Content-Type': 'application/json',
      });

      this.httpClient
        .get(
          'http://localhost:3000/api/auth/get-token?sessionId=' + queryParam,
          { headers }
        )
        .subscribe((res: any) => {
          let token: string = res['id_token'];
          console.log(token);
          const decodedToken: any = jwtDecode(token);
          console.log('Decoded Token:', decodedToken);
          this.email = decodedToken.email;
          this.logoutURL =
            'http://localhost:3000/api/auth/logout?redirectUrl=http://localhost:4200/welcome&appId=1&sessionId=' +
            queryParam;

          GetUserList(this.httpClient, token).then((res: any) => {
            this.users = res;
            console.log(this.users);
          });
        });
    });
  }
}

function GetUserList(httpClient: HttpClient, token: any): any {
  const headers = new HttpHeaders({
    'app-id': '1', // Replace with your token
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  });
  return httpClient
    .get('http://localhost:3000/api/user', { headers })
    .toPromise();
}
