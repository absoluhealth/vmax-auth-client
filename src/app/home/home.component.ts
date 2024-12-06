import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  isLoggedIn = false;

  ngOnInit(): void {
    this.checkSession();
    if (!this.isLoggedIn) {
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
            this.logoutURL = '/home';

            this.saveSession(token);
            this.fetchUserList(token);
          });
      });
    }
  }

  checkSession(): void {
    const jwt = localStorage.getItem('jwt');
    const expiry = localStorage.getItem('expiry');

    if (jwt && expiry && new Date().getTime() < +expiry) {
      const decodedToken: any = jwtDecode(jwt);
      this.email = decodedToken.email;

      this.isLoggedIn = true;
      this.fetchUserList(jwt);
    } else {
      this.isLoggedIn = false;
    }
  }

  fetchUserList(token: any): void {
    const headers = new HttpHeaders({
      'app-id': '1', // Replace with your token
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    this._httpClient
      .get('http://localhost:3000/api/user', { headers })
      .subscribe((res: any) => {
        this.users = res;
        console.log(this.users);
      });
  }

  saveSession(token: string): void {
    const expiry = new Date().getTime() + 3600 * 1000; // 1-hour session
    localStorage.setItem('jwt', token);
    localStorage.setItem('expiry', expiry.toString());
    this.isLoggedIn = true;
  }

  clearSession(): void {
    localStorage.clear();
  }

  logout() {
    this.clearSession();
    this.login();
  }

  login() {
    window.location.href =
      'http://localhost:3000/api/auth/login?redirectUrl=http://localhost:4200/home&appId=1';
  }
}
