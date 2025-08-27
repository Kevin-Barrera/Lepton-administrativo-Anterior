import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-plan-modal',
  templateUrl: './edit-plan-modal.component.html',
  styleUrls: ['./edit-plan-modal.component.scss'],
})
export class EditPlanModalComponent implements OnInit {
  isVisible = false; // Control de visibilidad del modal
  editPlanForm!: FormGroup; // Formulario reactivo para manejar los datos del plan

  @Output() planUpdated = new EventEmitter<any>(); // Evento para emitir los datos del plan actualizado

  // Datos del plan actual para editar
  planEditable: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Configuración inicial del formulario
    this.editPlanForm = this.fb.group({
      nombrePlan: ['', Validators.required],
      codigoSAT: ['12345678', Validators.required],
      claveUnidad: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      precioConIVA: ['', [Validators.required, Validators.min(0)]],
      noIdentificacion: ['', Validators.required],
      duracion: ['1', Validators.required],
      servicios: [100, Validators.required],
      color: ['#4CAF50', Validators.required],
    });

    this.onChanges(); // Configuración de los listeners para cambios en el formulario
  }

  /**
   * Abre el modal con los datos del plan a editar.
   * @param plan - Datos del plan a precargar en el formulario.
   */
  open(plan: any): void {
    this.isVisible = true;
    this.planEditable = plan;

    // Precarga los datos del plan en el formulario
    this.editPlanForm.patchValue({
      nombrePlan: plan.nombrePlan,
      codigoSAT: plan.codigoSAT,
      claveUnidad: plan.claveUnidad,
      precio: plan.precio,
      precioConIVA: plan.precioConIVA,
      noIdentificacion: plan.noIdentificacion,
      duracion: plan.duracion,
      servicios: plan.servicios,
      color: plan.color,
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
   * Reinicia el formulario a sus valores iniciales.
   */
  resetForm(): void {
    this.editPlanForm.reset({
      nombrePlan: '',
      codigoSAT: '12345678',
      claveUnidad: '',
      precio: '',
      precioConIVA: '',
      noIdentificacion: '',
      duracion: '1',
      servicios: 100,
      color: '#4CAF50',
    });
    this.planEditable = null;
  }

  /**
   * Configura los listeners para cambios en los precios.
   */
  onChanges(): void {
    let isEditingPrecio = false;
    let isEditingPrecioConIVA = false;
  
    // Escucha cambios en el precio bruto
    this.editPlanForm.get('precio')?.valueChanges.subscribe((precioBruto) => {
      if (!isEditingPrecioConIVA) {
        isEditingPrecio = true;
        const bruto = parseFloat(precioBruto) || 0;
        const neto = parseFloat((bruto * 1.16).toFixed(2)); // Redondea a 2 decimales
        this.editPlanForm.get('precioConIVA')?.setValue(neto, { emitEvent: false });
        isEditingPrecio = false;
      }
    });
  
    // Escucha cambios en el precio neto
    this.editPlanForm.get('precioConIVA')?.valueChanges.subscribe((precioNeto) => {
      if (!isEditingPrecio) {
        isEditingPrecioConIVA = true;
        const neto = parseFloat(precioNeto) || 0;
        const bruto = parseFloat((neto / 1.16).toFixed(2)); // Redondea a 2 decimales
        this.editPlanForm.get('precio')?.setValue(bruto, { emitEvent: false });
        isEditingPrecioConIVA = false;
      }
    });
  }
  
  
  
  

  /**
   * Maneja el envío del formulario, emite los datos actualizados y cierra el modal.
   */
  onSubmit(): void {
    if (this.editPlanForm.valid) {
      const updatedPlan = {
        idPlan: this.planEditable.idPlan, // Incluye el ID del plan
        ...this.editPlanForm.value, // Incluye los datos del formulario
      };

      this.planUpdated.emit(updatedPlan); // Emite el plan actualizado al componente padre
      this.close(); // Cierra el modal
    }
  }
}
