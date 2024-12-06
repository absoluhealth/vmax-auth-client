import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
];
