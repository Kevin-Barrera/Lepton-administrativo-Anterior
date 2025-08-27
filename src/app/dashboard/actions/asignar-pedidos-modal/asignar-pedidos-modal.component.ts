import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AddDispositivosModalComponent } from './add-dispositivos-modal/add-dispositivos-modal.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-asignar-pedidos-modal',
  templateUrl: './asignar-pedidos-modal.component.html',
  styleUrls: ['./asignar-pedidos-modal.component.scss'],
})
export class AsignarPedidosModalComponent {
  @ViewChild(AddDispositivosModalComponent) addDispositivosModal!: AddDispositivosModalComponent;
  @Output() closeModal = new EventEmitter<void>();

  isVisible = true;
  isAddDispositivosVisible = false;
  isSaveEnabled = false;

  dispositivosAgregados: any[] = []; // 🆕 Lista para almacenar dispositivos agregados

  // Cerrar el modal principal
  close(): void {
    this.isVisible = false;
    this.closeModal.emit();
  }

  // Abrir modal de Add Dispositivos
  openAddDispositivos(): void {
    console.log('Abriendo modal de Add Dispositivos');
    this.isAddDispositivosVisible = true;
    setTimeout(() => this.addDispositivosModal.open(), 0); // 🔑 clave
  }

  // Cerrar modal de Add Dispositivos
  closeAddDispositivos(): void {
    this.isAddDispositivosVisible = false;
    console.log('Cerrando modal de Add Dispositivos');
  }

  // Seleccionar servicio (puedes implementar la lógica adicional aquí)
  selectService(): void {
    console.log('Servicio seleccionado');
    this.isSaveEnabled = true;
    // Agrega lógica adicional si se requiere
  }

  // Manejar el dispositivo agregado desde el modal de Add Dispositivos
  onDispositivoAdded(dispositivo: any): void {
    console.log('🛠 Recibiendo dispositivo:', dispositivo);
  
    if (!dispositivo || typeof dispositivo !== 'object') {
      console.warn('⚠ Dispositivo inválido recibido.');
      return;
    }
    // ✅ Agregar el dispositivo a la lista de dispositivos agregados
    this.dispositivosAgregados.push({ 
      ...dispositivo,
      resumenPrecio: dispositivo.resumenPrecio || 0,
      resumenPorcentajeDescuento: dispositivo.resumenPorcentajeDescuento || 0,
      resumenDescuento: dispositivo.resumenDescuento || 0,
      resumenPlanPrecio: dispositivo.resumenPlanPrecio || 0,
      resumenPlanPorcentajeDescuento: dispositivo.resumenPlanPorcentajeDescuento || 0,
      resumenPlanDescuento: dispositivo.resumenPlanDescuento || 0,
      resumenSubtotal: dispositivo.resumenSubtotal || 0,
      resumenPlanSubtotal: dispositivo.resumenPlanSubtotal || 0,
      resumenTotal: dispositivo.resumenTotal || 0,
      
  });

    // ✅ Habilitar el botón de guardar
    this.isSaveEnabled = true;
    // ✅ Cerrar el modal de Add Dispositivos
    this.closeAddDispositivos();
  }

  editarDispositivo(dispositivo: any): void {
    console.log('Editar dispositivo:', dispositivo);
    // Aquí puedes abrir un modal para editar los datos
  }
  
  eliminarDispositivo(index: number): void {
    console.log('Eliminar dispositivo en índice:', index);
    this.dispositivosAgregados.splice(index, 1);
  }
  
  onGuardar(): void {
    console.log('Guardando dispositivos:', this.dispositivosAgregados);
    this.close();
  }
}
