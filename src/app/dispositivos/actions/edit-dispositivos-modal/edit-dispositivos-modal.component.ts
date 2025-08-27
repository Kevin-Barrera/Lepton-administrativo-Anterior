import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-dispositivos-modal',
  templateUrl: './edit-dispositivos-modal.component.html',
  styleUrls: ['./edit-dispositivos-modal.component.scss'],
})
export class EditDispositivosModalComponent implements OnInit {
  isVisible = false; // Control de visibilidad del modal
  dispositivoForm!: FormGroup; // Formulario reactivo para manejar los datos del dispositivo

  @Input() dispositivoEditable: any = null; // Dispositivo a editar
  @Output() dispositivoUpdated = new EventEmitter<any>(); // Evento para enviar los datos actualizados al componente principal

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Configuración inicial del formulario
    this.dispositivoForm = this.fb.group({
      nombre: ['', Validators.required], // Nombre del dispositivo
      codigoDis: ['', Validators.required], // Código del dispositivo
      precio: ['', [Validators.required, Validators.min(0)]], // Precio bruto
      precioConIVA: ['', [Validators.required, Validators.min(0)]], // Precio neto
      tipoDis: ['GPS', Validators.required], // Tipo de dispositivo
      marca: ['', Validators.required], // Marca del dispositivo
      modelo: ['', Validators.required], // Modelo del dispositivo
      tipoImp: ['IVA', Validators.required], // Tipo de impuesto
      codigoSat: ['12345678', Validators.required], // Código SAT
      unidad: ['Pieza', Validators.required], // Unidad
      claveUnidad: ['H87', Validators.required], // Clave de unidad
    });

    this.onChanges(); // Escuchar cambios en los campos del formulario
  }

  /**
   * Abre el modal con los datos del dispositivo a editar.
   * @param dispositivo - Los datos del dispositivo a precargar en el formulario.
   */
  open(dispositivo: any): void {
    this.isVisible = true;
    this.dispositivoEditable = dispositivo;

    // Precarga los datos del dispositivo en el formulario
    this.dispositivoForm.patchValue({
      nombre: dispositivo.nombre,
      codigoDis: dispositivo.codigoDis,
      precio: dispositivo.precio,
      precioConIVA: dispositivo.precioConIVA,
      tipoDis: dispositivo.tipoDis,
      marca: dispositivo.marca,
      modelo: dispositivo.modelo,
      tipoImp: dispositivo.tipoImp,
      codigoSat: dispositivo.codigoSat,
      unidad: dispositivo.unidad,
      claveUnidad: dispositivo.claveUnidad,
    });
  }

  /**
   * Cierra el modal y reinicia el formulario.
   */
  close(): void {
    this.isVisible = false;
    this.resetForm();
  }

  /**
   * Reinicia el formulario a sus valores predeterminados.
   */
  resetForm(): void {
    this.dispositivoForm.reset({
      nombre: '',
      codigoDis: '',
      precio: '',
      precioConIVA: '',
      tipoDis: 'GPS',
      marca: '',
      modelo: '',
      tipoImp: 'IVA',
      codigoSat: '12345678',
      unidad: 'Pieza',
      claveUnidad: 'H87',
    });
    this.dispositivoEditable = null;
  }

  /**
   * Configura los listeners para mantener sincronizados los precios bruto y neto.
   */
  onChanges(): void {
    let isUpdatingPrecio = false; // Bandera para evitar bucles en precio
    let isUpdatingPrecioConIVA = false; // Bandera para evitar bucles en precioConIVA
  
    // Escuchar cambios en el precio bruto
    this.dispositivoForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (!isUpdatingPrecioConIVA) {
        isUpdatingPrecio = true; // Activar bandera
        const bruto = parseFloat(precioBruto) || 0;
        const neto = parseFloat((bruto * 1.16).toFixed(2)); // Redondear a 2 decimales
        this.dispositivoForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
        isUpdatingPrecio = false; // Desactivar bandera
      }
    });
  
    // Escuchar cambios en el precio neto
    this.dispositivoForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (!isUpdatingPrecio) {
        isUpdatingPrecioConIVA = true; // Activar bandera
        const neto = parseFloat(precioNeto) || 0;
        const bruto = parseFloat((neto / 1.16).toFixed(2)); // Redondear a 2 decimales
        this.dispositivoForm.get('precio')?.setValue(bruto, { emitEvent: false });
        isUpdatingPrecioConIVA = false; // Desactivar bandera
      }
    });
  }
  

  /**
   * Envía los datos actualizados del dispositivo al componente principal.
   */
  onSubmit(): void {
    if (this.dispositivoForm.valid) {
      const updatedDispositivo = {
        idDis: this.dispositivoEditable.idDis, // Incluye el ID del dispositivo
        ...this.dispositivoForm.value, // Incluye los datos del formulario
      };
  
      this.dispositivoUpdated.emit(updatedDispositivo); // Emite el dispositivo actualizado
      this.close(); // Cierra el modal
    }
  }
  
}
