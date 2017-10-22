# Sobre

> FullStack Javascript utilizando Vuejs no frontend e NodeJs+Express no Backend. Já integrado com MongoDb (Mongoose) e Banco de Dados Relacionais (SequelizeJS)

## Build APi

``` bash
# instala cliente sequelize 
npm install -g sequelize-cli

# Vá para a pasta api
cd api

# Instala as depedencias
npm install

# Edita configurações da Aplicação
nano config/config-env.ts

# Edita configurações do Banco de Dados Relacional ( SequelizeJs )
nano config/database.json

# Inicia server em localhost:4200 com auto-reload | Já instalando as tabelas no db
npm run dev

# Desinstala as modificações no db | migrations
npm run uninstall

```

## Build Web

``` bash
# Vá para a pasta web
cd web

# Instala as depedencias
npm install

# Inicia server em localhost:8080 com hot-reload
npm run dev

```