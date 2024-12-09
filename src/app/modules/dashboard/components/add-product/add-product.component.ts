import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../core/utils/interfaces';
import {DialogModule} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FloatLabelModule} from 'primeng/floatlabel';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, NgIf, InputTextModule, Button, InputTextareaModule, FloatLabelModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() onSave = new EventEmitter<Product>();
  @Output() onClose = new EventEmitter<void>();

  productForm!: FormGroup; // Formulario reactivo

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
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
      this.onSave.emit(this.productForm.value);
      this.onClose.emit();
      this.productForm.reset();
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
