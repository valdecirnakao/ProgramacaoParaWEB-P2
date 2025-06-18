import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) {}

  criar(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  buscar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
