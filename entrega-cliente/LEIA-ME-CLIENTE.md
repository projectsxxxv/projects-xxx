# Publicação do site e checkout

O checkout próprio requer o servidor Node e SQLite persistente. A pasta `browser/site` isolada é apenas o frontend e não processa pedidos sem o backend deste repositório.

## Requisitos

- Node.js 22.13 ou mais recente; ou Docker com Docker Compose.
- Disco persistente para o arquivo SQLite.
- Credenciais PixVault configuradas como variáveis de ambiente no servidor.

## Executar com Docker Compose

1. Clone o repositório no servidor.
2. Configure `PIXVAULT_TOKEN`, `PIXVAULT_CLIENT_ID` e `PIXVAULT_API_URL` no arquivo `.env` local. Não envie esse arquivo ao Git.
3. Inicie o serviço:

   ```sh
   docker compose up -d --build
   ```

O volume `orders-data` mantém os pedidos e ingressos quando o container é recriado. Configure TLS e o domínio no proxy do servidor e faça backups regulares do SQLite.

## Checkout e ingressos

Os compradores escolhem o evento, setor e lote no próprio site. O backend calcula o total, cria a cobrança no PixVault e só emite os ingressos após confirmar o status e o valor da transação. Nenhum link de compra leva a uma plataforma de ingressos externa.

## Vercel

A publicação estática anterior na Vercel não oferece disco persistente para SQLite. Não publique o checkout como site estático. O frontend e o backend devem ser servidos pelo mesmo app Node ou por uma arquitetura com banco persistente configurado.
