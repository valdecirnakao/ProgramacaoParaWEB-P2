import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios'; // URL do backend

  constructor(private http: HttpClient) { }

  login(email: string, senha: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  cadastrar(usuario: any) {
    return this.http.post('http://localhost:8080/api/usuarios', usuario);
  }

  recuperarSenha(email: string) {
    return this.http.get<any>(`http://localhost:8080/api/usuarios/email/${email}`);
  }

  buscarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarUsuarioPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

    listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

    atualizar(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

    remover(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: number, usuario: any): Observable<any> {
  return this.http.put<any>(`http://localhost:8080/api/usuarios/${id}`, usuario);
  }
}
