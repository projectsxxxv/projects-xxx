# Frontend do site de evento

Este diretório é a raiz do projeto na Vercel. As páginas estáticas, o checkout de ingressos e as funções da API ficam aqui para manter as rotas de produção no mesmo lugar.

## Organização

- `index.html` e as páginas por rota formam o site público.
- `ingressos/` contém a interface do checkout e o catálogo de eventos.
- `api/` contém as funções da Vercel. Elas usam Firebase Admin no servidor; o navegador não acessa o Firestore diretamente.
- `guiche/` mantém a rota de compatibilidade e direciona a compra para o checkout interno.
- `imagens/` contém as mídias do frontend. `imagens/originais/` guarda os arquivos-fonte e é excluída dos deploys.

O servidor para VPS fica em `../../backend/server.js` e usa SQLite. Ele publica as páginas deste diretório e atende as mesmas rotas de checkout no ambiente próprio.
