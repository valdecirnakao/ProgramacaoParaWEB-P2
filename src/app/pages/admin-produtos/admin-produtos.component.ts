import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../pages/produto/produto.service' // Caminho ajustado!
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule} from '@angular/router';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-produtos.component.html',
  styleUrls: ['./admin-produtos.component.css'],
})
export class AdminProdutosComponent implements OnInit {
  produtos: any[] = [];
  produto: any = this.novoProduto();

  constructor(private produtoService: ProdutoService, private router: Router) {}

  ngOnInit() {
    this.listarProdutos();
  }

  listarProdutos() {
    this.produtoService.listar().subscribe({
      next: (res) => (this.produtos = res),
      error: () => alert('Erro ao buscar produtos'),
    });
  }

  salvar() {
    if (this.produto.id) {
      this.produtoService.atualizar(this.produto.id, this.produto).subscribe({
        next: () => {
          alert('Produto atualizado!');
          this.listarProdutos();
          this.limpar();
        },
        error: () => alert('Erro ao atualizar produto.'),
      });
    } else {
      this.produtoService.criar(this.produto).subscribe({
        next: () => {
          alert('Produto cadastrado!');
          this.listarProdutos();
          this.limpar();
        },
        error: () => alert('Erro ao cadastrar produto.'),
      });
    }
  }

  editar(p: any) {
    this.produto = { ...p };
  }

  remover(id: number) {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.produtoService.remover(id).subscribe({
        next: () => {
          alert('Produto removido!');
          this.listarProdutos();
        },
        error: () => alert('Erro ao remover produto.'),
      });
    }
  }

  limpar() {
    this.produto = this.novoProduto();
  }

  novoProduto() {
    return { nome: '', qtd: '', preco: '', imagem: '', detalhe: '' };
  }

  irParaLogin() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }
}
