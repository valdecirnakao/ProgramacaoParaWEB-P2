import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../pedido/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedido-resumo',
  standalone: true,
  templateUrl: './pedido-resumo.component.html',
  imports: [CommonModule, FormsModule]
})
export class PedidoResumoComponent implements OnInit {
  pedido: any = null;
  carregando = true;
  erro: string | null = null;
  busca: string = '';
  sugestoes: string[] = [];
  mostrarSugestoes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id) || !id) {
      this.erro = 'Pedido inválido!';
      this.carregando = false;
      return;
    }
    this.pedidoService.buscar(id).subscribe({
      next: p => {
        this.pedido = p;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Pedido não encontrado!';
        this.carregando = false;
      }
    });
  }

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/']);
  }

  filtrarProdutos() {
    if (!this.pedido?.itens) {
      this.sugestoes = [];
      return;
    }
    const termo = this.busca.toLowerCase();
    this.sugestoes = this.pedido.itens
      .map((item: any) => item.produto?.nome)
      .filter((nome: string) => nome?.toLowerCase().includes(termo))
      .slice(0, 5);
  }

  ocultarSugestoesComAtraso() {
    setTimeout(() => {
      this.mostrarSugestoes = false;
    }, 200);
  }

  selecionarSugestao(sugestao: string) {
    // No contexto de resumo, talvez só filtrar, mas você pode navegar se quiser
    this.busca = sugestao;
    this.filtrarProdutos();
  }
}
