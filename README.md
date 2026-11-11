# Site de evento

Projeto único com site, checkout próprio, API de pedidos e integração PixVault. Na publicação da Vercel, os pedidos e ingressos usam Cloud Firestore pelo Firebase Admin SDK. O frontend nunca acessa o Firestore diretamente.

## Produção na Vercel

O projeto Vercel usa `browser/site` como diretório raiz. As funções Node ficam em `browser/site/api/`; o checkout funciona em `/ingressos/` e usa `/api/checkout` para criar pedidos e consultar pagamentos.

Quando o Firebase do cliente estiver pronto:

1. Ative o banco Cloud Firestore padrão no projeto Firebase.
2. Crie uma conta de serviço exclusiva para o site e conceda a função IAM **Cloud Datastore User** (`roles/datastore.user`), que permite ler e gravar os pedidos.
3. Gere uma chave JSON para essa conta de serviço.
4. No projeto Vercel, adicione `FIREBASE_SERVICE_ACCOUNT_JSON` com o conteúdo JSON da chave como variável de ambiente protegida. Não coloque essa credencial no frontend, no Git ou em arquivos públicos.
5. Configure também `PIXVAULT_TOKEN`, `PIXVAULT_CLIENT_ID`, `PIXVAULT_API_URL` e, se a conta usar uma rota diferente para consulta, `PIXVAULT_STATUS_URL`.
6. Faça um novo deploy da `main`.

O endpoint `/api/health` mostra se as variáveis necessárias estão presentes e se o JSON da conta de serviço tem os campos esperados; ele não faz uma cobrança nem confirma a conexão remota. Enquanto faltar uma integração, `/api/checkout` não cria pedidos nem cobranças. Aplique `firestore.rules` ao projeto Firebase para bloquear acesso direto de clientes; a API acessa o banco pelo Admin SDK.

Para aplicar as regras com a CLI do Firebase, vincule o projeto criado pelo cliente (`firebase use --add`) e execute `firebase deploy --only firestore:rules` na raiz do repositório.

## Execução local ou em VPS

O servidor Node independente continua disponível para desenvolvimento e instalação em VPS e usa SQLite em `.data/orders.sqlite`. A publicação Vercel usa as funções Firestore descritas acima:

```powershell
npm start
```

Abra `http://localhost:3000`. Requer Node.js 22.13 ou mais recente.

Na VPS, use Docker Engine com Docker Compose:

```bash
cp .env.example .env
nano .env
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:3000/api/health
```

O volume `orders-data` guarda o SQLite fora do container. Não use `docker compose down -v`, pois esse comando apaga o banco. Configure domínio e HTTPS no proxy reverso da VPS antes de abrir o site ao público.

## Checkout e pagamentos

Os eventos, lotes, preços e taxas vêm de `browser/site/ingressos/eventos.json`. O backend recalcula o valor e valida os dados do comprador. A cobrança Pix é criada no PixVault; um ingresso só é emitido após confirmação do pagamento e conferência do valor total. A emissão é idempotente por pedido.

As credenciais do PixVault e do Firebase são sempre configuradas no ambiente servidor. Nunca faça uma cobrança real usando dados de teste sem confirmar antes que a conta PixVault esteja em modo de homologação.

## Arquivos de segurança do Firebase

As regras de `firestore.rules` negam acesso direto ao banco a partir do navegador. O Admin SDK usado pelas funções de backend autentica com a conta de serviço e não depende dessas regras; mantenha a credencial privada e restrita ao ambiente de produção.
