package com.vbtechstore.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PedidoItem> itens = new ArrayList<>();

    private LocalDateTime dataPedido;
    private BigDecimal total;
    private String status;
    private String logradouro;
    private String numeroEndereco;
    private String complementoEndereco;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    // Construtor vazio obrigatório para o JPA
    public Pedido() {}

    // Getters e Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<PedidoItem> getItens() { return itens; }
    public void setItens(List<PedidoItem> itens) { this.itens = itens; }

    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getNumeroEndereco() { return numeroEndereco; }
    public void setNumeroEndereco(String numeroEndereco) { this.numeroEndereco = numeroEndereco; }

    public String getComplementoEndereco() { return complementoEndereco; }
    public void setComplementoEndereco(String complementoEndereco) { this.complementoEndereco = complementoEndereco; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    // Opcional: método para adicionar itens ao pedido
    public void adicionarItem(PedidoItem item) {
        itens.add(item);
        item.setPedido(this);
    }

    // toString opcional para debug
    @Override
    public String toString() {
        return "Pedido{" +
                "id=" + id +
                ", usuario=" + (usuario != null ? usuario.getId() : null) +
                ", dataPedido=" + dataPedido +
                ", total=" + total +
                ", status='" + status + '\'' +
                ", logradouro='" + logradouro + '\'' +
                ", numeroEndereco='" + numeroEndereco + '\'' +
                ", complementoEndereco='" + complementoEndereco + '\'' +
                ", bairro='" + bairro + '\'' +
                ", cidade='" + cidade + '\'' +
                ", estado='" + estado + '\'' +
                ", cep='" + cep + '\'' +
                '}';
    }
}
