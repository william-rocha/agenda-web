import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { PhoneContactsService } from '../../service/phone-contacts.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
  ],
})
export class ModalComponent {
  form: FormGroup;

  constructor(
    private phoneContactsService: PhoneContactsService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      idade: [null, [Validators.required, Validators.maxLength(3)]],
      numero: [
        [],
        this.fb.array([
          this.fb.group({
            numero: ['', Validators.required],
          }),
        ]),
      ],
      novoNumero: [''],
    });
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      if (this.data) {
        this.updateContact();
      } else {
        this.saveContact();
      }
    }
  }

  adicionarNumero(event: Event): void {
    event.preventDefault();
    const novoNumero = this.form.get('novoNumero')?.value;
    if (novoNumero && !this.form.get('numero')?.value.includes(novoNumero)) {
      const numerosAtualizados = [
        ...this.form.get('numero')?.value,
        { numero: novoNumero },
      ];
      this.form.get('numero')?.patchValue(numerosAtualizados);
      this.form.get('novoNumero')?.reset();
    }
  }

  updateContact() {
    this.phoneContactsService
      .updateContact(this.data.id, this.form.value)
      .subscribe({
        next: (val: any) => {
          alert('Detalhes do contato foram atualizados!');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro durante atualização do Contato!');
        },
      });
  }

  saveContact() {
    this.phoneContactsService.addContact(this.form.value).subscribe({
      next: (val: any) => {
        alert('Novo Contato salvo com sucesso!');
        this.form.reset();
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao salvar Contato!');
      },
    });
  }

  uppercaseInput(event: Event, campo: string): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.toUpperCase();
    this.form.patchValue({ [campo]: inputValue });
  }
}
