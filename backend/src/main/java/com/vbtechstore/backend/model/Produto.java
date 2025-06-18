package com.vbtechstore.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Integer qtd;
    private String detalhe;
    private Double preco;
    private String imagem;

    // Construtores, getters e setters
    public Produto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getQtd() { return qtd; }
    public void setQtd(Integer qtd) { this.qtd = qtd; }

    public String getDetalhe() { return detalhe; }
    public void setDetalhe(String detalhe) { this.detalhe = detalhe; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
  }
