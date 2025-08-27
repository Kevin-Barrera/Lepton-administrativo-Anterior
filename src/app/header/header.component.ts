import { Component, HostListener, Input, OnInit } from '@angular/core';
import { notifications, userItems } from './header-dummy-data';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  notifications = notifications;
  userItems = userItems;

  isHidden = false; // Para manejar la visibilidad del header
  lastScrollTop = 0; // Almacena la última posición del scroll

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {  
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);    
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      // Deslizar hacia abajo
      this.isHidden = true;
    } else {
      // Deslizar hacia arriba
      this.isHidden = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // Evita valores negativos
  }


  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';  
    } else{
      styleClass = 'head-md-screen';
    }
    return styleClass;
    }

    checkCanShowSearchAsOverlay(innerWidth: number): void {
      if (innerWidth < 845) {
        this.canShowSearchAsOverlay = true;
      } else {
        this.canShowSearchAsOverlay = false;
      }
      console.log('canShowSearchAsOverlay:', this.canShowSearchAsOverlay); // Para verificar el cambio
    }
    handleUserItemClick(label: string): void {
      if (label === 'Cerrar Sesión') {
        this.logout();
      } else {
        console.log(`Opción seleccionada: ${label}`);
      }
    }
    get combinedHeadClass(): any {
      return {
        hidden: this.isHidden,
        show: !this.isHidden,
        [this.getHeadClass()]: true
      };
    }
    
    logout(): void {
      console.log('Cerrando sesión...');
      localStorage.removeItem('token'); // ✅ Elimina el token JWT
      this.authService.setAuthenticationState(false); // 🔄 Actualiza observable
      this.router.navigate(['/login']); // 🔁 Redirige al login
    }
}
