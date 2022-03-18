
# Entrega 2: Users Service

Users Service é uma API desenvolvida em Node.js, utilizando o framework Express e
tem como objetivo colocar conceitos básicos de hasheamento, autenticação e 
proteção de rotas em prática.

## Funcionalidades

- Cadastro de usuários
- Login e autenticação
- Proteção de rotas
- Atualização de dados sensíveis


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`JWT_SECRET`


# Como usar os Endpoints

As rotas da aplicação podem ser dividas em três categorias básicas:

- Rotas públicas
- Rotas para usuários
- Rotas privadas

Recursos como o cadastro e login de usuários podem ser utilizados sem nenhum tipo
de token de acesso, enquanto esses dados cadastrados só podem ser visualizados por
usuários autenticados. Além disso, a atualização de dados só é permitida se o token
informado foi gerado pelo usuário que vai ser alterado.

Esse tipo de validação é feita pelo envio de um Bearer Token no Header nas
requisições protegidas. Esse tokens seguem o padrão JSON Web Token e são gerados 
automaticamente pela aplicação durante o login.

Logo abaixo seguem exemplos de cada rota aceita pela aplicação, junto com seu
comportamento esperado, os campos necessários para sua utilização e o que será
retornado pelo servidor.


## POST/signup

```json
{
  "age": integer,
  "username": string,
  "email": string,
  "password": string
}​
```

*Resposta:*

```json
{
  "uuid": string,
  "createdOn": string,
  "email": string,
  "age": number,
  "username": string
}
```

## POST/login

```json
{
  "username": string,
  "password": string
}​
```

*Resposta:*

```json
{
  "token": string
}
```

## GET/users

Apenas usuários logados podem acessar esse recurso. Um Bearer Token deve ser
enviado no Header da requisição.

*Resposta:*

```json
[
  {
    "username": string,
    "age": number,
    "email": string,
    "password": string,
    "createdOn": string,
    "uuid": string
  }
]
```

## PUT/users/:uuid/password

Apenas usuários logados podem acessar esse recurso. O **uuid** na rota deve ser 
o id do usuário que vai receber as alterações. O Bearer Token só será aceito se 
for gerado por esse mesmo usuário.

```json
{
  "password": string
}​
```

***Sem Resposta***