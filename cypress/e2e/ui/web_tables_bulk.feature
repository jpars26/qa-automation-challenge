Feature: Web Tables em massa

  Scenario: Criar 12 registros e deletar todos
    Given que estou na página Web Tables
    When eu crio 12 registros aleatórios
    Then devo ver cada um criado na tabela
    When eu deleto todos os registros criados
    Then nenhum dos registros criados deve permanecer
