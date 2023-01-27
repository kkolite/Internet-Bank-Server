# Internet-Bank Server

Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

- [Сценарий Пользователя](#сценарий-пользователя)
- [Сценарий Денег](#сценарий-денег)
- [Сценарий Админа](#сценарий-админа)

## Сценарий Пользователя 

### Registration

Регистрация пользователя в нашей базе. Необходимо передать ник, почту и пароль. **Валидация должна быть на фронтенде**. Вовзращает состояние выполненной операции (успех или неудача) и сообщение (успех или причина ошибки).

- Method: POST
- URL: user/registration

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
- URL: user/login

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
- URL: user/check

- req query: `username`

- res body: `success`: `true` or `false`

### User

#### GET

Получение информации о пользователе. Проверка осуществляется по токену. Необходимо делать при выполнении операций (обновление количества денег, проверка, является ли Вася Васей и т.д.).

- Method: GET
- URL: /user

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

- Method: PUT
- URL: /user

In progess

#### DELETE

Удаление пользователя. Помимо токена для верификации необходимо запросить у клиента его пароль и передать его на сервер.

- Method: DELETE
- URL: /user

- req header: `Authorization: Bearer ${token}`
- req body: `password: string`

- res body: 
    - `success: true`
    - `message: User ${payload.id} deleted`

- error bodies:
    - `success: false`
    - `message`: `Error! No token or/and password. Need to login` or `Error!`

## Сценарий Денег

#### Add or remove money

Простое управление деньгами на счету клиента. Можно либо списать их со счета, либо наоборот добавить денег пользователю. Нужная сумма операции и ее ID передаются в теле, ее тип (зачисление либо снятие) - в параметрах.. Авторизация проиходит по токену в хедере.

Операции с деньгами через счета банка идут без комиссии.

Планируется добавить дополнительную верификацию (клиенту на почту придет пинкод).

- Method: POST
- URL: /money

- req header: `Authorization: Bearer ${token}`
- req query: `operation`: `add` or `remove`
- req body: 
    - `money: number`
    - `ID: number`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! Incorrect query string or money` or `No enough money!` or `Error!`

#### Transfer between clients

Перевод денег между клиентами. Отправитель должен быть авторизирован, получатель определяется по нику.

- Method: POST
- URL: /money/transfer

- req header: `Authorization: Bearer ${token}`
- req body: 
    - `money: number`
    - `toUsername: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `User not found!` or `No enough money!` or `Error!`

#### Перевод с/на/между карточками

Планируется реализовать с помощью метода обычного метода добавления/убавления средств со счета. Поверх реализована "проверка" картчоки (рандомно с вероятностью 20% кидать ошибку о некорректной карточке)

#### Комиссия банку

Для операций без участия счета клиента (оплата товаров карточкой, перевод между картчоками итд). Это не пустышка: комиссия идет на счет самого банка.

- Method: POST
- URL: /money/commission

- req body: 
    - `money: number`
    - `operationID: number`

- res body:
    - `success: true`
    - `message: Success`
    - `moneyPay: number`(сколько заплатили денег без учета комиссии)
    - `commission: number`(комиссия определяется на сервере)

- error bodies:
    - `success: false`
    - `message`: `Error! Invalid body` or `Error!`

## Сценарий Админа

Админ обладает полным доступом к данным всех клиентов. Он может:
- Блокировать счет
- Назначать
- Менять количество денег у клиента (под вопросом)
- Изменять список услуг для оплаты (небанковские)

Также он имеет доступ к базе данных самого банка, в которой содержатся:
- Количество собственных денег у банка
- Статистика по выполненным операциям

#### Check

Проверка по токену, является ли пользователь админом

- Method: GET
- URL: /admin

- req header: `Authorization: Bearer ${token}`

- res body:
    - `message: Success`
    - `success: true`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Error!`

#### Get bank info

Получение ифнормации о счете банка. Их может быть несколько, есть опция передать название нужного счета. По умолчанию - счет из конфига сервера.

- Method: GET
- URL: /admin/bank

- req header: `Authorization: Bearer ${token}`
- req query(optional): `bankname: string`
  
- res body:
    - `message: Success`
    - `success: true`
    - `bank`:
        - `bankname`
        - `money`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Error!`

#### Get user database

Получение базы данных всех пользователей. Эх, он и пароли возвращает, надо бы починить эту "фичу".

- Method: GET
- URL: /admin/database

- req header: `Authorization: Bearer ${token}`
  
- res body:
    - `message: Success`
    - `success: true`
    - `database`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Error!`

#### Get user info

Получает информацию о конкретном пользователе по его нику. Возвращает пароли (исправить).

- Method: GET
- URL: /admin/user

- req header: `Authorization: Bearer ${token}`
- req query: `username: string`
  
- res body:
    - `message: Success`
    - `success: true`
    - `user`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `No username in header` or `Not found user '${username}' in base` or `Error!`

### В разработке

Если останется время - кредиты и депозиты.
