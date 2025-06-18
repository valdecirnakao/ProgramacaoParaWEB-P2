import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { CestaService } from '../cesta/cesta.service';
import { ProdutoService } from '../produto/produto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css'],
})
export class DetalheComponent implements OnInit {
  produtos: any[] = [];
  produto: any = null;
  busca: string = '';
  produtosFiltrados: any[] = [];
  sugestoes: string[] = [];
  mostrarSugestoes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cestaService: CestaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    // Carrega todos os produtos do backend para filtro/sugestão
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
        this.popularDetalhe();
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos', erro);
      }
    });
  }

  // Preenche os detalhes do produto com base nos params recebidos ou busca pelo ID
  popularDetalhe() {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      // Caso o produto tenha vindo por queryParams, já popula
      let produto = this.produtos.find(p => p.id === id);

      if (!produto) {
        // Se não encontrou nos carregados, pode fazer uma busca específica pelo backend (opcional)
        // this.produtoService.buscarPorId(id).subscribe(prod => { ... });
        // Por simplicidade, deixa o produto null caso não encontre
        produto = {
          id: id,
          nome: params['nome'] || '',
          preco: Number(params['preco']) || 0,
          imagem: params['imagem'] || '',
          detalhe: params['detalhe'] || 'Sem descrição detalhada.',
          qtd: Number(params['qtd']) || 1
        };
      }
      this.produto = produto;
    });
  }

  comprar() {
    if (this.produto) {
      this.cestaService.adicionarProduto({ ...this.produto, qtd: 1 });
      this.router.navigate(['/cesta']);
    }
  }

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }

  filtrarProdutos() {
    const termo = this.busca.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );
    this.sugestoes = this.produtos
      .map(p => p.nome)
      .filter(nome => nome.toLowerCase().includes(termo))
      .slice(0, 5);
  }

  ocultarSugestoesComAtraso() {
    setTimeout(() => {
      this.mostrarSugestoes = false;
    }, 200);
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
}
