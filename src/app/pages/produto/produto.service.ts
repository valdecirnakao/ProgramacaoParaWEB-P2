import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criar(produto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

  remover(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
