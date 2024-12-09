import {Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../core/utils/interfaces';
import {DialogModule} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FloatLabelModule} from 'primeng/floatlabel';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, NgIf, InputTextModule, Button, InputTextareaModule, FloatLabelModule],
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() onSave = new EventEmitter<Product>();
  @Output() onClose = new EventEmitter<void>();

  @Input() productToEdit: Product | null = null; // Producto a editar
  @Output() onUpdate = new EventEmitter<Product>(); // Evento para actualización

  productForm!: FormGroup; // Formulario reactivo

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Detectar cambios en productToEdit
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit'] && this.productForm) {
      if (this.productToEdit) {
        this.productForm.patchValue(this.productToEdit); // Prellenar valores en el formulario
      } else {
        this.productForm.reset();
      }
    }
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: [1, [Validators.required, Validators.min(1), Validators.max(10000000)]],
      stock: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      image: ['', [Validators.required]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
    });
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productToEdit) {
        // Actualización de producto
        this.onUpdate.emit({ ...this.productToEdit, ...this.productForm.value });
      } else {
        // Creación de producto
        this.onSave.emit(this.productForm.value);
      }
      this.onClose.emit();
      this.productForm.reset();
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
