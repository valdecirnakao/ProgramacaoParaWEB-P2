import { Component, OnInit } from '@angular/core';
import { CestaService } from './cesta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProdutoService } from '../produto/produto.service';
import { PedidoService } from '../pedido/pedido.service';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './cesta.component.html'
})
export class CestaComponent implements OnInit {
  todosProdutos: any[] = [];
  produtos: any[] = [];
  nomeUsuario: string = '';
  busca: string = '';
  total = 0;
  sugestoes: string[] = [];
  mostrarSugestoes: boolean = false;

  constructor(
    private cestaService: CestaService,
    private router: Router,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService // Corrigido aqui!
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.todosProdutos = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos', erro);
      }
    });

    this.produtos = this.cestaService.getCesta();
    this.calcularTotal();
  }

  recarregar(): void {
    this.produtos = this.cestaService.getCesta();
    this.calcularTotal();
  }

  atualizarQtd(produto: any, qtd: number): void {
    this.cestaService.atualizarQuantidade(produto, qtd);
    this.calcularTotal();
  }

  limparCesta() {
    this.cestaService.limparCesta();
    this.produtos = [];
    this.total = 0;
  }

  finalizarCompra() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');
    if (!usuarioLogado?.id) {
      alert('Faça login para finalizar a compra!');
      return;
    }
    if (this.produtos.length === 0 || this.produtos.every(item => item.qtd <= 0)) {
      alert('Sua cesta está vazia.');
      return;
    }

    // Monte o objeto do pedido conforme o backend espera:
    const pedido = {
      usuario: { id: usuarioLogado.id },
      itens: this.produtos.map(item => ({
        produto: { id: item.id },
        quantidade: item.qtd,
        precoUnitario: item.preco
      })),
      logradouro: usuarioLogado.logradouro,
      numeroEndereco: usuarioLogado.numeroEndereco,
      complementoEndereco: usuarioLogado.complementoEndereco,
      bairro: usuarioLogado.bairro,
      cidade: usuarioLogado.cidade,
      estado: usuarioLogado.estado,
      cep: usuarioLogado.cep
    };

    this.pedidoService.criar(pedido).subscribe({
      next: pedidoSalvo => {
        alert('Compra finalizada com sucesso!');
        this.limparCesta();
        this.router.navigate(['/pedido-resumo', pedidoSalvo.id]);
      },
      error: () => alert('Erro ao finalizar pedido!'),
    });
  }

  removerItem(id: number) {
    this.cestaService.removerProduto(id);
    this.produtos = this.cestaService.getCesta();
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.produtos.reduce((soma, p) => soma + (p.preco * p.qtd), 0);
  }

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }

  filtrarProdutos() {
    const termo = this.busca.toLowerCase();
    this.sugestoes = this.todosProdutos
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
    const produto = this.todosProdutos.find(p => p.nome === sugestao);
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
