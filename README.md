# SuperHeroApi

Aplicação web para listagem e visualização de perfis de heróis, construída com Next.js, TypeScript e Tailwind CSS.

---

## Sobre o projeto

Aplicação que lista heróis consumindo dados via Server Actions, com suporte a paginação, busca, favoritos e filtros. A base do projeto já existia — as melhorias foram implementadas para tornar a experiência do usuário mais completa e funcional.

---

## Tecnologias

- **Next.js 15** — framework React com App Router e Server Actions
- **React** — biblioteca de interface
- **TypeScript** — tipagem estática
- **Tailwind CSS** — estilização utilitária
- **React Query (@tanstack/react-query)** — gerenciamento de cache e estados de requisição
- **Zod** — validação de schemas

---

## Como iniciar o projeto

### Pré-requisitos

- Node.js 20+
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

5. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

### Comandos úteis

```bash
npm run dev    # ambiente de desenvolvimento
npm run build  # build de produção
npm run start  # iniciar versão de produção
```

---

## O que foi implementado

### 1. Paginação na listagem de heróis

A paginação foi conectada à camada de `actions` que já existia no projeto (`src/actions/list-hero.ts`). Os estados `page` e `limit` são controlados via `useState` e passados como parâmetros para `listHeroAction`.

O usuário pode:
- Navegar entre páginas com os botões `←` e `→`
- Clicar diretamente em um número de página
- Escolher quantos heróis exibir por página (10, 20 ou 50)

**Como testar:** Acesse a listagem e clique nas setas de paginação ou mude o número de itens por página no select à direita.

---

### 2. Busca por nome

Um campo de texto permite buscar heróis pelo nome. A busca utiliza debounce de 400ms para evitar requisições a cada tecla digitada.

A lógica de filtro foi implementada em `src/actions/list-hero.ts`:
- Normaliza o texto (remove acentos, converte para minúsculas)
- Divide o nome em palavras e verifica se alguma **começa com** o termo buscado

Essa abordagem evita falsos positivos que o `includes` causava (ex: buscar "sup" retornava heróis com "sup" em aliases ocultos).

**Como testar:** Digite "super" no campo de busca. Apenas heróis cujo nome começa com "super" serão exibidos.

---

### 3. Filtros adicionais

#### Filtro por Publisher

Um select permite filtrar heróis por editora:
- **All Publishers** — exibe todos
- **Marvel Comics** — apenas heróis da Marvel
- **DC Comics** — apenas heróis da DC

O filtro é aplicado no frontend sobre os dados já retornados pela query.

**Como testar:** Selecione "Marvel" ou "DC" no select de publisher e veja a listagem filtrar.

#### Ordenação

Um select permite ordenar a listagem por:
- **Name** — ordem alfabética pelo nome
- **Alignment** — agrupa por alinhamento (good, bad, neutral)
- **Publisher** — agrupa por editora

A ordenação usa `localeCompare` para garantir comparação correta de strings.

**Como testar:** Mude a opção de ordenação e observe a ordem dos cards se reorganizar.

#### Ordenação com direção (Asc/Desc)

Foi implementado um controle adicional de direção de ordenação, permitindo ao usuário escolher entre ordem crescente (**Asc**) e decrescente (**Desc**).

A funcionalidade funciona em conjunto com o select de ordenação já existente, permitindo combinações como:

* Name + Asc → ordem alfabética (A → Z)
* Name + Desc → ordem reversa (Z → A)
* ID + Asc → menor para maior
* ID + Desc → maior para menor

A lógica foi implementada no hook `useHeroes.ts`, invertendo o resultado da comparação quando a direção é `"desc"`.

Também foi adicionada a opção de ordenação por **ID**, ampliando as possibilidades de organização dos dados.

**Como testar:** Selecione um tipo de ordenação (ex: Name ou ID) e altere o select de direção para "Asc" ou "Desc". A lista será reordenada automaticamente.


---

### 4. Botão de favorito no perfil do herói

Na página de perfil (`/hero/[slug]`), há um botão em formato de estrela (☆/★) para marcar ou desmarcar o herói como favorito.

O botão foi implementado como um Client Component separado (`src/components/providers/favorite.tsx`) pois a página de perfil é um Server Component assíncrono e não pode usar hooks diretamente.

**Como testar:** Acesse o perfil de qualquer herói e clique na estrela. Ela ficará amarela (★) indicando que foi favoritado.

---

### 5. Persistência de favoritos no localStorage

Os favoritos são salvos no `localStorage` do navegador sob a chave `"favorites"`, como um array de IDs numéricos:

```json
[30, 195, 376]
```

Ao recarregar a página, os favoritos são recuperados automaticamente e os badges de estrela voltam a aparecer nos cards.

**Como testar:** Favorite um herói, feche e reabra o navegador — o favorito estará preservado.

---

### 6. Visualizar apenas heróis favoritos

Na listagem, há um botão "☆ Favorites" que ao ser clicado filtra a lista para exibir apenas os heróis marcados como favoritos.

O botão também exibe um contador com o total de favoritos salvos (ex: `★ Favorites 3`).

**Como testar:** Favorite alguns heróis pelo perfil, volte à listagem e clique em "Favorites" — apenas os heróis favoritados aparecerão.

### 7. Modo escuro (Dark Mode)

Foi implementado suporte a tema claro e escuro com persistência no navegador.

O tema é controlado via classe dark aplicada no elemento <html>, e a preferência do usuário é salva no localStorage, garantindo que o tema escolhido seja mantido mesmo após recarregar a página.

O botão de alternância de tema está disponível na barra de filtros.

Funcionalidades:

Alternância entre modo claro e escuro
Persistência da escolha do usuário
Aplicação global do tema
Compatibilidade com Tailwind CSS v4

**Como testar:** Clique no botão "🌙 Dark / ☀️ Light" no topo da página e recarregue o navegador — o tema permanecerá o mesmo.

### 8. Responsividade da interface

A interface foi adaptada para funcionar corretamente em diferentes tamanhos de tela, principalmente em dispositivos móveis.

Os elementos da barra de filtros foram reorganizados para se ajustarem dinamicamente:

Em telas pequenas, os controles ficam em coluna
Em telas maiores, são exibidos em linha

Melhorias aplicadas:

Uso de flex-col e sm:flex-row
Inputs e botões com w-full no mobile
Layout fluido e adaptável

**Como testar:**  Reduza o tamanho da tela do navegador ou utilize o modo responsivo do DevTools.

### 9. Melhorias visuais (UI/UX)

Foi realizado um refinamento visual geral da interface, com foco em consistência, contraste e experiência do usuário.

Melhorias aplicadas:

Ajuste de cores para melhor contraste em light/dark mode
Padronização de botões, inputs e selects
Adição de sombras (shadow-sm, hover:shadow-lg)
Melhor feedback visual em hover e estados ativos
Uso de cores mais suaves (evitando preto puro)

Essas melhorias tornam a interface mais próxima de aplicações modernas como GitHub e Vercel.

### 10. Ajuste de contraste no modo claro

Alguns elementos que funcionavam bem no modo escuro apresentavam baixo contraste no modo claro, especialmente o botão de favoritos e o contador.

Foram feitas adaptações específicas para o tema claro:

Botão de favoritos com fundo amarelo claro quando ativo
Texto com maior contraste (text-yellow-700)
Badge de contagem com cores ajustadas (bg-yellow-200)

Resultado:

Melhor legibilidade
Destaque visual mais claro
Experiência mais consistente entre temas

---

### Comparação entre heróis 
Foi implementada uma funcionalidade de comparação direta entre heróis.

O usuário pode selecionar até 2 heróis e visualizar seus atributos lado a lado.

Funcionalidades
Botão "Comparar" em cada card
Seleção de até 2 heróis
Botão "Remover da comparação"
Botão "Limpar comparação"
Comparação exibida automaticamente

**Como testar:** Selecione os herois que quer comparar usando o botão de comparar, e em cima mostra atributos de cada um.

## Estrutura do projeto

```
src/
├── actions/
│   └── list-hero.ts
├── app/
│   ├── hero/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── assets/
├── components/
│   ├── providers/
│   │   ├── favorite.tsx
│   │   └── query.tsx
│   └── ui/
│       └── HeroCardSkeleton.tsx
├── hooks/
│   ├── useCompare.ts
│   ├── useFavorites.ts
│   ├── useHeroes.ts
│   └── useTheme.ts
├── lib/
├── schemas/
└── styles/
    └── globals.css

```

---

## Decisões técnicas

### Por que debounce na busca?
Sem debounce, cada tecla digitada dispararia uma nova requisição ao servidor. Com 400ms de delay, a requisição só acontece quando o usuário para de digitar, reduzindo chamadas desnecessárias.

### Por que `placeholderData` no React Query?
Sem ele, ao mudar de página ou digitar no campo de busca, o estado `isLoading` ficava `true` e o componente inteiro era desmontado, causando um efeito visual de "reload" na página. Com `placeholderData`, os dados anteriores permanecem visíveis enquanto os novos carregam.

### Por que o FavoriteButton é um Client Component separado?
A página de perfil é um Server Component (`async`) — ela não pode usar hooks como `useState` ou `useEffect`. Para adicionar interatividade, foi criado um Client Component isolado que gerencia apenas o estado do botão, mantendo o restante da página no servidor.

### Por que filtrar por publisher no frontend?
A estrutura de `listHeroAction` já retorna os dados paginados do servidor. Aplicar um filtro adicional de publisher no servidor exigiria uma nova chamada a cada mudança. Como os dados já estão em memória, filtrar no cliente é mais rápido e simples para esse caso.

### Por que `startsWith` em vez de `includes` na busca?
O `includes` retornava falsos positivos — heróis como Ant-Man apareciam ao buscar "sup" porque tinham "sup" em algum alias oculto. O `startsWith` por palavra garante que apenas heróis cujo nome **começa com** o termo sejam retornados, respeitando a expectativa do usuário.

### Por que a comparação foi feita no frontend?
A funcionalidade de comparação foi implementada inteiramente no frontend utilizando estado local (useState), sem necessidade de novas chamadas ao servidor.

Isso foi escolhido porque:

Os dados dos heróis já estão disponíveis na listagem atual
Evita requisições adicionais desnecessárias
Garante resposta imediata ao usuário (UX mais fluida)
Simplifica a arquitetura da aplicação
