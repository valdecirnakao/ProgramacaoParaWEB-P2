import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CestaService {
  private produtos: any[] = [];

  getCesta() {
    return this.produtos;
  }

  adicionarProduto(produto: any) {
    const existente = this.produtos.find(p => p.id === produto.id);
    if (existente) {
      existente.qtd += produto.qtd;
    } else {
      this.produtos.push({ ...produto });
    }
  }

  atualizarQuantidade(produto: any, qtd: number) {
    const item = this.produtos.find(p => p.id === produto.id);
    if (item) {
      item.qtd = qtd;
    }
  }

  limparCesta() {
    this.produtos = [];
  }

  getTotal(): number {
    return this.produtos.reduce((total, p) => total + (p.qtd * p.preco), 0);
  }

  removerProduto(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }

}
