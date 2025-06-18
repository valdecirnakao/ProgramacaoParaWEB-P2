import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto/produto.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../usuario/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  senha: string = '';
  erroLogin: boolean = false;
  busca: string = '';
  mostrarSugestoes: boolean = false;
  sugestoes: string[] = [];
  produtos: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Carrega produtos do backend
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos', erro);
      }
    });
  }

  filtrarSugestoes() {
    const termo = this.busca.toLowerCase();
    this.sugestoes = this.produtos
      .map(p => p.nome)
      .filter(nome => nome.toLowerCase().includes(termo))
      .slice(0, 5);
  }

  selecionarSugestao(sugestao: string) {
    const usuario = sessionStorage.getItem('usuarioLogado');
    if (!usuario) {
      alert('Por favor, faça login para visualizar os detalhes do produto.');
      return;
    }
    const produto = this.produtos.find(p => p.nome === sugestao);
    if (produto) {
      this.router.navigate(['/detalhe'], {
        queryParams: {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          detalhe: produto.detalhe
        }
      });
    }
  }

  ocultarSugestoesComAtraso() {
    setTimeout(() => {
      this.mostrarSugestoes = false;
    }, 200);
  }

  login() {
    this.usuarioService.login(this.email, this.senha).subscribe({
      next: (usuario: any) => {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        this.erroLogin = false;

        if (usuario.email === 'admin@vbtechstore.com') {
          this.isAdmin = true;
          sessionStorage.setItem('isAdmin', String(this.isAdmin));
          alert(`Bem-vindo, administrador ${usuario.nome}!`);
          this.router.navigate(['/']);
        } else {
          this.isAdmin = false;
          sessionStorage.removeItem('isAdmin');
          alert(`Bem-vindo, ${usuario.nome}!`);
          this.router.navigate(['/vitrine']);
        }
      },
      error: () => {
        this.erroLogin = true;
      }
    });
  }

  irParaMenu() {
    const usuario = sessionStorage.getItem('usuarioLogado');
    if (!usuario) {
      alert('Por favor, faça login para visualizar os detalhes do produto.');
      return;
    }
    this.router.navigate(['/vitrine']);
  }

  recuperarSenha() {
    if (!this.email || this.email.trim() === '') {
      alert('Por favor, insira um e-mail válido para recuperar a senha.');
      return;
    }

    this.usuarioService.recuperarSenha(this.email.trim()).subscribe({
      next: (usuario) => {
        if (!usuario || !usuario.nome || !usuario.senha || !usuario.whatsapp || !usuario.whatsappapikey) {
          alert('Usuário encontrado, mas dados incompletos para envio de mensagem.');
          return;
        }

        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        const dataatual = `${dia}/${mes}/${ano}`;
        const hora = String(hoje.getHours()).padStart(2, '0');
        const minutos = String(hoje.getMinutes()).padStart(2, '0');
        const horaatual = `${hora}:${minutos}`;

        const mensagem =
          `Olá ${usuario.nome}!\n` +
          `Conforme solicitação de recuperação de senha recebida em ${dataatual} às ${horaatual}, sua senha é:\n` +
          `${usuario.senha}\n` +
          `Atenciosamente,\nVB TechStore`;

        const whatsappLimpo = usuario.whatsapp.replace(/\D/g, '');
        const whatsappFinal = `+${whatsappLimpo}`;

        const api =
          `https://api.callmebot.com/whatsapp.php?` +
          `phone=${whatsappFinal}` +
          `&text=${encodeURIComponent(mensagem)}` +
          `&apikey=${usuario.whatsappapikey}`;

        this.http.get(api, { responseType: 'text' }).subscribe({
          next: (resposta: string) => {
            if (resposta.toLowerCase().includes("message sent")) {
              alert('Senha enviada com sucesso para o WhatsApp cadastrado!');
            } else {
              alert('Erro ao enviar mensagem via WhatsApp: ' + resposta);
            }
          },
          error: (erro) => {
            if (erro.status === 0) {
              alert('Senha enviada com sucesso para o WhatsApp cadastrado!');
              console.warn('A mensagem foi provavelmente enviada, mas houve erro de CORS ou formato.');
            } else {
              alert('Não foi possível se comunicar com o servidor de envio de mensagem. Tente novamente mais tarde.');
              console.error('Erro ao enviar mensagem:', erro);
            }
          }
        });
      },
      error: () => {
        alert('E-mail não cadastrado no sistema.');
      }
    });
  }

  abrirAreaAdminProduto() {
      this.router.navigate(['/cadastro-de-produtos']);
      }

  abrirAreaAdminUsuario() {
      this.router.navigate(['/cadastro-de-usuarios']);
  }
}
