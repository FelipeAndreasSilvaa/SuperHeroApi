# SuperHeroApi

Aplicação web para listagem e visualização de perfis de heróis, construída com Next.js, TypeScript e Tailwind CSS.

## Sobre o projeto

Hoje temos uma base funcional para exibir heróis e seus perfis, mas ainda estamos com dificuldade para evoluir alguns pontos importantes da experiência do usuário e da organização da entrega.

Este repositório representa exatamente esse cenário: uma aplicação que já roda, mas que precisa de melhorias práticas para ficar pronta para uso real.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- Zod

## Como iniciar o projeto

### Pré-requisitos

- Node.js 20+ (recomendado)
- npm

### Passo a passo

1. Faça um fork deste repositório para sua conta.
2. Clone o fork:

```bash
git clone <url-do-seu-fork>
cd SuperHeroApi
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

5. Acesse no navegador:

- [http://localhost:3000](http://localhost:3000)

### Comandos úteis

```bash
npm run dev    # ambiente de desenvolvimento
npm run build  # build de produção
npm run start  # iniciar versão de produção
```

## O problema que precisamos resolver

Estamos com dificuldade para avançar nos itens abaixo e precisamos de uma implementação completa e bem documentada:

1. Aplicar paginação na listagem de heróis.
2. Aplicar filtro de texto para busca de heróis.
   - Dica: já existem estruturas na camada de `actions` para paginação e busca, mas elas ainda não estão aplicadas no fluxo de interface.
3. Outros filtros são permitidos caso você queira tentar, mas deverão ser desenvolvidos por você.
4. No perfil do herói, incluir um botão em formato de estrela para marcar/desmarcar como favorito.
5. Persistir favoritos em `localStorage`.
6. Na listagem, incluir a opção de visualizar apenas heróis favoritos.

## Entrega esperada

- Fork atualizado com as melhorias solicitadas.
- Código funcional e organizado.
- README/documentação explicando claramente:
  - o que foi implementado;
  - decisões técnicas tomadas;
  - como testar cada funcionalidade.

## Diferenciais (opcional)

Qualquer adicional é bem-vindo, por exemplo:

- Deploy da aplicação (preferencialmente na Vercel);
- Novas funcionalidades, como:
  - Ordenação por nome e por ID
  - Filtro por alignment
  - Filtro por publisher
  - Busca por múltiplos campos
  - Estado de loading com skeleton
  - Estado de erro com retry
  - Modo escuro/claro com persistência
  - Página de detalhes com mais métricas
  - Comparação entre dois heróis
  - Sistema de favoritos com ordenação por favoritos primeiro
  - Testes automatizados
  - Melhorias de acessibilidade
  - Melhorias de performance
  - Internacionalização
  - Deploy com preview por branch

Importante: adicionais precisam ser explicados e documentados. Itens sem explicação/documentação serão desconsiderados.
