import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime } from 'rxjs';
import { ModalComponent } from '../../components/modal/modal.component';
import { MaterialModule } from '../../material.module';
import { PhoneContactsService } from '../../service/phone-contacts.service';

type Filter = {
  nome: string;
  telefone: string;
};

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  imports: [MaterialModule, FormsModule, CommonModule, HttpClientModule],
})
export class ListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true;

  filter: Filter = {
    nome: '',
    telefone: '',
  };

  displayedColumns: string[] = ['id', 'name', 'age', 'phone', 'action'];

  dataSource!: MatTableDataSource<any>;

  private getContactListFilterSubject = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private phoneContactsService: PhoneContactsService
  ) {}

  ngOnInit(): void {
    this.getContactList();

    this.getContactListFilterSubject
      .pipe(debounceTime(1200)) // debounce gera intervalo para evitar de bater na api a cada clique no filter
      .subscribe((filter: any) => {
        this.getContactFilterList(filter);
      });
  }

  async getContactList() {
    this.isLoading = true;
    this.phoneContactsService.getContactsList().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        alert(`Ouve um erro ao carregar a lista de Contatos.`);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  async getContactFilterList({ nome = '', telefone = '' }) {
    this.isLoading = true;
    this.phoneContactsService
      .getContactListFilter({ nome, telefone })
      .subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          alert(`Ouve um erro ao carregar a lista de Contatos.`);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  deletePhoneContact(id: any) {
    this.phoneContactsService.deleteContact(id).subscribe({
      next: (res) => {
        alert('Registro de Contato deletado com sucesso!');
        this.getContactList();
      },
      error: (err) => {
        alert('Ocorreu um erro ao deletar Registro de Contato.');
      },
    });
  }

  openEditModal(contact: any) {
    const editedContact = contact;
    this.openModal(editedContact);
  }

  applyFilter($event: KeyboardEvent, type: 'nome' | 'telefone') {
    this.isLoading = true;

    if ($event.target) {
      this.filter[type] = (
        $event.target as HTMLInputElement
      ).value.toUpperCase();

      this.getContactListFilterSubject.next(this.filter);
    }
  }

  openModal(data = null) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getContactList();
        }
      },
    });
  }
}
