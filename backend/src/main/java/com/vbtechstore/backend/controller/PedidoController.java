package com.vbtechstore.backend.controller;

import com.vbtechstore.backend.model.Pedido;
import com.vbtechstore.backend.repository.PedidoRepository;
import com.vbtechstore.backend.repository.UsuarioRepository; // <- ADICIONE ESTA LINHA!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; // <- ADICIONE ESTA LINHA!

    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("Recebido");

        // GARANTA QUE O USUÁRIO ESTÁ COMPLETO NO OBJETO PEDIDO
        if (pedido.getUsuario() != null && pedido.getUsuario().getId() != null) {
            pedido.setUsuario(
                usuarioRepository.findById(pedido.getUsuario().getId()).orElse(null)
            );
        }

        // Vincule cada item ao pedido (importante para persistência correta)
        if (pedido.getItens() != null) {
            pedido.getItens().forEach(item -> item.setPedido(pedido));
        }

        // Calcule o total do pedido (boa prática)
        if (pedido.getItens() != null) {
            pedido.setTotal(
                pedido.getItens().stream()
                    .map(item -> item.getPrecoUnitario().multiply(
                            new java.math.BigDecimal(item.getQuantidade())))
                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
            );
        }

        Pedido salvo = pedidoRepository.save(pedido);
        return ResponseEntity.status(201).body(salvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedido(@PathVariable Long id) {
        return pedidoRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return ResponseEntity.ok(pedidos);
    }
}
