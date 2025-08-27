import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sistema-administrativo-Lepton';

  isSideNavCollapsed = false;
  screenWidth = 0;
  isAuthenticated = false; // Estado de autenticación, inicialmente false
  isLoginRoute = false;
  constructor(private authService: AuthService, private router: Router,private toast: NgToastService) {}

  ngOnInit(): void {
    // ✅ Verificar si hay token guardado
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.setAuthenticationState(true);
    }

    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Verificar la ruta actual
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
    });

  }
  onToggLeSidenav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
