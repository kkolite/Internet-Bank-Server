# Internet-Bank Server

Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

## Сценарий пользователя 

### Registration
- Method: POST
- URL: /registration

- req body:
    - `username: string`,
    - `email: string`
    - `password: string`


- error bodies:
    - `success: false`
    - `message`: `We already have user with same username/email` or `Ooops! Empty field!` or `Error!`

- success body:
    - `success: true`
    - `message: New user create!`
               

### Login
- Method: POST
- URL: /login

- req body:
    - `username: string`,
    - `password: string`

- res body: 
    - `message: Success!`,
    - `success: true`,
    - `token`,
    - `userConfig`
    
**Important!** Токен должен быть сохранен в сессионное хранилище. При дальнейших операциях с сервером по нему осуществляется проверка пользователя.

- user config:
    - `username: string`,
    - `money: number`,
    - `isAdmin: boolean`,
    - `isBlock: boolean`

- error bodies:
    - `success: false`,
    - `message`:`${username} not found` or `Invalid password` or `Error!`
                

### User
