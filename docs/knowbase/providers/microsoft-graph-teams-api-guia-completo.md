# Guia Completo: Microsoft Graph API para Teams, Calendário, Email, Reuniões e Tarefas

**Versão:** Janeiro 2026  
**Escopo:** Integração completa com Microsoft 365 via API  
**Público:** Desenvolvedores e Arquitetos de Software

---

## Sumário

1. [Visão Geral e Arquitetura](#1-visão-geral-e-arquitetura)
2. [Configuração Inicial no Azure Portal](#2-configuração-inicial-no-azure-portal)
3. [App Registration - Passo a Passo](#3-app-registration---passo-a-passo)
4. [Credenciais e Segurança](#4-credenciais-e-segurança)
5. [Permissões e Escopos](#5-permissões-e-escopos)
6. [Fluxos de Autenticação OAuth 2.0](#6-fluxos-de-autenticação-oauth-20)
7. [Microsoft Graph API - Fundamentos](#7-microsoft-graph-api---fundamentos)
8. [Endpoints Detalhados por Serviço](#8-endpoints-detalhados-por-serviço)
9. [Webhooks e Change Notifications](#9-webhooks-e-change-notifications)
10. [Exemplos de Código Completos](#10-exemplos-de-código-completos)
11. [Jornadas de Uso e Fluxos Práticos](#11-jornadas-de-uso-e-fluxos-práticos)
12. [Testes e Debugging](#12-testes-e-debugging)
13. [Rate Limits e Throttling](#13-rate-limits-e-throttling)
14. [Boas Práticas e Padrões](#14-boas-práticas-e-padrões)
15. [Troubleshooting](#15-troubleshooting)
16. [Referências e Documentação Oficial](#16-referências-e-documentação-oficial)

---

## 1. Visão Geral e Arquitetura

### 1.1 O que é Microsoft Graph

Microsoft Graph é a API unificada que conecta todos os serviços Microsoft 365. Através de um único endpoint (`https://graph.microsoft.com`), você acessa:

| Serviço | Recursos Disponíveis |
|---------|---------------------|
| **Outlook** | Emails, Calendário, Contatos |
| **Teams** | Canais, Chats, Reuniões, Transcrições |
| **OneDrive/SharePoint** | Arquivos, Sites, Listas |
| **Planner** | Planos, Tarefas, Buckets |
| **To Do** | Listas de tarefas pessoais |
| **Azure AD/Entra ID** | Usuários, Grupos, Diretório |

### 1.2 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        Sua Aplicação                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS + OAuth 2.0 Bearer Token
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              Microsoft Graph API                                 │
│              https://graph.microsoft.com/v1.0                   │
│              https://graph.microsoft.com/beta                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌─────────┐    ┌─────────────┐    ┌──────────┐
│ Outlook │    │   Teams     │    │ Planner  │
│ Mail    │    │   Meetings  │    │ To Do    │
│Calendar │    │   Chat      │    │ Tasks    │
└─────────┘    └─────────────┘    └──────────┘
```

### 1.3 Versões da API

- **v1.0**: Produção, estável, recomendada para aplicações em produção
- **beta**: Preview, novas funcionalidades, pode mudar sem aviso

```
# Produção
https://graph.microsoft.com/v1.0/me/messages

# Beta (funcionalidades experimentais)
https://graph.microsoft.com/beta/me/messages
```

---

## 2. Configuração Inicial no Azure Portal

### 2.1 Pré-requisitos

- Conta Microsoft 365 (Business ou Enterprise)
- Acesso ao Azure Portal (https://portal.azure.com)
- Permissões de administrador ou Cloud Application Administrator
- Tenant ID do Microsoft Entra ID (antigo Azure AD)

### 2.2 Acessando o Microsoft Entra Admin Center

1. Acesse https://portal.azure.com
2. Pesquise por "Microsoft Entra ID" ou "Azure Active Directory"
3. No menu lateral, localize **App registrations**

**Alternativa:** Acesse diretamente https://entra.microsoft.com

### 2.3 Entendendo os Conceitos Fundamentais

| Conceito | Descrição |
|----------|-----------|
| **Tenant** | Instância dedicada do Azure AD para sua organização |
| **Application ID (Client ID)** | Identificador único da sua aplicação |
| **Directory ID (Tenant ID)** | Identificador do seu tenant Azure AD |
| **Client Secret** | Senha da aplicação (confidential clients) |
| **Certificate** | Alternativa mais segura ao client secret |
| **Redirect URI** | URL para onde o token é enviado após autenticação |

---

## 3. App Registration - Passo a Passo

### 3.1 Criando uma Nova App Registration

#### Passo 1: Iniciar Registro
1. No Microsoft Entra Admin Center, vá em **Identity > Applications > App registrations**
2. Clique em **+ New registration**

#### Passo 2: Configurar Informações Básicas

```
┌─────────────────────────────────────────────────────────────────┐
│ Register an application                                         │
├─────────────────────────────────────────────────────────────────┤
│ Name: [Grana.AI Teams Integration]                              │
│                                                                 │
│ Supported account types:                                        │
│ ○ Accounts in this organizational directory only (Single tenant)│
│ ○ Accounts in any organizational directory (Multitenant)        │
│ ○ Accounts in any org directory + personal Microsoft accounts   │
│ ○ Personal Microsoft accounts only                              │
│                                                                 │
│ Redirect URI (optional):                                        │
│ Platform: [Web ▼]  URI: [https://localhost:3000/auth/callback]  │
└─────────────────────────────────────────────────────────────────┘
```

**Recomendações por cenário:**

| Cenário | Tipo de Conta | Redirect URI |
|---------|---------------|--------------|
| App interna (SaaS B2B) | Single tenant | https://seudominio.com/callback |
| App multi-tenant | Multitenant | https://seudominio.com/callback |
| SPA (React/Vue) | Single tenant | http://localhost:3000 (dev) |
| Daemon/Backend | Single tenant | Não necessário |

#### Passo 3: Registrar e Anotar Credenciais

Após clicar em **Register**, anote:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID:   yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

### 3.2 Configurando Plataformas de Autenticação

Navegue para **Authentication** no menu lateral:

#### Para Web Applications:
```json
{
  "platform": "Web",
  "redirectUris": [
    "https://seuapp.com/auth/callback",
    "https://localhost:3000/auth/callback"
  ],
  "implicitGrantSettings": {
    "enableAccessTokenIssuance": false,
    "enableIdTokenIssuance": true
  }
}
```

#### Para Single Page Applications (SPA):
```json
{
  "platform": "SPA",
  "redirectUris": [
    "http://localhost:3000",
    "https://seuapp.com"
  ]
}
```

#### Para Mobile/Desktop:
```json
{
  "platform": "Mobile and desktop applications",
  "redirectUris": [
    "msauth://com.granai.app",
    "https://login.microsoftonline.com/common/oauth2/nativeclient"
  ]
}
```

### 3.3 Configurações Avançadas

#### Token Configuration
Navegue para **Token configuration** para adicionar claims opcionais:

```
Claims opcionais recomendadas:
├── ID Token
│   ├── email
│   ├── family_name
│   ├── given_name
│   └── upn
└── Access Token
    ├── email
    └── upn
```

---

## 4. Credenciais e Segurança

### 4.1 Client Secrets

#### Criando um Client Secret

1. Vá em **Certificates & secrets**
2. Clique em **+ New client secret**
3. Configure:
   - **Description**: Identificador descritivo (ex: "Produção 2026")
   - **Expires**: Selecione validade (6 meses, 12 meses, 24 meses, ou custom)

```
⚠️ IMPORTANTE: O valor do secret só é exibido UMA VEZ!
Copie e armazene de forma segura imediatamente.

Secret ID:    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
Value:        xXx~XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Expires:      01/15/2027
```

#### Boas Práticas para Secrets

```typescript
// ❌ NUNCA faça isso
const clientSecret = "xXx~XXXXXXXXXX";

// ✅ Use variáveis de ambiente
const clientSecret = process.env.AZURE_CLIENT_SECRET;

// ✅ Ou Azure Key Vault
import { SecretClient } from "@azure/keyvault-secrets";
const secret = await secretClient.getSecret("ms-graph-client-secret");
```

### 4.2 Certificados (Recomendado para Produção)

Certificados são mais seguros que client secrets.

#### Gerando um Certificado Auto-assinado

```bash
# Gerar chave privada e certificado
openssl req -x509 -newkey rsa:4096 \
  -keyout private-key.pem \
  -out certificate.pem \
  -days 365 \
  -nodes \
  -subj "/CN=GranaAI-Graph-Integration"

# Converter para formato PFX (necessário para alguns SDKs)
openssl pkcs12 -export \
  -out certificate.pfx \
  -inkey private-key.pem \
  -in certificate.pem
```

#### Upload do Certificado

1. Vá em **Certificates & secrets > Certificates**
2. Clique em **Upload certificate**
3. Selecione o arquivo `.pem` ou `.cer`

```
Após upload:
Thumbprint: AAAA1111BBBB2222CCCC3333DDDD4444EEEE5555
```

### 4.3 Federated Credentials (Workload Identity)

Para integrações com GitHub Actions, Kubernetes, ou outros:

```json
{
  "name": "github-actions-prod",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:granai/api:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}
```

---

## 5. Permissões e Escopos

### 5.1 Tipos de Permissões

| Tipo | Descrição | Uso |
|------|-----------|-----|
| **Delegated** | Atua em nome do usuário logado | Apps com interação do usuário |
| **Application** | Atua como a própria aplicação | Daemons, background jobs, APIs |

### 5.2 Permissões por Serviço

#### Email (Outlook Mail)

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `Mail.Read` | Delegated | Ler emails do usuário |
| `Mail.ReadWrite` | Delegated | Ler e enviar emails |
| `Mail.Send` | Delegated | Apenas enviar emails |
| `Mail.Read.All` | Application | Ler emails de todos os usuários |
| `Mail.ReadWrite.All` | Application | Ler/enviar emails de todos |

#### Calendário

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `Calendars.Read` | Delegated | Ler calendário do usuário |
| `Calendars.ReadWrite` | Delegated | Gerenciar calendário |
| `Calendars.Read.All` | Application | Ler calendários de todos |
| `Calendars.ReadWrite.All` | Application | Gerenciar todos os calendários |

#### Teams - Reuniões

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `OnlineMeetings.Read` | Delegated | Ler reuniões do usuário |
| `OnlineMeetings.ReadWrite` | Delegated | Criar/gerenciar reuniões |
| `OnlineMeetings.Read.All` | Application | Ler todas as reuniões |
| `OnlineMeetings.ReadWrite.All` | Application | Gerenciar todas as reuniões |

#### Teams - Transcrições

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `OnlineMeetingTranscript.Read.All` | Application | Ler todas as transcrições |
| `OnlineMeetingRecording.Read.All` | Application | Ler todas as gravações |
| `OnlineMeetingTranscript.Read.Chat` | RSC | Transcrições onde app está instalado |

#### Teams - Chat

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `Chat.Read` | Delegated | Ler chats do usuário |
| `Chat.ReadWrite` | Delegated | Ler e enviar mensagens |
| `Chat.Read.All` | Application | Ler todos os chats |
| `ChannelMessage.Read.All` | Application | Ler mensagens de canais |

#### Tarefas - Microsoft To Do

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `Tasks.Read` | Delegated | Ler tarefas do usuário |
| `Tasks.ReadWrite` | Delegated | Gerenciar tarefas |
| `Tasks.Read.All` | Application | Ler tarefas de todos |
| `Tasks.ReadWrite.All` | Application | Gerenciar todas as tarefas |

#### Tarefas - Planner

| Permissão | Tipo | Descrição |
|-----------|------|-----------|
| `Group.Read.All` | Delegated/App | Necessário para acessar planos |
| `Tasks.Read` | Delegated | Ler tarefas do Planner |
| `Tasks.ReadWrite` | Delegated | Gerenciar tarefas do Planner |

### 5.3 Adicionando Permissões

1. Vá em **API permissions**
2. Clique em **+ Add a permission**
3. Selecione **Microsoft Graph**
4. Escolha **Delegated** ou **Application permissions**
5. Selecione as permissões necessárias
6. Clique em **Add permissions**

### 5.4 Admin Consent

Algumas permissões requerem consentimento do administrador:

```
Endpoint de Admin Consent:
https://login.microsoftonline.com/{tenant}/adminconsent
  ?client_id={client_id}
  &redirect_uri={redirect_uri}
  &state={state}
```

Para conceder via portal:
1. Em **API permissions**, clique em **Grant admin consent for [Tenant]**
2. Confirme a operação

---

## 6. Fluxos de Autenticação OAuth 2.0

### 6.1 Authorization Code Flow (Aplicações Web)

O fluxo mais comum e seguro para aplicações web.

```
┌────────┐     ┌──────────────┐     ┌─────────────────┐
│ Usuário│     │ Sua App      │     │ Microsoft Entra │
└───┬────┘     └──────┬───────┘     └────────┬────────┘
    │                 │                       │
    │ 1. Clica Login  │                       │
    │────────────────>│                       │
    │                 │                       │
    │                 │ 2. Redirect /authorize│
    │<────────────────────────────────────────│
    │                 │                       │
    │ 3. Login + Consent                      │
    │────────────────────────────────────────>│
    │                 │                       │
    │                 │ 4. Authorization Code │
    │<────────────────────────────────────────│
    │                 │                       │
    │                 │ 5. POST /token        │
    │                 │──────────────────────>│
    │                 │                       │
    │                 │ 6. Access + Refresh   │
    │                 │<──────────────────────│
    │                 │                       │
```

#### Passo 1: Redirect para Autorização

```typescript
const authUrl = new URL('https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', 'https://seuapp.com/auth/callback');
authUrl.searchParams.set('scope', 'openid profile email Mail.Read Calendars.Read');
authUrl.searchParams.set('state', generateRandomState());
authUrl.searchParams.set('code_challenge', codeChallenge); // PKCE
authUrl.searchParams.set('code_challenge_method', 'S256');

// Redirecionar usuário
window.location.href = authUrl.toString();
```

#### Passo 2: Trocar Code por Token

```typescript
const tokenResponse = await fetch(
  `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: 'https://seuapp.com/auth/callback',
      grant_type: 'authorization_code',
      code_verifier: codeVerifier, // PKCE
    }),
  }
);

const tokens = await tokenResponse.json();
// {
//   access_token: "eyJ0eXAi...",
//   refresh_token: "0.AAAA...",
//   expires_in: 3600,
//   token_type: "Bearer",
//   scope: "Mail.Read Calendars.Read..."
// }
```

### 6.2 Client Credentials Flow (Daemon/Background)

Para aplicações sem interação do usuário.

```typescript
const tokenResponse = await fetch(
  `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  }
);

const { access_token } = await tokenResponse.json();
```

### 6.3 On-Behalf-Of Flow (APIs)

Para quando sua API precisa chamar Microsoft Graph em nome do usuário.

```typescript
const tokenResponse = await fetch(
  `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      assertion: userAccessToken, // Token recebido do cliente
      scope: 'https://graph.microsoft.com/Mail.Read',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      requested_token_use: 'on_behalf_of',
    }),
  }
);
```

### 6.4 Usando MSAL (Microsoft Authentication Library)

#### Instalação

```bash
# Node.js
npm install @azure/msal-node

# Browser
npm install @azure/msal-browser

# React
npm install @azure/msal-react @azure/msal-browser
```

#### Exemplo com MSAL Node (Confidential Client)

```typescript
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Client Credentials
async function getAppToken() {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return result?.accessToken;
}

// Authorization Code
async function getTokenFromCode(code: string) {
  const result = await cca.acquireTokenByCode({
    code,
    scopes: ['Mail.Read', 'Calendars.Read'],
    redirectUri: 'https://seuapp.com/auth/callback',
  });
  return result;
}
```

#### Exemplo com MSAL React

```tsx
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'seu-client-id',
    authority: 'https://login.microsoftonline.com/seu-tenant-id',
    redirectUri: 'http://localhost:3000',
  },
};

const pca = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={pca}>
      <MainContent />
    </MsalProvider>
  );
}

function MainContent() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const login = async () => {
    await instance.loginPopup({
      scopes: ['Mail.Read', 'Calendars.Read'],
    });
  };

  const getToken = async () => {
    const response = await instance.acquireTokenSilent({
      scopes: ['Mail.Read'],
      account: accounts[0],
    });
    return response.accessToken;
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={getToken}>Buscar Emails</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

---

## 7. Microsoft Graph API - Fundamentos

### 7.1 Estrutura das Requisições

```
https://graph.microsoft.com/{version}/{resource}?{query-parameters}

Exemplos:
https://graph.microsoft.com/v1.0/me
https://graph.microsoft.com/v1.0/users/{user-id}/messages
https://graph.microsoft.com/v1.0/me/events?$top=10
```

### 7.2 Headers Obrigatórios

```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
};
```

### 7.3 Query Parameters (OData)

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `$select` | Campos a retornar | `$select=subject,from` |
| `$filter` | Filtrar resultados | `$filter=isRead eq false` |
| `$orderby` | Ordenar resultados | `$orderby=receivedDateTime desc` |
| `$top` | Limitar quantidade | `$top=25` |
| `$skip` | Pular registros | `$skip=10` |
| `$count` | Retornar contagem | `$count=true` |
| `$expand` | Expandir relacionamentos | `$expand=attachments` |
| `$search` | Busca textual | `$search="projeto"` |

### 7.4 Paginação

```typescript
interface GraphResponse<T> {
  '@odata.context': string;
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
  value: T[];
}

async function getAllMessages(accessToken: string): Promise<Message[]> {
  const allMessages: Message[] = [];
  let url = 'https://graph.microsoft.com/v1.0/me/messages?$top=50';

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data: GraphResponse<Message> = await response.json();
    
    allMessages.push(...data.value);
    url = data['@odata.nextLink'] || '';
  }

  return allMessages;
}
```

### 7.5 Batching (Múltiplas Requisições)

```typescript
const batchRequest = {
  requests: [
    {
      id: '1',
      method: 'GET',
      url: '/me/messages?$top=5',
    },
    {
      id: '2',
      method: 'GET',
      url: '/me/events?$top=5',
    },
    {
      id: '3',
      method: 'GET',
      url: '/me/contacts?$top=5',
    },
  ],
};

const response = await fetch('https://graph.microsoft.com/v1.0/$batch', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(batchRequest),
});

const batchResponse = await response.json();
// batchResponse.responses contém array com resultados de cada request
```

---

## 8. Endpoints Detalhados por Serviço

### 8.1 Email (Outlook Mail)

#### Listar Emails

```http
GET /me/messages
GET /me/messages?$filter=isRead eq false
GET /me/messages?$search="projeto grana"
GET /me/messages?$select=subject,from,receivedDateTime&$top=25
```

```typescript
interface Message {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { contentType: string; content: string };
  from: { emailAddress: { name: string; address: string } };
  toRecipients: Array<{ emailAddress: { name: string; address: string } }>;
  receivedDateTime: string;
  isRead: boolean;
  hasAttachments: boolean;
}

async function getUnreadEmails(token: string) {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/messages?' +
    '$filter=isRead eq false&' +
    '$select=id,subject,from,receivedDateTime,bodyPreview&' +
    '$orderby=receivedDateTime desc&' +
    '$top=50',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Enviar Email

```http
POST /me/sendMail
```

```typescript
async function sendEmail(token: string, to: string, subject: string, body: string) {
  const message = {
    message: {
      subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      toRecipients: [
        { emailAddress: { address: to } },
      ],
    },
    saveToSentItems: true,
  };

  await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
```

#### Acessar Pastas

```http
GET /me/mailFolders
GET /me/mailFolders/{folder-id}/messages
GET /me/mailFolders/inbox/messages
GET /me/mailFolders/sentitems/messages
```

#### Attachments

```http
GET /me/messages/{message-id}/attachments
GET /me/messages/{message-id}/attachments/{attachment-id}/$value
```

### 8.2 Calendário

#### Listar Eventos

```http
GET /me/events
GET /me/calendar/events
GET /me/calendarView?startDateTime={start}&endDateTime={end}
```

```typescript
interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location: { displayName: string };
  attendees: Array<{
    emailAddress: { name: string; address: string };
    status: { response: string };
  }>;
  isOnlineMeeting: boolean;
  onlineMeetingUrl?: string;
  onlineMeeting?: {
    joinUrl: string;
  };
}

async function getWeekEvents(token: string) {
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?` +
    `startDateTime=${now.toISOString()}&` +
    `endDateTime=${weekLater.toISOString()}&` +
    `$select=subject,start,end,location,isOnlineMeeting,onlineMeetingUrl&` +
    `$orderby=start/dateTime`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Criar Evento

```http
POST /me/events
```

```typescript
async function createEvent(token: string, event: Partial<CalendarEvent>) {
  const newEvent = {
    subject: event.subject,
    start: {
      dateTime: event.start?.dateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: event.end?.dateTime,
      timeZone: 'America/Sao_Paulo',
    },
    location: {
      displayName: event.location?.displayName,
    },
    attendees: event.attendees,
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
  };

  const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  });
  return response.json();
}
```

#### Criar Evento com Reunião Teams Automaticamente

```typescript
const eventWithTeams = {
  subject: "Reunião de Projeto",
  start: {
    dateTime: "2026-01-20T14:00:00",
    timeZone: "America/Sao_Paulo"
  },
  end: {
    dateTime: "2026-01-20T15:00:00",
    timeZone: "America/Sao_Paulo"
  },
  attendees: [
    {
      emailAddress: { address: "participante@empresa.com" },
      type: "required"
    }
  ],
  isOnlineMeeting: true,
  onlineMeetingProvider: "teamsForBusiness"
};
// O response incluirá onlineMeeting.joinUrl
```

### 8.3 Teams - Reuniões Online

#### Criar Reunião Avulsa

```http
POST /me/onlineMeetings
```

```typescript
interface OnlineMeeting {
  id: string;
  joinUrl: string;
  joinWebUrl: string;
  subject: string;
  startDateTime: string;
  endDateTime: string;
  videoTeleconferenceId: string;
  chatInfo: {
    threadId: string;
    messageId: string;
  };
  audioConferencing?: {
    dialinUrl: string;
    tollNumber: string;
    tollFreeNumber: string;
  };
}

async function createMeeting(token: string, subject: string, start: Date, end: Date) {
  const meeting = {
    subject,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    participants: {
      attendees: [
        {
          upn: 'participante@empresa.com',
          role: 'attendee',
        },
      ],
    },
    lobbyBypassSettings: {
      scope: 'organization',
      isDialInBypassEnabled: true,
    },
  };

  const response = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meeting),
  });
  return response.json();
}
```

#### Listar Reuniões

```http
GET /me/onlineMeetings
GET /me/onlineMeetings/{meeting-id}
GET /me/onlineMeetings?$filter=JoinWebUrl eq '{joinUrl}'
```

#### Obter Reunião por JoinURL

```typescript
async function getMeetingByJoinUrl(token: string, joinUrl: string) {
  const encoded = encodeURIComponent(joinUrl);
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl eq '${encoded}'`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

### 8.4 Teams - Transcrições e Gravações

> **⚠️ APIs Metered**: As APIs de transcrição e gravação são cobradas por uso.

#### Listar Transcrições de uma Reunião

```http
GET /me/onlineMeetings/{meetingId}/transcripts
GET /users/{userId}/onlineMeetings/{meetingId}/transcripts
```

```typescript
interface CallTranscript {
  id: string;
  meetingId: string;
  callId: string;
  createdDateTime: string;
  endDateTime: string;
  transcriptContentUrl: string;
  contentCorrelationId: string;
  meetingOrganizer: {
    user: { id: string; displayName: string };
  };
}

async function getTranscripts(token: string, userId: string, meetingId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${userId}/onlineMeetings/${meetingId}/transcripts`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Baixar Conteúdo da Transcrição

```http
GET /me/onlineMeetings/{meetingId}/transcripts/{transcriptId}/content
GET /me/onlineMeetings/{meetingId}/transcripts/{transcriptId}/content?$format=text/vtt
GET /me/onlineMeetings/{meetingId}/transcripts/{transcriptId}/content?$format=application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

```typescript
async function downloadTranscript(
  token: string, 
  meetingId: string, 
  transcriptId: string,
  format: 'vtt' | 'docx' = 'vtt'
) {
  const formatParam = format === 'docx' 
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : 'text/vtt';

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}/transcripts/${transcriptId}/content?$format=${formatParam}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  if (format === 'vtt') {
    return response.text();
  }
  return response.blob();
}
```

#### Formato VTT da Transcrição

```vtt
WEBVTT

00:00:03.663 --> 00:00:07.903
{"startDateTime":"2026-01-10T14:03:46.639Z","endDateTime":"2026-01-10T14:03:50.879Z","speakerName":"João Silva","spokenText":"Bom dia a todos, vamos começar a reunião.","spokenLanguage":"pt-br"}

00:00:08.063 --> 00:00:12.103
{"startDateTime":"2026-01-10T14:03:51.039Z","endDateTime":"2026-01-10T14:03:55.079Z","speakerName":"Maria Santos","spokenText":"Bom dia! Prontos para discutir o projeto.","spokenLanguage":"pt-br"}
```

#### Listar Gravações

```http
GET /me/onlineMeetings/{meetingId}/recordings
GET /me/onlineMeetings/{meetingId}/recordings/{recordingId}/content
```

```typescript
async function downloadRecording(token: string, meetingId: string, recordingId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}/recordings/${recordingId}/content`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.blob(); // Arquivo MP4
}
```

#### AI Insights (Meeting Notes Automáticas)

```http
GET /copilot/users/{userId}/onlineMeetings/{meetingId}/aiInsights
GET /copilot/users/{userId}/onlineMeetings/{meetingId}/aiInsights/{aiInsightId}
```

```typescript
interface MeetingAIInsight {
  id: string;
  callId: string;
  createdDateTime: string;
  meetingNotes: Array<{
    title: string;
    text: string;
    subpoints?: Array<{ title: string; text: string }>;
  }>;
  actionItems: Array<{
    title: string;
    text: string;
    ownerDisplayName: string;
  }>;
}
```

### 8.5 Teams - Chat e Canais

#### Listar Chats do Usuário

```http
GET /me/chats
GET /me/chats/{chat-id}/messages
```

```typescript
interface Chat {
  id: string;
  topic: string;
  chatType: 'oneOnOne' | 'group' | 'meeting';
  createdDateTime: string;
  lastUpdatedDateTime: string;
  members: Array<{
    displayName: string;
    userId: string;
  }>;
}

async function getChats(token: string) {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/chats?$expand=members',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Enviar Mensagem no Chat

```http
POST /me/chats/{chat-id}/messages
```

```typescript
async function sendChatMessage(token: string, chatId: string, content: string) {
  const message = {
    body: {
      contentType: 'html',
      content: `<p>${content}</p>`,
    },
  };

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/chats/${chatId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  );
  return response.json();
}
```

#### Listar Teams e Canais

```http
GET /me/joinedTeams
GET /teams/{team-id}/channels
GET /teams/{team-id}/channels/{channel-id}/messages
```

### 8.6 Microsoft To Do

#### Listar Listas de Tarefas

```http
GET /me/todo/lists
GET /me/todo/lists/{list-id}/tasks
```

```typescript
interface TodoTaskList {
  id: string;
  displayName: string;
  isOwner: boolean;
  isShared: boolean;
  wellknownListName: 'none' | 'defaultList' | 'flaggedEmails' | 'unknownFutureValue';
}

interface TodoTask {
  id: string;
  title: string;
  body: { content: string; contentType: string };
  importance: 'low' | 'normal' | 'high';
  status: 'notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred';
  dueDateTime?: { dateTime: string; timeZone: string };
  reminderDateTime?: { dateTime: string; timeZone: string };
  completedDateTime?: { dateTime: string; timeZone: string };
  createdDateTime: string;
  lastModifiedDateTime: string;
  isReminderOn: boolean;
}

async function getTodoLists(token: string) {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/todo/lists',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}

async function getTasksFromList(token: string, listId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Criar Tarefa

```http
POST /me/todo/lists/{list-id}/tasks
```

```typescript
async function createTodoTask(
  token: string, 
  listId: string, 
  title: string, 
  dueDate?: Date
) {
  const task: Partial<TodoTask> = {
    title,
    importance: 'normal',
  };

  if (dueDate) {
    task.dueDateTime = {
      dateTime: dueDate.toISOString().split('T')[0] + 'T00:00:00',
      timeZone: 'America/Sao_Paulo',
    };
  }

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    }
  );
  return response.json();
}
```

#### Atualizar Tarefa

```http
PATCH /me/todo/lists/{list-id}/tasks/{task-id}
```

```typescript
async function completeTask(token: string, listId: string, taskId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'completed',
        completedDateTime: {
          dateTime: new Date().toISOString(),
          timeZone: 'UTC',
        },
      }),
    }
  );
  return response.json();
}
```

### 8.7 Planner

> **Nota**: Planner Basic é suportado pela Graph API. Planner Premium usa Dataverse.

#### Listar Planos de um Grupo

```http
GET /groups/{group-id}/planner/plans
GET /me/planner/plans
```

```typescript
interface PlannerPlan {
  id: string;
  title: string;
  createdDateTime: string;
  owner: string; // Group ID
  createdBy: { user: { id: string } };
}

async function getGroupPlans(token: string, groupId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/groups/${groupId}/planner/plans`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Listar Tarefas do Planner

```http
GET /planner/plans/{plan-id}/tasks
GET /me/planner/tasks
```

```typescript
interface PlannerTask {
  id: string;
  planId: string;
  bucketId: string;
  title: string;
  percentComplete: number;
  priority: number; // 0-10, menor = mais urgente
  startDateTime?: string;
  dueDateTime?: string;
  completedDateTime?: string;
  assignments: {
    [userId: string]: {
      assignedBy: { user: { id: string } };
      assignedDateTime: string;
      orderHint: string;
    };
  };
  createdDateTime: string;
}

async function getPlanTasks(token: string, planId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/planner/plans/${planId}/tasks`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.json();
}
```

#### Criar Tarefa no Planner

```http
POST /planner/tasks
```

```typescript
async function createPlannerTask(
  token: string,
  planId: string,
  bucketId: string,
  title: string,
  assignTo?: string
) {
  const task: any = {
    planId,
    bucketId,
    title,
  };

  if (assignTo) {
    task.assignments = {
      [assignTo]: {
        '@odata.type': '#microsoft.graph.plannerAssignment',
        orderHint: ' !',
      },
    };
  }

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/planner/tasks',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    }
  );
  return response.json();
}
```

#### Atualizar Tarefa (Requer ETag)

```http
PATCH /planner/tasks/{task-id}
```

```typescript
async function updatePlannerTask(
  token: string,
  taskId: string,
  updates: Partial<PlannerTask>,
  etag: string
) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/planner/tasks/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'If-Match': etag, // OBRIGATÓRIO
      },
      body: JSON.stringify(updates),
    }
  );
  return response.json();
}
```

#### Listar Buckets

```http
GET /planner/plans/{plan-id}/buckets
```

---

## 9. Webhooks e Change Notifications

### 9.1 Conceito

Webhooks permitem receber notificações em tempo real quando recursos mudam.

### 9.2 Criando uma Subscription

```http
POST /subscriptions
```

```typescript
interface Subscription {
  changeType: 'created' | 'updated' | 'deleted';
  notificationUrl: string;
  resource: string;
  expirationDateTime: string;
  clientState?: string;
  latestSupportedTlsVersion?: string;
}

async function createMailSubscription(token: string) {
  const subscription = {
    changeType: 'created',
    notificationUrl: 'https://seuapp.com/webhooks/mail',
    resource: '/me/messages',
    expirationDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
    clientState: 'secretClientState',
  };

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/subscriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    }
  );
  return response.json();
}
```

### 9.3 Resources Suportados

| Resource | Change Types |
|----------|--------------|
| `/me/messages` | created, updated, deleted |
| `/me/events` | created, updated, deleted |
| `/me/contacts` | created, updated, deleted |
| `/teams/{id}/channels/{id}/messages` | created, updated |
| `/communications/callRecords` | created |
| `/users/{id}/onlineMeetings/getAllTranscripts` | created |
| `/users/{id}/onlineMeetings/getAllRecordings` | created |

### 9.4 Subscription para Transcrições

```typescript
async function subscribeToTranscripts(token: string, userId: string) {
  const subscription = {
    changeType: 'created',
    notificationUrl: 'https://seuapp.com/webhooks/transcripts',
    resource: `/users/${userId}/onlineMeetings/getAllTranscripts`,
    expirationDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora
    clientState: 'transcriptSecret',
    includeResourceData: true, // Inclui dados do recurso na notificação
    encryptionCertificate: '...', // Necessário para includeResourceData
    encryptionCertificateId: 'cert-id',
  };

  // Para subscriptions > 1 hora, adicionar lifecycleNotificationUrl
  if (/* expiração > 1 hora */) {
    subscription.lifecycleNotificationUrl = 'https://seuapp.com/webhooks/lifecycle';
  }

  return fetch('https://graph.microsoft.com/v1.0/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
}
```

### 9.5 Validação do Webhook Endpoint

Quando você cria uma subscription, o Graph envia uma requisição de validação:

```typescript
// Endpoint: POST /webhooks/mail
app.post('/webhooks/mail', (req, res) => {
  // Validação inicial
  if (req.query.validationToken) {
    res.setHeader('Content-Type', 'text/plain');
    return res.send(req.query.validationToken);
  }

  // Processar notificações
  const notifications = req.body.value;
  for (const notification of notifications) {
    // Verificar clientState
    if (notification.clientState !== 'secretClientState') {
      continue; // Ignorar notificações inválidas
    }

    console.log('Novo email:', notification.resourceData);
    // Processar...
  }

  res.sendStatus(202);
});
```

### 9.6 Renovar Subscription

```http
PATCH /subscriptions/{subscription-id}
```

```typescript
async function renewSubscription(token: string, subscriptionId: string) {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/subscriptions/${subscriptionId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expirationDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    }
  );
  return response.json();
}
```

---

## 10. Exemplos de Código Completos

### 10.1 Cliente Microsoft Graph com TypeScript

```typescript
// graph-client.ts
import { ConfidentialClientApplication } from '@azure/msal-node';

interface GraphConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export class GraphClient {
  private msal: ConfidentialClientApplication;
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  constructor(config: GraphConfig) {
    this.msal = new ConfidentialClientApplication({
      auth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
      },
    });
  }

  private async getToken(): Promise<string> {
    const result = await this.msal.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });
    if (!result?.accessToken) {
      throw new Error('Failed to acquire token');
    }
    return result.accessToken;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: object,
    headers?: Record<string, string>
  ): Promise<T> {
    const token = await this.getToken();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Graph API Error: ${error.error?.message || response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Helper methods
  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, body: object) {
    return this.request<T>('POST', endpoint, body);
  }

  patch<T>(endpoint: string, body: object, etag?: string) {
    const headers = etag ? { 'If-Match': etag } : {};
    return this.request<T>('PATCH', endpoint, body, headers);
  }

  delete(endpoint: string) {
    return this.request<void>('DELETE', endpoint);
  }

  // Pagination helper
  async getAllPages<T>(endpoint: string): Promise<T[]> {
    const results: T[] = [];
    let url: string | null = endpoint;

    while (url) {
      const response = await this.get<{ value: T[]; '@odata.nextLink'?: string }>(url);
      results.push(...response.value);
      
      const nextLink = response['@odata.nextLink'];
      url = nextLink ? nextLink.replace(this.baseUrl, '') : null;
    }

    return results;
  }
}
```

### 10.2 Serviço de Email

```typescript
// email-service.ts
import { GraphClient } from './graph-client';

interface EmailMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
  isRead: boolean;
}

export class EmailService {
  constructor(private graph: GraphClient) {}

  async getInbox(userId: string, top = 25): Promise<EmailMessage[]> {
    const response = await this.graph.get<{ value: EmailMessage[] }>(
      `/users/${userId}/messages?` +
      `$select=id,subject,bodyPreview,from,receivedDateTime,isRead&` +
      `$orderby=receivedDateTime desc&` +
      `$top=${top}`
    );
    return response.value;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const response = await this.graph.get<{ '@odata.count': number }>(
      `/users/${userId}/messages?$filter=isRead eq false&$count=true&$top=1`
    );
    return response['@odata.count'];
  }

  async sendEmail(
    userId: string,
    to: string[],
    subject: string,
    body: string,
    isHtml = true
  ): Promise<void> {
    await this.graph.post(`/users/${userId}/sendMail`, {
      message: {
        subject,
        body: {
          contentType: isHtml ? 'HTML' : 'Text',
          content: body,
        },
        toRecipients: to.map(address => ({
          emailAddress: { address },
        })),
      },
      saveToSentItems: true,
    });
  }

  async markAsRead(userId: string, messageId: string): Promise<void> {
    await this.graph.patch(`/users/${userId}/messages/${messageId}`, {
      isRead: true,
    });
  }
}
```

### 10.3 Serviço de Reuniões

```typescript
// meeting-service.ts
import { GraphClient } from './graph-client';

interface OnlineMeeting {
  id: string;
  subject: string;
  joinWebUrl: string;
  startDateTime: string;
  endDateTime: string;
}

interface Transcript {
  id: string;
  createdDateTime: string;
  transcriptContentUrl: string;
}

export class MeetingService {
  constructor(private graph: GraphClient) {}

  async createMeeting(
    userId: string,
    subject: string,
    start: Date,
    end: Date,
    attendees: string[] = []
  ): Promise<OnlineMeeting> {
    return this.graph.post<OnlineMeeting>(`/users/${userId}/onlineMeetings`, {
      subject,
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      participants: {
        attendees: attendees.map(email => ({
          upn: email,
          role: 'attendee',
        })),
      },
    });
  }

  async getMeetingByJoinUrl(userId: string, joinUrl: string): Promise<OnlineMeeting | null> {
    const encoded = encodeURIComponent(joinUrl);
    const response = await this.graph.get<{ value: OnlineMeeting[] }>(
      `/users/${userId}/onlineMeetings?$filter=JoinWebUrl eq '${encoded}'`
    );
    return response.value[0] || null;
  }

  async getTranscripts(userId: string, meetingId: string): Promise<Transcript[]> {
    const response = await this.graph.get<{ value: Transcript[] }>(
      `/users/${userId}/onlineMeetings/${meetingId}/transcripts`
    );
    return response.value;
  }

  async downloadTranscript(
    userId: string,
    meetingId: string,
    transcriptId: string
  ): Promise<string> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/onlineMeetings/${meetingId}/transcripts/${transcriptId}/content`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.text();
  }

  private async getAccessToken(): Promise<string> {
    // Implementar lógica para obter token
    return '';
  }
}
```

### 10.4 Serviço de Tarefas

```typescript
// task-service.ts
import { GraphClient } from './graph-client';

interface TodoList {
  id: string;
  displayName: string;
}

interface TodoTask {
  id: string;
  title: string;
  status: string;
  importance: string;
  dueDateTime?: { dateTime: string; timeZone: string };
}

interface PlannerTask {
  id: string;
  title: string;
  percentComplete: number;
  '@odata.etag': string;
}

export class TaskService {
  constructor(private graph: GraphClient) {}

  // Microsoft To Do
  async getTodoLists(userId: string): Promise<TodoList[]> {
    const response = await this.graph.get<{ value: TodoList[] }>(
      `/users/${userId}/todo/lists`
    );
    return response.value;
  }

  async getTodoTasks(userId: string, listId: string): Promise<TodoTask[]> {
    const response = await this.graph.get<{ value: TodoTask[] }>(
      `/users/${userId}/todo/lists/${listId}/tasks`
    );
    return response.value;
  }

  async createTodoTask(
    userId: string,
    listId: string,
    title: string,
    dueDate?: Date
  ): Promise<TodoTask> {
    const task: any = { title };
    if (dueDate) {
      task.dueDateTime = {
        dateTime: dueDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      };
    }
    return this.graph.post<TodoTask>(
      `/users/${userId}/todo/lists/${listId}/tasks`,
      task
    );
  }

  // Planner
  async getPlannerTasks(planId: string): Promise<PlannerTask[]> {
    const response = await this.graph.get<{ value: PlannerTask[] }>(
      `/planner/plans/${planId}/tasks`
    );
    return response.value;
  }

  async updatePlannerTask(
    taskId: string,
    updates: Partial<PlannerTask>,
    etag: string
  ): Promise<void> {
    await this.graph.patch(`/planner/tasks/${taskId}`, updates, etag);
  }

  async completePlannerTask(taskId: string, etag: string): Promise<void> {
    await this.updatePlannerTask(taskId, { percentComplete: 100 }, etag);
  }
}
```

### 10.5 Exemplo Completo com Fastify

```typescript
// server.ts
import Fastify from 'fastify';
import { GraphClient } from './graph-client';
import { EmailService } from './email-service';
import { MeetingService } from './meeting-service';
import { TaskService } from './task-service';

const fastify = Fastify({ logger: true });

// Inicializar clientes
const graphClient = new GraphClient({
  clientId: process.env.AZURE_CLIENT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
  tenantId: process.env.AZURE_TENANT_ID!,
});

const emailService = new EmailService(graphClient);
const meetingService = new MeetingService(graphClient);
const taskService = new TaskService(graphClient);

// Routes
fastify.get('/api/users/:userId/emails', async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const emails = await emailService.getInbox(userId);
  return { emails };
});

fastify.post('/api/users/:userId/emails', async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const { to, subject, body } = request.body as any;
  await emailService.sendEmail(userId, to, subject, body);
  return { success: true };
});

fastify.post('/api/users/:userId/meetings', async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const { subject, start, end, attendees } = request.body as any;
  const meeting = await meetingService.createMeeting(
    userId,
    subject,
    new Date(start),
    new Date(end),
    attendees
  );
  return meeting;
});

fastify.get('/api/users/:userId/meetings/:meetingId/transcripts', async (request, reply) => {
  const { userId, meetingId } = request.params as { userId: string; meetingId: string };
  const transcripts = await meetingService.getTranscripts(userId, meetingId);
  return { transcripts };
});

fastify.get('/api/users/:userId/todo/lists', async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const lists = await taskService.getTodoLists(userId);
  return { lists };
});

// Webhook endpoint
fastify.post('/webhooks/graph', async (request, reply) => {
  // Validação
  const validationToken = (request.query as any).validationToken;
  if (validationToken) {
    reply.type('text/plain').send(validationToken);
    return;
  }

  // Processar notificações
  const { value: notifications } = request.body as any;
  for (const notification of notifications) {
    fastify.log.info({
      changeType: notification.changeType,
      resource: notification.resource,
    });
    // Processar cada notificação...
  }

  reply.code(202).send();
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

---

## 11. Jornadas de Uso e Fluxos Práticos

### 11.1 Jornada: Integração de Email no CRM

```
1. Usuário conecta conta Microsoft
   └── OAuth Authorization Code Flow

2. App sincroniza emails
   ├── GET /me/messages (inicial)
   └── Webhook para novos emails

3. Usuário responde pelo CRM
   └── POST /me/sendMail

4. Emails são categorizados
   └── PATCH /me/messages/{id} (categorias/labels)
```

### 11.2 Jornada: Bot de Reuniões

```
1. Usuário agenda reunião via bot
   ├── POST /me/events (cria evento com Teams)
   └── Retorna joinUrl

2. Após reunião
   ├── Webhook notifica fim
   ├── GET /onlineMeetings/{id}/transcripts
   └── Download e processamento com IA

3. Bot envia resumo
   └── POST /me/sendMail (resumo para participantes)
```

### 11.3 Jornada: Gestão de Tarefas Unificada

```
1. App lista todas as tarefas do usuário
   ├── GET /me/todo/lists + tasks (To Do pessoal)
   └── GET /me/planner/tasks (Planner do time)

2. Criação unificada
   ├── POST /me/todo/lists/{id}/tasks (pessoal)
   └── POST /planner/tasks (time)

3. Sincronização bidirecional
   └── Webhooks para ambos os serviços
```

### 11.4 Jornada: Automação de Notas de Reunião

```typescript
// Fluxo completo de automação

async function processCompletedMeeting(meetingId: string, userId: string) {
  // 1. Buscar transcrição
  const transcripts = await meetingService.getTranscripts(userId, meetingId);
  
  if (transcripts.length === 0) {
    console.log('Transcrição ainda não disponível');
    return;
  }

  // 2. Download da transcrição
  const vttContent = await meetingService.downloadTranscript(
    userId,
    meetingId,
    transcripts[0].id
  );

  // 3. Processar com IA (ex: OpenAI)
  const summary = await processWithAI(vttContent);

  // 4. Criar tarefa para cada action item
  for (const actionItem of summary.actionItems) {
    await taskService.createTodoTask(
      userId,
      'default', // ou lista específica
      actionItem.title,
      actionItem.dueDate
    );
  }

  // 5. Enviar email com resumo
  await emailService.sendEmail(
    userId,
    summary.attendees,
    `Resumo: ${summary.meetingTitle}`,
    generateSummaryHTML(summary)
  );
}
```

---

## 12. Testes e Debugging

### 12.1 Graph Explorer

O **Graph Explorer** é a ferramenta oficial para testar endpoints:

- URL: https://developer.microsoft.com/graph/graph-explorer
- Permite login com conta real
- Testa requests com diferentes permissões
- Mostra exemplos de código

### 12.2 Postman Collection

Microsoft oferece uma collection oficial para Postman:

1. Importe: `https://www.postman.com/microsoftgraph`
2. Configure variáveis de ambiente:
   ```
   client_id: seu-client-id
   client_secret: seu-secret
   tenant_id: seu-tenant
   ```

### 12.3 Debugging de Tokens

```typescript
// Decodificar JWT para debug
function decodeToken(token: string) {
  const parts = token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  
  console.log('Token Claims:', {
    aud: payload.aud, // Audience
    iss: payload.iss, // Issuer
    app_displayname: payload.app_displayname,
    roles: payload.roles, // Application permissions
    scp: payload.scp, // Delegated permissions (scope)
    exp: new Date(payload.exp * 1000), // Expiration
  });
  
  return payload;
}
```

### 12.4 Logs e Monitoramento

```typescript
// Middleware de logging para Graph requests
async function loggedRequest<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    console.log({
      operation,
      duration: Date.now() - start,
      status: 'success',
    });
    return result;
  } catch (error) {
    console.error({
      operation,
      duration: Date.now() - start,
      status: 'error',
      error: error.message,
    });
    throw error;
  }
}

// Uso
const emails = await loggedRequest('getInbox', () => 
  emailService.getInbox(userId)
);
```

### 12.5 Testes Unitários

```typescript
// email-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { EmailService } from './email-service';

describe('EmailService', () => {
  const mockGraphClient = {
    get: vi.fn(),
    post: vi.fn(),
  };

  const emailService = new EmailService(mockGraphClient as any);

  it('should fetch inbox emails', async () => {
    mockGraphClient.get.mockResolvedValue({
      value: [
        { id: '1', subject: 'Test', isRead: false },
      ],
    });

    const emails = await emailService.getInbox('user-id');
    
    expect(emails).toHaveLength(1);
    expect(mockGraphClient.get).toHaveBeenCalledWith(
      expect.stringContaining('/users/user-id/messages')
    );
  });

  it('should send email correctly', async () => {
    mockGraphClient.post.mockResolvedValue({});

    await emailService.sendEmail(
      'user-id',
      ['to@example.com'],
      'Subject',
      '<p>Body</p>'
    );

    expect(mockGraphClient.post).toHaveBeenCalledWith(
      '/users/user-id/sendMail',
      expect.objectContaining({
        message: expect.objectContaining({
          subject: 'Subject',
        }),
      })
    );
  });
});
```

---

## 13. Rate Limits e Throttling

### 13.1 Limites Gerais

| Recurso | Limite |
|---------|--------|
| Requests por app por tenant | 10.000/10 segundos |
| Requests por usuário | 10.000/10 minutos |
| Concurrent requests | 4 simultâneas |
| Mailbox operations | 4/segundo |
| Teams messages | 1/segundo por canal |

### 13.2 Identificando Throttling

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

### 13.3 Implementando Retry com Backoff

```typescript
async function requestWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error.status === 429) {
        const retryAfter = parseInt(error.headers?.['retry-after'] || '30', 10);
        const delay = retryAfter * 1000 * Math.pow(2, attempt);
        
        console.log(`Rate limited. Waiting ${delay}ms before retry ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (error.status >= 500) {
        // Server error, retry with backoff
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry client errors
      }
    }
  }
  
  throw lastError!;
}
```

### 13.4 Batching para Reduzir Requests

```typescript
// Em vez de N requests individuais
for (const userId of userIds) {
  await graphClient.get(`/users/${userId}/messages`);
}

// Use batching
const batchRequests = userIds.map((userId, index) => ({
  id: String(index + 1),
  method: 'GET',
  url: `/users/${userId}/messages?$top=5`,
}));

const response = await graphClient.post('/$batch', {
  requests: batchRequests.slice(0, 20), // Máximo 20 por batch
});
```

---

## 14. Boas Práticas e Padrões

### 14.1 Segurança

```typescript
// ✅ Use sempre HTTPS
// ✅ Valide tokens no servidor
// ✅ Implemente refresh token rotation
// ✅ Use certificate auth em produção
// ✅ Armazene secrets em Key Vault
// ✅ Implemente logging de auditoria
// ❌ Nunca exponha client_secret no frontend
// ❌ Nunca logue access tokens completos
```

### 14.2 Performance

```typescript
// ✅ Use $select para limitar campos
const response = await fetch(
  '/me/messages?$select=id,subject,from&$top=25'
);

// ✅ Use $expand em vez de múltiplas requests
const response = await fetch(
  '/me/messages/{id}?$expand=attachments'
);

// ✅ Implemente cache
const cacheKey = `user:${userId}:profile`;
let profile = await cache.get(cacheKey);
if (!profile) {
  profile = await graphClient.get(`/users/${userId}`);
  await cache.set(cacheKey, profile, { ttl: 3600 });
}

// ✅ Use Delta queries para sincronização incremental
const response = await fetch(
  '/me/messages/delta?$deltaToken={token}'
);
```

### 14.3 Resiliência

```typescript
// Circuit Breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailure: Date | null = null;
  private readonly threshold = 5;
  private readonly resetTimeout = 60000;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit is open');
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures < this.threshold) return false;
    if (!this.lastFailure) return false;
    
    const elapsed = Date.now() - this.lastFailure.getTime();
    return elapsed < this.resetTimeout;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailure = new Date();
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailure = null;
  }
}
```

### 14.4 Least Privilege

```typescript
// ❌ Não solicite mais permissões do que necessário
const scopes = [
  'Mail.ReadWrite.All',
  'Calendars.ReadWrite.All',
  'User.ReadWrite.All',
  // Muitas permissões!
];

// ✅ Solicite apenas o necessário
const scopes = [
  'Mail.Read',        // Apenas leitura de email
  'Calendars.Read',   // Apenas leitura de calendário
];
```

---

## 15. Troubleshooting

### 15.1 Erros Comuns

#### 401 Unauthorized

```
Causas:
- Token expirado
- Token inválido
- Permissões insuficientes

Soluções:
- Verificar expiração do token
- Refresh token
- Verificar permissões na App Registration
```

#### 403 Forbidden

```
Causas:
- Admin consent não concedido
- Usuário sem licença necessária
- Resource não acessível

Soluções:
- Solicitar admin consent
- Verificar licenças (ex: Teams, Exchange)
- Verificar se recurso existe e usuário tem acesso
```

#### 404 Not Found

```
Causas:
- Resource não existe
- ID incorreto
- Usuário/grupo deletado

Soluções:
- Verificar ID do resource
- Verificar se resource foi deletado
- Usar $filter em vez de ID direto
```

#### 429 Too Many Requests

```
Causas:
- Rate limit atingido

Soluções:
- Implementar retry com backoff exponencial
- Usar batching
- Implementar cache
- Otimizar quantidade de requests
```

### 15.2 Debugging de Permissões

```typescript
// Verificar permissões do token
async function debugPermissions(token: string) {
  const decoded = decodeToken(token);
  
  console.log('Application Permissions (roles):', decoded.roles);
  console.log('Delegated Permissions (scp):', decoded.scp);
  
  // Testar acesso
  try {
    await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ /me accessible');
  } catch {
    console.log('❌ /me not accessible');
  }
}
```

### 15.3 Problemas com Transcrições

```
Problema: Transcrições não aparecem na API

Verificações:
1. Transcription foi habilitada durante a reunião?
2. Reunião foi criada via Calendar Event (não ad-hoc)?
3. Application Access Policy foi configurada?
4. Tempo suficiente passou após fim da reunião? (pode levar minutos)
```

### 15.4 Problemas com Planner

```
Problema: Erro ao atualizar task

Verificações:
1. ETag está sendo enviado no header If-Match?
2. ETag é o mais recente? (buscar task antes de atualizar)
3. Usuário é membro do grupo que contém o plan?
```

---

## 16. Referências e Documentação Oficial

### 16.1 Links Essenciais

| Recurso | URL |
|---------|-----|
| Microsoft Graph Documentation | https://learn.microsoft.com/graph |
| Graph Explorer | https://developer.microsoft.com/graph/graph-explorer |
| API Reference | https://learn.microsoft.com/graph/api/overview |
| Permissions Reference | https://learn.microsoft.com/graph/permissions-reference |
| MSAL Documentation | https://learn.microsoft.com/azure/active-directory/develop/msal-overview |
| Teams API Reference | https://learn.microsoft.com/graph/teams-concept-overview |
| Change Notifications | https://learn.microsoft.com/graph/webhooks |

### 16.2 SDKs Oficiais

```bash
# JavaScript/TypeScript
npm install @microsoft/microsoft-graph-client
npm install @azure/msal-node
npm install @azure/msal-browser
npm install @azure/msal-react

# Python
pip install msgraph-sdk
pip install msal

# .NET
dotnet add package Microsoft.Graph
dotnet add package Microsoft.Identity.Client

# Java
implementation 'com.microsoft.graph:microsoft-graph:5.+'
```

### 16.3 Samples e Repositórios

- https://github.com/microsoftgraph
- https://github.com/Azure-Samples
- https://learn.microsoft.com/graph/tutorials

---

## Anexo A: Checklist de Implementação

```markdown
## Setup Inicial
- [ ] Criar conta Azure/Microsoft 365
- [ ] Acessar Azure Portal
- [ ] Criar App Registration
- [ ] Anotar Client ID e Tenant ID

## Credenciais
- [ ] Criar Client Secret (dev/staging)
- [ ] Configurar Certificate (produção)
- [ ] Armazenar em Key Vault

## Permissões
- [ ] Definir permissões necessárias (delegated vs application)
- [ ] Adicionar permissões na App Registration
- [ ] Obter Admin Consent

## Autenticação
- [ ] Implementar fluxo OAuth apropriado
- [ ] Configurar MSAL
- [ ] Implementar refresh token

## Desenvolvimento
- [ ] Criar cliente Graph reutilizável
- [ ] Implementar services por domínio
- [ ] Adicionar error handling
- [ ] Implementar retry logic
- [ ] Adicionar caching

## Integração
- [ ] Configurar webhooks
- [ ] Implementar endpoint de validação
- [ ] Testar notificações

## Testes
- [ ] Testar com Graph Explorer
- [ ] Escrever testes unitários
- [ ] Testar fluxos end-to-end

## Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Validar HTTPS
- [ ] Monitorar rate limits
- [ ] Configurar alertas
```

---

## Anexo B: Diagrama de Permissões por Funcionalidade

```
Funcionalidade                    Permissões Necessárias
────────────────────────────────────────────────────────────────────
Ler emails do usuário          → Mail.Read (delegated)
Enviar emails como usuário     → Mail.Send (delegated)
Ler emails de qualquer usuário → Mail.Read.All (application)
────────────────────────────────────────────────────────────────────
Ler calendário do usuário      → Calendars.Read (delegated)
Criar eventos para usuário     → Calendars.ReadWrite (delegated)
Gerenciar calendários tenant   → Calendars.ReadWrite.All (application)
────────────────────────────────────────────────────────────────────
Criar reunião Teams            → OnlineMeetings.ReadWrite (delegated)
Ler transcrições               → OnlineMeetingTranscript.Read.All (app)
Ler gravações                  → OnlineMeetingRecording.Read.All (app)
────────────────────────────────────────────────────────────────────
Ler tarefas To Do              → Tasks.Read (delegated)
Gerenciar tarefas To Do        → Tasks.ReadWrite (delegated)
────────────────────────────────────────────────────────────────────
Ler planos Planner             → Group.Read.All + Tasks.Read
Gerenciar tarefas Planner      → Group.ReadWrite.All + Tasks.ReadWrite
────────────────────────────────────────────────────────────────────
```

---

**Documento gerado em Janeiro 2026**  
**Autor: Claude (Anthropic)**  
**Para uso interno: Grana.AI**
