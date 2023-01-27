# Internet-Bank Server

Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

## Сценарий пользователя 

### Registration

Регистрация пользователя в нашей базе. Необходимо передать ник, почту и пароль. **Валидация должна быть на фронтенде**. Вовзращает состояние выполненной операции (успех или неудача) и сообщение (успех или причина ошибки).

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

Авторизация клиента. Передается ник и пароль. В ответ может вернуться ошибка с сообщением о причине ошибки. Успешное выполнение помимо статуса выполнения операции возвращает токен и информацию о пользователе (ник, количество денег, является ли пользователь админом, находится ли пользователь в блокировке).

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

### Check user in DB

Поиск клиента в нашей базе по его нику. Возвращает `true` или `false` без никакой другой информации о пользователе.

- Method: GET
- URL: /check

- req query: `username`

- res body: `success`: `true` or `false`

### User

#### GET

Получение информации о пользователе. Проверка осуществляется по токену. Необходимо делать при выполнении операций (обновление количества денег, проверка, является ли Вася Васей и т.д.).

- Method: GET
- URL: /

- req header: `Authorization: Bearer ${token}`

- res body:
    - `message: Success!`,
    - `success: true`,
    - `userConfig`:
        - `username: string`,
        - `money: number`,
        - `isAdmin: boolean`,
        - `isBlock: boolean`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error!`

#### PUT

Обновление данных пользователя. Принимает ник, почту и пароль.

- Method: GET
- URL: /

In progess

#### DELETE

Удаление пользователя. Помимо токена для верификации необходимо запросить у клиента его пароль и передать его на сервер.

- Method: GET
- URL: /

- req header: `Authorization: Bearer ${token}`
- req body: `password: string`

- res body: 
    - `success: true`
    - `message: User ${payload.id} deleted`

- error bodies:
    - `success: false`
    - `message`: `Error! No token or/and password. Need to login` or `Error!`