import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-dispositivos-modal',
  templateUrl: './register-dispositivos-modal.component.html',
  styleUrls: ['./register-dispositivos-modal.component.scss'],
})
export class RegisterDispositivosModalComponent implements OnInit {
  isVisible = false;
  dispositivoForm!: FormGroup;

  @Output() dispositivoRegistered = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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

    this.onChanges();
  }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
    this.resetForm();
  }

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
  }

  onChanges(): void {
    // Escuchar cambios en el precio bruto
    this.dispositivoForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (precioBruto === '' || precioBruto === null) {
        // Si el campo está vacío, vaciar el precio neto
        this.dispositivoForm.get('precioConIVA')?.setValue('', { emitEvent: false });
      } else {
        const bruto = parseFloat(precioBruto) || 0;
        const neto = (bruto * 1.16).toFixed(2);
        this.dispositivoForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
      }
    });

    // Escuchar cambios en el precio neto
    this.dispositivoForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (precioNeto === '' || precioNeto === null) {
        // Si el campo está vacío, vaciar el precio bruto
        this.dispositivoForm.get('precio')?.setValue('', { emitEvent: false });
      } else {
        const neto = parseFloat(precioNeto) || 0;
        const bruto = (neto / 1.16).toFixed(2);
        this.dispositivoForm.get('precio')?.setValue(bruto, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.dispositivoForm.valid) {
      const dispositivoFinal = this.dispositivoForm.value;
      console.log("Emitido dispositivo:", dispositivoFinal); // Depuración
      this.dispositivoRegistered.emit(dispositivoFinal);
      this.close();
    } else {
      console.log("Formulario inválido");
    }
  }
  
  
}
