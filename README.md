# 🧠 GestorWorkshops: Aplicação Mobile para Gestão de Workshops e Listas de Espera

Uma aplicação **mobile** completa para gestão de **workshops** com um sistema inteligente de **lista de espera** (waitlist) e funcionalidades de **CRUD** para organizadores e utilizadores. Desenvolvida com **React Native (Expo)** no frontend e **Node.js (Express) + SQLite** no backend.

## Funcionalidades
* **Gestão Completa (CRUD):** Criação, Leitura, Atualização e Eliminação de **Workshops** e **Utilizadores**.
* **Inscrições Simples:** Utilizadores inscrevem-se com apenas Nome e Email.
* **Sistema de Lista de Espera Inteligente (Waitlist):**
    * Quando a **capacidade máxima** de um workshop é atingida, novos inscritos são movidos automaticamente para a lista de espera.
    * Quando um inscrito **cancela**, o **primeiro** da lista de espera é automaticamente movido para a lista de participantes.
* **Dashboard do Organizador:** Painel de controlo centralizado com listagem de workshops, participantes, lista de espera e **estatísticas** relevantes.
* Funcionalidade de **Desinscrição** para utilizadores.
* Multi-Platform (Android, iOS & Web)

## 🎯 Melhorias Futuras
* Implementar autenticação real de utilizadores.
* **UX/UI:** Melhorar o design do Dashboard do Organizador e adicionar filtros/pesquisas.

## 🚀 Tecnologias
### Frontend
- **React Native** - Framework para desenvolvimento mobile multi-platform
- **Expo** - Plataforma para desenvolvimento e build 
- **NativeWind/CSS** - Estilização dos componentes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework para API REST
- **SQLite** - Base de dados relacional leve

## 📋 Pré-requisitos
- Node.js (versão 16 ou superior) [usei NodeJS v22.14.0]
- npm ou yarn [usei npm v11.6.2]
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (no telemóvel)

## 🔧 Instalação
### Backend
```bash
cd backend
npm install
npm start
```
O servidor estará disponível em `http://localhost:3000`<br>
Nota: Para correr a API online, pode ser usado por exemplo `render.com` | Para isso, alterar também o link da REST API em `frontend/src/config/api.config.ts`

### Frontend
```bash
cd frontend
npm install
npm install -g expo-cli
npx expo start
```
Android Studio ou Expo Go no telemóvel.

## 📁 Estrutura do Projeto
```
.
├── frontend/             # Aplicação React Native
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── config/       # API Configuration
│   │   ├── screens/      # Screens
│   │   ├── services/     # API Service
│   │   └── utils/        # Utils
│   ├── app/
│   │   └── Index.tsx  
│   └── package.json
│
├── backend/              # API REST Node.js
│   ├── database.js       # Configuração/inicialização da BD
│   ├── server.js         # API Logic
│   └── package.json
│
└── README.md
```

## 🛠️ Desenvolvimento

### Backend
- `node server.js` para iniciar o servidor de desenvolvimento

### Frontend
- `npx expo start` para iniciar o servidor de desenvolvimento
- Escolher `a` para Android, `i` para iOS ou scannear o código QR para testar num telemóvel físico

## 📝 Licença
Este projeto está sob a licença MIT.
