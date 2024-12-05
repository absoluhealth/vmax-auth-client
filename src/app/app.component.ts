import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'vmax-auth-client';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const uuid = params['uuid'];
      if (uuid) {
        this.router.navigate(['/home'], { queryParams: { uuid: uuid } });
      }
    });
  }

  login() {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'tenant-id': 'vmax',
    });

    this.httpClient
      .get(
        'http://localhost:3000/api/auth/login?redirectUrl=http://localhost:4200&appId=1',
        { headers }
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.error(error);
          if (error.url != null) {
            window.location.href = error.url;
          }
        }
      );
  }

  logout() {}
}
