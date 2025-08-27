import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-plan-modal',
  templateUrl: './register-plan-modal.component.html',
  styleUrls: ['./register-plan-modal.component.scss'],
})
export class RegisterPlanModalComponent implements OnInit {
  isVisible = false;
  planForm!: FormGroup;

  @Output() planRegistered = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.planForm = this.fb.group({
      nombrePlan: ['', Validators.required],
      codigoSAT: ['12345678', Validators.required],
      claveUnidad: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      precioConIVA: ['', [Validators.required, Validators.min(0)]],
      noIdentificacion: ['', Validators.required],
      duracion: ['1 mes', Validators.required],
      servicios: [100, Validators.required],
      color: ['#4CAF50', Validators.required],
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
    this.planForm.reset({
      nombrePlan: '',
      codigoSAT: '12345678',
      claveUnidad: '',
      precio: '',
      precioConIVA: '',
      noIdentificacion: '',
      duracion: '1 mes',
      servicios: 100,
      color: '#4CAF50',
    });
  }

  onChanges(): void {
    // Escuchar cambios en el precio bruto
    this.planForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (precioBruto === '' || precioBruto === null) {
        // Si el campo está vacío, vaciar el precio neto
        this.planForm.get('precioConIVA')?.setValue('', { emitEvent: false });
      } else {
        const bruto = parseFloat(precioBruto) || 0;
        const neto = (bruto * 1.16).toFixed(2);
        this.planForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
      }
    });

    // Escuchar cambios en el precio neto
    this.planForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (precioNeto === '' || precioNeto === null) {
        // Si el campo está vacío, vaciar el precio bruto
        this.planForm.get('precio')?.setValue('', { emitEvent: false });
      } else {
        const neto = parseFloat(precioNeto) || 0;
        const bruto = (neto / 1.16).toFixed(2);
        this.planForm.get('precio')?.setValue(bruto, { emitEvent: false });
      }
    });
  }


  onSubmit(): void {
    if (this.planForm.valid) {
      this.planRegistered.emit(this.planForm.value);
      this.close();
    }
  }
}
