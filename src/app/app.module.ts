import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PlanesComponent } from './planes/planes.component';
import { DispositivosComponent} from './dispositivos/dispositivos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './header/header.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { provideHttpClient, withFetch } from '@angular/common/http';
import {NgToastModule} from 'ng-angular-popup';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RegisterPlanModalComponent } from './planes/actions/register-plan-modal/register-plan-modal.component';
import { RegisterServiciosModalComponent } from './servicios/actions/register-servicios-modal/register-servicios-modal.component';
import { RegisterDispositivosModalComponent } from './dispositivos/actions/register-dispositivos-modal/register-dispositivos-modal.component';
import { RegisterClientesModalComponent } from './clientes/actions/register-clientes-modal/register-clientes-modal.component';
import { RegisterPedidosModalComponent } from './dashboard/actions/register-pedidos-modal/register-pedidos-modal.component';
import { EditDispositivosModalComponent } from './dispositivos/actions/edit-dispositivos-modal/edit-dispositivos-modal.component';
import { EditServiciosModalComponent } from './servicios/actions/edit-servicios-modal/edit-servicios-modal.component';
import { EditClientesModalComponent } from './clientes/actions/edit-clientes-modal/edit-clientes-modal.component';
import { EditPlanModalComponent } from './planes/actions/edit-plan-modal/edit-plan-modal.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { AsignarPedidosModalComponent } from './dashboard/actions/asignar-pedidos-modal/asignar-pedidos-modal.component';
import { AddDispositivosModalComponent } from './dashboard/actions/asignar-pedidos-modal/add-dispositivos-modal/add-dispositivos-modal.component';
import { TokenInterceptor } from './auth/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ClientesComponent,
    LoginComponent,
    PlanesComponent,
    DispositivosComponent,
    ServiciosComponent,
    HeaderComponent,
    RegisterPlanModalComponent,
    RegisterServiciosModalComponent,
    RegisterDispositivosModalComponent,
    RegisterClientesModalComponent,
    RegisterPedidosModalComponent,

    EditDispositivosModalComponent,
    EditServiciosModalComponent,
    EditClientesModalComponent,
    EditPlanModalComponent,
    PedidosComponent,
    AsignarPedidosModalComponent,
    AddDispositivosModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule,
    FormsModule,
    NgToastModule,  
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatMenuModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
