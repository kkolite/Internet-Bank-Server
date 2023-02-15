Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

- [Сценарий Пользователя](#сценарий-пользователя)
  - [Registration](#registration)
  - [Login](#login)
  - [Verify](#verify)
  - [Password reset](#password-reset)
  - [Check user in DB](#check-user-in-db)
  - [Get Services](#get-services)
  - [User](#user)
    - [GET](#get)
    - [PUT](#put)
    - [DELETE](#delete)
- [Сценарий Денег](#сценарий-денег)
    - [Add or remove money](#add-or-remove-money)
    - [Transfer between clients](#transfer-between-clients)
    - [New currency account](#new-currency-account)
    - [Delete currency account](#delete-currency-account)
    - [Currency exchange](#currency-exchange)
    - [Commission](#commission)
    - [Card](#card)
    - [Send check to email](#send-check-to-email)
- [Сценарий Админа](#сценарий-админа)
    - [Check](#check)
    - [Get bank info](#get-bank-info)
    - [Get user database](#get-user-database)
    - [Get user info](#get-user-info)
    - [Create new user](#create-new-user)
    - [Block user](#block-user)
    - [Delete user](#delete-user)
    - [Get operation's statistics](#get-operations-statistics)
- [Викторина](#викторина)
    - [Get quiz](#get-quiz)
    - [Check Answers](#check-answers)
- [Stocks](#stocks)
    - [Get stocks data](#get-stocks-data)
    - [Buy or sell stocks](#buy-or-sell-stocks)

## Сценарий Пользователя 

### Registration

Регистрация пользователя в нашей базе. Необходимо передать ник, почту и пароль. **Валидация должна быть на фронтенде**. Вовзращает состояние выполненной операции (успех или неудача), многоразовый пин-код (если успех) и сообщение (успех или причина ошибки).

- Method: POST
- URL: action/registration

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
    - `pinCode: number`
               
### Login

Авторизация клиента. Передается ник и пароль.

- Method: POST
- URL: action/login

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

Проверка кода, который пришел на почту (или многоразового пин-кода). В ответ может вернуться ошибка с сообщением о причине ошибки. Успешное выполнение помимо статуса выполнения операции возвращает токен и информацию о пользователе (ник, количество денег, является ли пользователь админом, находится ли пользователь в блокировке).

- Method: POST
- URL: action/verify

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

### Password reset

Сброс пароля (если пользователь забыл его). Необходимо передать ник и почту (для проверки, что Вася это Вася). Отправляет на почту новый пароль.

- Method: POST
- URL: action/reset

- req body:
    - `username: string`,
    - `email: string`

- res body: 
    - `message: Success!`,
    - `success: true`,

- error bodies:
    - `success: false`,
    - `message`:`Invalid req body` or `Incorrect username or/and email` or `Error!`

### Check user in DB

Поиск клиента в нашей базе по его нику. Возвращает `true` или `false` без никакой другой информации о пользователе.

- Method: GET
- URL: action/check

- req query: `username`

- res body: `success`: `true` or `false`

### Get Services

Получение операций.

- Method: GET
- URL: action/services

- res body: 
    - `message: Success!`,
    - `success: true`,
    - `operations`: `{operaionID:{name, ruName, category: {rum en}, ?logo}}`

- error bodies:
    - `success: false`,
    - `message`: `Error!`

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
        - `email: string`,
        - `isAdmin: boolean`,
        - `isBlock: boolean`,
        - `lastFive`
        - `accounts`
        - `cards`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error!`

#### PUT

Обновление данных пользователя. Принимает ник, почту и пароль (опционально). Необходимо подтверждение текущим паролем.

- Method: PUT
- URL: /user

- req header: `Authorization: Bearer ${token}`
- req body:
    - `currentPassword: string`
    - ?`username: string`
    - ?`password: string`
    - ?`email: string`

- res body: 
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token or/and password. Need to login` or `Invalid password` or `Error!`

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

### Save card

Сохранение ССЫЛКИ на созданную пользователем карточку в БД

- Method: POST
- URL: /user/card

- req header: `Authorization: Bearer ${token}`
- req body: `link: string`

- res body: 
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error!`

## Сценарий Денег

### Add or remove money

Простое управление деньгами на счету клиента. Можно либо списать их со счета, либо наоборот добавить денег пользователю. Нужная сумма операции и ее ID передаются в теле, ее тип (зачисление либо снятие) - в параметрах.. Авторизация проиходит по токену в хедере.

Операции с деньгами через счета банка идут без комиссии.

Планируется добавить дополнительную верификацию (клиенту на почту придет пинкод).

- Method: POST
- URL: /securemoney

- req header: `Authorization: Bearer ${token}`
- req query: `operation`: `add` or `remove`
- req body: 
    - `money: number`
    - `operationID: number`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! Incorrect query string or money` or `No enough money!` or `Error!`

### Transfer between clients

Перевод денег между клиентами. Отправитель должен быть авторизирован, получатель определяется по нику.

- Method: POST
- URL: /securemoney/transfer

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

### New currency account

Создает новый валютный счет. Если такая валюта уже есть у пользователя - возвращается ошибка.

- Method: POST
- URL: /securemoney/account

- req header: `Authorization: Bearer ${token}`
- req body: 
    - `username: string`
    - `currency: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Not found user` or `You already have ${currency} account` or `Invalid req body` or `Error!`

### Delete currency account

Удаляет валютный счет.

- Method: DELETE
- URL: /securemoney/account

- req header: `Authorization: Bearer ${token}`
- req body: 
    - `username: string`
    - `currency: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Not found user` or `You already have ${currency} account` or `Invalid req body` or `Error!`

### Add money to currency account

Пополнение или снятие с валютного счета.

- Method: PUT
- URL: /securemoney/account

- req header: `Authorization: Bearer ${token}`
- req query: `operation` = `add` or `remove`
- req body: 
    - `username: string`
    - `currency: string`
    - `money: number`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Not found user` or `Not enough money` or `Invalid req body` or `Error!

### Currency exchange

Обмен валюты. Возможно два сценария - в рамках счетов одного клиента или анонимно (между карточками). Во втором варианте есть комиссия. При первом необходимо передать токен, параметры, а также дополнительное свойтсво в теле запроса (вторая валюта).

- Method: POST
- URL: /money/exchange

- req header?: `Authorization: Bearer ${token}`
- req query?: `client=true`
- req body: 
    - `money: number`
    - `currencyOne: string`
    - ?`currencyTwo: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `User not found!` or `No enough money!` or `Invalid req body` or `Error!`

### Commission

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

### Card

Метод "оплаты" карточкой. Генерирует ошибку платежной системы с вероятностью 20%.

- Method: POST
- URL: /money/card

- req body: 
    - `card: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Error! Card system error` or `Error!`

### Send check to email

Отправка чека операции по электронной почте.

- Method: POST
- URL: /money/check

- req body: 
    - `money: number`
    - `operationID: number`
    - `email: string`

- res body:
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message: Error!`

## Сценарий Админа

Админ обладает полным доступом к данным всех клиентов. Он может:
- Блокировать счет
- Назначать
- Менять количество денег у клиента (под вопросом)
- Изменять список услуг для оплаты (небанковские)

Также он имеет доступ к базе данных самого банка, в которой содержатся:
- Количество собственных денег у банка
- Статистика по выполненным операциям

### Check

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

### Get bank info

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

### Get user database

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

### Get user info

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
        - `lastFive`

- error bodies:
    - `success: false`
    - `message`: `Error! No token. Need to login` or `Error! No admin!` or `No username in header` or `Not found user '${username}' in base` or `Error!`

### Create new user

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

### Block user

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

### Delete user

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

### Get operation's statistics

Возвращает статистику по операциям: сколько раз выполнялись, сколько денег прошло. При передаче в параметрах айдишника операции вернет данные по конкретной операции.

**Update**. Отключил проверку на админа, планируем выводить эту статистику в общий доступ.

- Method: GET
- URL: statistics/

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

## Викторина

### Get quiz

Получение вопросов викторины. Из данных на сервере рандомно выбирается пять вопросов, клиенту отправляется их айдишка, сами вопрос и варианты ответов на двух языках. Никаких ответов на клиенте.

- Method: GET
- URL: quiz/

- res body: 
    - `success: true`
    - `message: Success`
    - `questions[]`
        - `id: number`
        - `question: {ru, en}`
        - `answers: {ru, en}`
        - `desc: {ru, en}`

- error bodies:
    - `success: false`
    - `message`: `Error`

### Check answers

Проверка ответов. Необходимо передать массив объектов. Возвращает количество правильных ответов.

- Method: POST
- URL: quiz/

- req body:
    - `answers[]`
        - `id: number`
        - `answer: string`

- res body: 
    - `success: true`
    - `message: Success`
    - `result: number`

- error bodies:
    - `success: false`
    - `message`: `Error`

## Stocks

### Get stocks Data

Получение текущих данных по акциям (включая акции пользователя). Обновление цен на акции идет с помощью вебсокета.

- Method: GET
- URL: stonks/

- req header: `Authorization: Bearer ${token}`

- res body: 
    - `success: true`
    - `message: Success`
    - `stocks`
    - `userStocks`

- error bodies:
    - `success: false`
    - `message`: `Error`

### Buy or sell stocks

Покупка или продажа акций. Реализована по такому же принципу как изменение денег на счету - один путь, нужная операция передается в параметрах. В теле запроса передаются количество акций и их название.

- Method: POST
- URL: stonks/

- req header: `Authorization: Bearer ${token}`
- req query: `operation`: `add` or `remove`
- req body: 
    - `number: number`
    - `stockName: string`

- res body: 
    - `success: true`
    - `message: Success`

- error bodies:
    - `success: false`
    - `message`: `Invalid body or query` or `Not found stocks` or `Not enough stocks` or `Not enough money` or `Not found stocks in user` or `Error`