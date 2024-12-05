import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}

  email: string = '';
  logoutURL: string = '';

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
            'http://localhost:3000/api/auth/logout?redirectUrl=http://localhost:4200/welcome&tenantId=vmax&sessionId=' +
            queryParam;
        });
    });
  }
}
