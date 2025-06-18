import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { VitrineComponent } from './pages/vitrine/vitrine.component';
import { DetalheComponent } from './pages/detalhe/detalhe.component';
import { CestaComponent } from './pages/cesta/cesta.component';
import { AdminProdutosComponent } from './pages/admin-produtos/admin-produtos.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { PedidoResumoComponent } from './pages/pedido-resumo/pedido-resumo/pedido-resumo.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'vitrine', component: VitrineComponent },
  { path: 'detalhes', component: DetalheComponent },
  { path: 'cesta', component: CestaComponent },
  { path: 'detalhe', component: DetalheComponent },
  { path: 'pedido-resumo/:id', component: PedidoResumoComponent },
  { path: 'cadastro-de-produtos', loadComponent: () =>
    import('./pages/admin-produtos/admin-produtos.component')
      .then(m => m.AdminProdutosComponent)},
  { path: 'cadastro-de-usuarios', loadComponent: () =>
    import('./pages/admin-usuarios/admin-usuarios.component')
      .then(m => m.AdminUsuariosComponent)}
];
