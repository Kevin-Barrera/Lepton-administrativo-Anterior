import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PlanesComponent } from './planes/planes.component';
import { DispositivosComponent } from './dispositivos/dispositivos.component';
import { PedidosComponent } from './pedidos/pedidos.component';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'servicios', component: ServiciosComponent},
  {path: 'planes', component: PlanesComponent},
  {path: 'dispositivos', component: DispositivosComponent},
  {path: 'pedidos', component: PedidosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
