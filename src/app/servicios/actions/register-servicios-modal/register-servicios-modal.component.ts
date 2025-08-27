import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-servicios-modal',
  templateUrl: './register-servicios-modal.component.html',
  styleUrls: ['./register-servicios-modal.component.scss'],
})
export class RegisterServiciosModalComponent implements OnInit {
  isVisible = false;
  servicioForm!: FormGroup;

  @Output() servicioRegistered = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.servicioForm = this.fb.group({
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]], // Precio Bruto
      precioConIVA: ['', [Validators.required, Validators.min(0)]], // Precio Neto
      codigo: ['12345678', Validators.required], // Código SAT
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
    this.servicioForm.reset({
      descripcion: '',
      precio: '',
      precioConIVA: '',
      codigo: '12345678',
    });
  }

  onChanges(): void {
    // Escuchar cambios en el precio bruto
    this.servicioForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (precioBruto === '' || precioBruto === null) {
        // Si el campo está vacío, vaciar el precio neto
        this.servicioForm.get('precioConIVA')?.setValue('', { emitEvent: false });
      } else {
        const bruto = parseFloat(precioBruto) || 0;
        const neto = (bruto * 1.16).toFixed(2);
        this.servicioForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
      }
    });
  
    // Escuchar cambios en el precio neto
    this.servicioForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (precioNeto === '' || precioNeto === null) {
        // Si el campo está vacío, vaciar el precio bruto
        this.servicioForm.get('precio')?.setValue('', { emitEvent: false });
      } else {
        const neto = parseFloat(precioNeto) || 0;
        const bruto = (neto / 1.16).toFixed(2);
        this.servicioForm.get('precio')?.setValue(bruto, { emitEvent: false });
      }
    });
  }
  
  

  onSubmit(): void {
    if (this.servicioForm.valid) {
      this.servicioRegistered.emit(this.servicioForm.value);
      this.close();
    }
  }
}
