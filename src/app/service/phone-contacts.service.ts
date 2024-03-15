import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhoneContactsService {
  baseUrl: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  getContactsList(): Observable<any> {
    return this.http.get(this.baseUrl + 'contact');
  }

  updateContact(id: number, data: any): Observable<any> {
    return this.http.patch(this.baseUrl + `contact/${id}`, data);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + `contact/${id}`);
  }

  addContact(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'contact', data);
  }

  getContactListFilter({
    nome,
    telefone,
  }: {
    nome: string;
    telefone: string;
  }): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + `contact/filter?nome=${nome}&telefone=${telefone}`
    );
  }
}
