## Função do Use-Case em APIs SOLID

O use-case (caso de uso) representa uma camada de lógica de negócio responsável por executar operações específicas da aplicação, como criar usuários, autenticar logins ou processar pagamentos. Ele isola as regras de negócio do restante do sistema, facilitando testes, manutenção e reutilização do código.

No contexto do SOLID, o use-case ajuda a aplicar princípios como:

- **Single Responsibility Principle (SRP):** Cada use-case tem uma única responsabilidade, tornando o código mais organizado.
- **Dependency Inversion Principle (DIP):** Use-cases dependem de abstrações (interfaces), não de implementações concretas, permitindo maior flexibilidade.

Em resumo, o use-case é o coração da lógica de negócio, conectando controllers, repositórios e serviços de forma clara e desacoplada.


## Ierarquia de desenvolvimento -> SOLID

use-case => erros => testes unitarios => controllers => routes

- Primeiro fazer os casos de uso e teste unitarios -> logo após focar na infra e controllers

## TDD - Test-Driven Development: Desenvolvimento dirigido a testes.

-  


## nomenclatura
 - get: retorna varios itens
 - fetch: retorna um item