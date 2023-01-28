Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

- [Сценарий Пользователя](#сценарий-пользователя)
  - [Registration](#registration)
  - [Login](#login)
  - [Verify](#verify)
  - [Check user in DB](#check-user-in-db)
  - [User](#user)
    - [GET](#get)
    - [PUT](#put)
    - [DELETE](#delete)
- [Сценарий Денег](#сценарий-денег)
    - [Add or remove money](#add-or-remove-money)
    - [Transfer between clients](#transfer-between-clients)
    - [Перевод с/на/между карточками](#перевод-снамежду-карточками)
    - [Commission](#commission)
- [Сценарий Админа](#сценарий-админа)
    - [Check](#check)
    - [Get bank info](#get-bank-info)
    - [Get user database](#get-user-database)
    - [Get user info](#get-user-info)
    - [Create new user](#create-new-user)
    - [Block user](#block-user)
    - [Delete user](#delete-user)
    - [Get operation's statistics](#get-operations-statistics)
- [В разработке](#в-разработке)

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

Авторизация клиента. Передается ник и пароль.

- Method: POST
- URL: user/login

- req body:
    - `username: string`,
    - `password: string`

- res body: 
    - `message: Success!`,
    - `success: true`,

- error bodies:
    - `success: false`,
    - `message`:`${username} not found` or `Invalid password` or `Error!` or `User not found during creating secure code`

### Verify

Проверка кода, который пришел на почту. В ответ может вернуться ошибка с сообщением о причине ошибки. Успешное выполнение помимо статуса выполнения операции возвращает токен и информацию о пользователе (ник, количество денег, является ли пользователь админом, находится ли пользователь в блокировке).

- Method: POST
- URL: user/verify

- req body:
    - `username: string`,
    - `code: number`

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
    - `message`:`${username} not found` or `Invalid req body` or `Error!` or `User not found during check secure code` or `Invalid code`

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

#### Commission

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

Получение базы данных всех пользователей. Возвращает только "безопасные" данные. Никаких паролей и айдишников.

- Method: GET
- URL: /admin/database

- req header: `Authorization: Bearer ${token}`
  
- res body:
    - `message: Success`
    - `success: true`
    - `database`:
        - `username`
        - `email`
        - `isAdmin`
        - `isBlock`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Error!`

#### Get user info

Получает информацию о конкретном пользователе по его нику.

- Method: GET
- URL: /admin/user

- req header: `Authorization: Bearer ${token}`
- req query: `username: string`
  
- res body:
    - `message: Success`
    - `success: true`
    - `user`:
        - `username`
        - `email`
        - `isAdmin`
        - `isBlock`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `No username in header` or `Not found user '${username}' in base` or `Error!`

#### Create new user

Создает нового юзера.

- Method: POST
- URL: admin/user

- req body:
    - `username: string`,
    - `email: string`
    - `password: string`

- res body:
    - `success: true`
    - `message: New user create!`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `We already have user with same username/email` or `Ooops! Empty field!` or `Error!`

#### Block user

Админ не может изменить пароль, ник или емали пользователя. Но он может его заблокировать.

- Method: PUT
- URL: admin/user

- req body:
    - `username: string`,
    - `isBlock: boolean`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Error! Incorrect req body` or `Not found user '${username}' in base` or `Error!`

#### Delete user

Удаление пользователя из базы

- Method: DELETE
- URL: admin/user

- req body:
    - `username: string`,

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `No username in body` or `Not found user '${username}' in base` or `Error!`

#### Get operation's statistics

Возвращает статистику по операциям: сколько раз выполнялись, сколько денег прошло. При передаче в параметрах айдишника операции вернет данные по конкретной операции.

- Method: GET
- URL: admin/statistics

- req query?: `operationID: number`

- res body: 
    - `success: true`
    - `message: Success`
    - `statistics`
        - `operationID: number`
        - `count: number`
        - `money: number`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `Not found operation` or `Error! Empty/broken statistics` or `Error`

## В разработке

- Кредиты (money)
- Депозиты (money)
- Валютный счет (money/user) - EUR, GBP
- Обмен валют (money)
- Создание чека операции (money)
- Получение данных по всем счетам (админ или общий?)
- История операций (user)
