import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-servicios-modal',
  templateUrl: './edit-servicios-modal.component.html',
  styleUrls: ['./edit-servicios-modal.component.scss'],
})
export class EditServiciosModalComponent implements OnInit {
  isVisible = false;
  servicioForm!: FormGroup;

  @Input() servicioEditable: any = null; // Servicio a editar
  @Output() servicioUpdated = new EventEmitter<any>();

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

  open(servicio: any): void {
    this.isVisible = true;
    this.servicioEditable = servicio;
    this.servicioForm.patchValue({
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      precioConIVA: servicio.precioConIVA,
      codigo: servicio.codigo,
    });
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
    this.servicioEditable = null;
  }

  onChanges(): void {
    let isEditingPrecio = false; // Bandera para evitar bucles en precio
    let isEditingPrecioConIVA = false; // Bandera para evitar bucles en precioConIVA
  
    // Escucha cambios en el precio bruto
    this.servicioForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (!isEditingPrecioConIVA) {
        isEditingPrecio = true; // Activa la bandera para evitar bucle
        const bruto = parseFloat(precioBruto) || 0;
        const neto = parseFloat((bruto * 1.16).toFixed(2)); // Calcula con 2 decimales
        this.servicioForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
        isEditingPrecio = false; // Desactiva la bandera
      }
    });
  
    // Escucha cambios en el precio neto
    this.servicioForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (!isEditingPrecio) {
        isEditingPrecioConIVA = true; // Activa la bandera para evitar bucle
        const neto = parseFloat(precioNeto) || 0;
        const bruto = parseFloat((neto / 1.16).toFixed(2)); // Calcula con 2 decimales
        this.servicioForm.get('precio')?.setValue(bruto, { emitEvent: false });
        isEditingPrecioConIVA = false; // Desactiva la bandera
      }
    });
  }
  
  

  onSubmit(): void {
    if (this.servicioForm.valid) {
      const updatedServicio = {
        ...this.servicioEditable, // Conserva el ID y otros datos del servicio
        ...this.servicioForm.value, // Aplica los cambios del formulario
      };
      this.servicioUpdated.emit(updatedServicio); // Emite el servicio actualizado
      this.close(); // Cierra el modal
    }
  }
  
}
