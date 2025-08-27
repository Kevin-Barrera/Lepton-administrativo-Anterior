import { Component, AfterViewInit, EventEmitter, OnInit, Output, ViewChild, ElementRef,HostListener,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-add-dispositivos-modal',
  templateUrl: './add-dispositivos-modal.component.html',
  styleUrls: ['./add-dispositivos-modal.component.scss'],
})
export class AddDispositivosModalComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  @Output() dispositivoAdded = new EventEmitter<any>();
  formDispositivo!: FormGroup;
  isVisible = false;
  resumenPrecio: number = 0;
  resumenPorcentajeDescuento: number = 0;
  resumenDescuento: number = 0;
  resumenSubtotal: number = 0;


  // Lista de modelos disponibles
  modelos: any[] = []; // se llenará desde el API

  // Observable para el autocomplete
  filteredModelos$!: Observable<{ nombre: string; precioConIVA: number }[]>;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

ngOnInit(): void {
  // Solo se crea el formulario aquí
  this.formDispositivo = this.fb.group({
    modelo: [null, Validators.required],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    tipoPago: [null, Validators.required],
    tipoDescuento: [null],
    porcentajeDescuento: [null],
    montoDescuento: [null],
    pagoInicial: [null],
    arrendamientoMensual: [null],
    plazoArrendamiento: [null, [Validators.min(1)]]
  });

  this.formDispositivo.get('tipoPago')?.valueChanges.subscribe(tipoPago => {
    const tipoDescuentoControl = this.formDispositivo.get('tipoDescuento');
    const pagoInicial = this.formDispositivo.get('pagoInicial');
    const arrMensual = this.formDispositivo.get('arrendamientoMensual');
    const plazo = this.formDispositivo.get('plazoArrendamiento');

    if (tipoPago === 'Contado' || tipoPago === 'Arrendamiento') {
      tipoDescuentoControl?.setValidators([Validators.required]);
    } else {
      tipoDescuentoControl?.clearValidators();
      tipoDescuentoControl?.setValue(null);
    }

    if (tipoPago === 'Arrendamiento') {
      pagoInicial?.setValidators([Validators.required, Validators.min(0)]);
      arrMensual?.setValidators([Validators.required, Validators.min(0)]);
      plazo?.setValidators([Validators.required, Validators.min(1)]);
      if (plazo) {
        if (!plazo.value || plazo.value < 1) {
          plazo.setValue(1); // ✅ Establecer mínimo automáticamente si es nulo o menor
        }
      }
    } else {
      pagoInicial?.clearValidators(); pagoInicial?.setValue(null);
      arrMensual?.clearValidators(); arrMensual?.setValue(null);
      plazo?.clearValidators(); plazo?.setValue(null);
    }

    tipoDescuentoControl?.updateValueAndValidity();
    pagoInicial?.updateValueAndValidity();
    arrMensual?.updateValueAndValidity();
    plazo?.updateValueAndValidity();
  });
  
  this.formDispositivo.get('tipoDescuento')?.valueChanges.subscribe(tipo => {
    const porcentaje = this.formDispositivo.get('porcentajeDescuento');
    const monto = this.formDispositivo.get('montoDescuento');

    porcentaje?.clearValidators();
    monto?.clearValidators();
    porcentaje?.setValue(null);
    monto?.setValue(null);

    if (tipo === 'Porcentaje') {
      porcentaje?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
    } else if (tipo === 'Monto') {
      monto?.setValidators([Validators.required, Validators.min(0)]);
    }

    porcentaje?.updateValueAndValidity();
    monto?.updateValueAndValidity();
  });

  this.formDispositivo.valueChanges.subscribe(val => {
    const {
      tipoPago,
      modelo,
      cantidad,
      tipoDescuento,
      porcentajeDescuento,
      montoDescuento,
      pagoInicial,
      plazoArrendamiento
    } = val;

    // Calcular arrendamiento mensual
    if (
      tipoPago === 'Arrendamiento' &&
      modelo &&
      modelo.precioConIVA &&
      cantidad > 0 &&
      pagoInicial >= 0 &&
      plazoArrendamiento >= 1
    ) {
      const precioTotal = modelo.precioConIVA * cantidad;
      const restante = precioTotal - pagoInicial;
      const mensual = restante > 0 ? parseFloat((restante / plazoArrendamiento).toFixed(2)) : 0;
      this.formDispositivo.get('arrendamientoMensual')?.setValue(mensual, { emitEvent: false });
    }
    // Calcular resumen de precio, descuento y subtotal
    if (modelo && modelo.precioConIVA && cantidad > 0) {
      this.resumenPrecio = modelo.precioConIVA;

  if (tipoDescuento === 'Porcentaje') {
      this.resumenPorcentajeDescuento = porcentajeDescuento || 0;
      this.resumenDescuento = modelo.precioConIVA * cantidad * (porcentajeDescuento || 0) / 100;
    } else if (tipoDescuento === 'Monto') {
      this.resumenDescuento = montoDescuento || 0;
      const total = modelo.precioConIVA * cantidad;
      this.resumenPorcentajeDescuento = total > 0 ? parseFloat(((this.resumenDescuento / total) * 100).toFixed(2)) : 0;
    } else {
      this.resumenPorcentajeDescuento = 0;
      this.resumenDescuento = 0;
    }

   if (tipoPago === 'Arrendamiento') {
      this.resumenSubtotal = parseFloat((pagoInicial || 0).toFixed(2));
    } else {
      this.resumenSubtotal = parseFloat(((modelo.precioConIVA * cantidad) - this.resumenDescuento).toFixed(2));
    }
  }
  });
}

  // Método para filtrar opciones del autocomplete
  private _filtrarModelos(value: string): { nombre: string; precioConIVA: number }[] {
    const filterValue = value.toLowerCase();
    return this.modelos.filter(m => m.nombre.toLowerCase().includes(filterValue));
  }
  mostrarModelo(modelo: any): string {
  return modelo ? `${modelo.nombre} - ${modelo.precioConIVA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}` : '';
  }

  get mostrarTipoDescuento(): boolean {
    return this.formDispositivo.get('tipoPago')?.value === 'Contado';
  }
  get mostrarCamposArrendamiento(): boolean {
    return this.formDispositivo.get('tipoPago')?.value === 'Arrendamiento';
  }

  // Abrir modal y reiniciar valores
  open(): void {
    this.apiService.getDispositivos().subscribe(response => {
      this.modelos = response.data.filter((d: any) => d.tipoDis === 'GPS');

      this.filteredModelos$ = this.formDispositivo.get('modelo')!.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.nombre || '';
          return this._filtrarModelos(nombre);
        })
      );

      this.formDispositivo.get('modelo')!.valueChanges.subscribe((valor) => {
        if (typeof valor !== 'object') return;

        const cantidadControl = this.formDispositivo.get('cantidad');
        if (!cantidadControl?.value) {
          cantidadControl?.setValue(1);
        }
      });

      // Limpiar y mostrar el modal
      this.formDispositivo.reset({
        modelo: '',
        cantidad: null,
      });

      this.isVisible = true;
      this.cdr.detectChanges();
    });
  }
  // Cerrar modal
  close(): void {
  this.isVisible = false;
  this.formDispositivo.reset();
  }

  guardarDispositivo(): void {
    if (this.formDispositivo.invalid) return;

    const {
      modelo, cantidad, tipoPago, tipoDescuento, porcentajeDescuento, montoDescuento,
      pagoInicial, arrendamientoMensual, plazoArrendamiento
    } = this.formDispositivo.value;

    const resumenPrecio = modelo.precioConIVA;
    // Calcular descuento
    let resumenDescuento = 0;
    if (tipoDescuento === 'Porcentaje') {
      resumenDescuento = modelo.precioConIVA * (porcentajeDescuento / 100);
    } else if (tipoDescuento === 'Monto') {
      resumenDescuento = montoDescuento;
    }
    const resumenSubtotal = (resumenPrecio * cantidad) - resumenDescuento;
    const resumenTotal = resumenSubtotal;

    const dispositivo = {
      modelo,
      cantidad,
      tipoPago,
      tipoDescuento,
      porcentajeDescuento,
      montoDescuento,
      pagoInicial,
      arrendamientoMensual,
      plazoArrendamiento,
      resumenPrecio,
      resumenDescuento,
      resumenSubtotal,
      resumenTotal,
    };

    this.dispositivoAdded.emit(dispositivo);  // 🔁 Emitir al padre
    this.close();  // Cerrar modal
  }

  handleModalClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  // Si el clic NO fue en el input ni en el panel del autocomplete
  const clickedInsideInput = target.closest('mat-form-field');
  const isAutocompletePanel = target.classList.contains('mat-option') || 
                              target.closest('.mat-autocomplete-panel');

  if (!clickedInsideInput && !isAutocompletePanel && this.autocompleteTrigger?.panelOpen) {
    this.autocompleteTrigger.closePanel();
  }
}

}