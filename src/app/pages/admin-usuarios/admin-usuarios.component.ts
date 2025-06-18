import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuario: any = this.novoUsuario();

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (res) => (this.usuarios = res),
      error: () => alert('Erro ao buscar usuários'),
    });
  }

  salvar() {
    if (this.usuario.id) {
      this.usuarioService.atualizar(this.usuario.id, this.usuario).subscribe({
        next: () => {
          alert('Usuário atualizado!');
          this.listarUsuarios();
          this.limpar();
        },
        error: () => alert('Erro ao atualizar usuário.'),
      });
    } else {
      this.usuarioService.cadastrar(this.usuario).subscribe({
        next: () => {
          alert('Usuário cadastrado!');
          this.listarUsuarios();
          this.limpar();
        },
        error: () => alert('Erro ao cadastrar usuário.'),
      });
    }
  }

  editar(p: any) {
    this.usuario = { ...p };
  }

  remover(id: number) {
    if (confirm('Deseja realmente excluir este usuário?')) {
      this.usuarioService.remover(id).subscribe({
        next: () => {
          alert('Usuário removido!');
          this.listarUsuarios();
        },
        error: () => alert('Erro ao remover usuário.'),
      });
    }
  }

  limpar() {
    this.usuario = this.novoUsuario();
  }

  novoUsuario() {
    return {
      nome: '',
      email: '',
      senha: '',
      cpf: '',
      whatsapp: '',
      whatsappapikey: '',
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      complemento_endereco: '',
      numero_endereco: ''
    };
  }

  irParaLogin() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }

    formatarCPF() {
    if (this.usuario.cpf) {
      const cpfNumeros = this.usuario.cpf.replace(/\D/g, '');
      if (cpfNumeros.length === 11) {
        this.usuario.cpf = cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }
  }

    formatarWhatsapp() {
    if (this.usuario.whatsapp) {
      const numero = this.usuario.whatsapp.replace(/\D/g, '');
      if (numero.length >= 12 && numero.length <= 13) {
        const codigoPais = numero.length === 13 ? numero.slice(0, 2) : '55';
        const ddd = numero.slice(-11, -9);
        const parte1 = numero.slice(-9, -4);
        const parte2 = numero.slice(-4);
        this.usuario.whatsapp = `+${codigoPais} (${ddd}) ${parte1}-${parte2}`;
      }
    }
  }

    formatarCEP()
  {
    if (this.usuario.cep) {
      const cepNumeros = this.usuario.cep.replace(/\D/g, '');
      if (cepNumeros.length === 8) {
        this.usuario.cep = cepNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
      }
    }
  }
}
