import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../usuario/usuario.service'; // ajuste o caminho conforme necessário
import { log } from 'console';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    whatsapp: '',
    whatsappapikey: '',
    cep: '',
    numeroEndereco: '',
    complementoEndereco: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  };
  usuariosCadastrados: any[] = [];
  emailsCadastrados: string[] = [];

  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  alternarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  logout() {
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

  formatarCEP()
  {
    if (this.usuario.cep) {
      const cepNumeros = this.usuario.cep.replace(/\D/g, '');
      if (cepNumeros.length === 8) {
        this.usuario.cep = cepNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
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

  cadastrar(form: any) {
    if (
      this.usuario.nome &&
      this.usuario.email &&
      this.usuario.senha &&
      this.usuario.confirmarSenha &&
      this.usuario.cpf &&
      this.usuario.whatsapp &&
      this.usuario.whatsappapikey &&
      this.usuario.senha === this.usuario.confirmarSenha &&
      this.usuario.cep &&
      this.usuario.numeroEndereco &&
      this.usuario.complementoEndereco &&
      this.usuario.logradouro &&
      this.usuario.bairro &&
      this.usuario.cidade &&
      this.usuario.estado
    ) {
      const { confirmarSenha, ...usuario } = this.usuario;
      this.usuarioService.cadastrar(usuario).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          form.resetForm();
          Object.keys(this.usuario).forEach(k => this.usuario[k as keyof typeof this.usuario] = '');
          this.mostrarSenha = false;
          this.mostrarConfirmarSenha = false;
          this.router.navigate(['/login']);
        },
        error: (erro) => {
          alert('Erro ao cadastrar usuário.');
          console.error(erro);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  ngOnInit() {
    this.usuarioService.buscarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuariosCadastrados = usuarios;
        this.emailsCadastrados = usuarios.map(u => u.email);
      }
    });
  }

  onEmailSelecionado(email: string) {
    // Se digitou algo que não está na lista, é novo cadastro
    if (!this.emailsCadastrados.includes(email)) {
      this.usuario.email = email;
      this.usuario.nome = '';
      this.usuario.senha = '';
      this.usuario.confirmarSenha = '';
      this.usuario.cpf = '';
      this.usuario.whatsapp = '';
      this.usuario.whatsappapikey = '';
      this.usuario.cep = '';
      this.usuario.numeroEndereco = '';
      this.usuario.complementoEndereco = '';
      this.usuario.logradouro = '';
      this.usuario.bairro = '';
      this.usuario.cidade = '';
      this.usuario.estado = '';
      return;
    }
    // Preencher os campos com o usuário selecionado
    this.usuarioService.buscarUsuarioPorEmail(email).subscribe({
      next: (user) => {
        this.usuario.nome = user.nome || '';
        this.usuario.email = user.email || '';
        this.usuario.senha = '';
        this.usuario.confirmarSenha = '';
        this.usuario.cpf = user.cpf || '';
        this.usuario.whatsapp = user.whatsapp || '';
        this.usuario.whatsappapikey = user.whatsappapikey || '';
        this.usuario.cep = user.cep || '';
        this.usuario.numeroEndereco = user.numeroEndereco || '';
        this.usuario.complementoEndereco = user.complementoEndereco || '';
        this.usuario.logradouro = user.logradouro || '';
        this.usuario.bairro = user.bairro || '';
        this.usuario.cidade = user.cidade || '';
        this.usuario.estado = user.estado || '';
      }
    });
  }
}
