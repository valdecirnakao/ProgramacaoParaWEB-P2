import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CestaService } from '../cesta/cesta.service';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../produto/produto.service';

@Component({
  standalone: true,
  selector: 'app-vitrine',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vitrine.component.html',
})
export class VitrineComponent implements OnInit {
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  nomeUsuario: string = '';
  busca: string = '';
  sugestoes: string[] = [];
  mostrarSugestoes: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private cestaService: CestaService,
    private router: Router
  ) {}

  ngOnInit() {
    // Agora carregue os produtos do backend
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos', erro);
      }
    });
  }

  comprar(produto: any) {
    this.cestaService.adicionarProduto({ ...produto, qtd: 1 });
    this.router.navigate(['/cesta']);
  }

  verDetalhes(produto: any) {
    // lógica para ir para detalhes do produto
    console.log('Detalhar:', produto);
  }

  filtrarProdutos() {
    const termo = this.busca.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    this.sugestoes = this.produtos
      .map(p => p.nome)
      .filter(nome => nome.toLowerCase().includes(termo))
      .slice(0, 5); // limita a 5 sugestões
  }

  selecionarSugestao(sugestao: string) {
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

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }

  ocultarSugestoesComAtraso() {
    setTimeout(() => {
      this.mostrarSugestoes = false;
    }, 200);
  }
}
