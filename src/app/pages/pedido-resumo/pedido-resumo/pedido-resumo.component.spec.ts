import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoResumoComponent } from './pedido-resumo.component';

describe('PedidoResumoComponent', () => {
  let component: PedidoResumoComponent;
  let fixture: ComponentFixture<PedidoResumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoResumoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoResumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
