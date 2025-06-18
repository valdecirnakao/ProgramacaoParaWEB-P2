package com.vbtechstore.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String whatsapp;
    private String whatsappapikey;
    private String cep;
    private String numeroEndereco;
    private String complementoEndereco;
    private String logradouro;
    private String bairro;
    private String cidade;
    private String estado;
}
