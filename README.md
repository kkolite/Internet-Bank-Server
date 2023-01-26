# Internet-Bank Server

Данный сервер написан для работы курсового проекта [Интернет-Банк](https://github.com/kkolite/Internet-Bank)

## Сценарий пользователя 

### Registration
- Method: POST
- URL: /registration

- req body: ~~~{
   username: string,
   email: string,
   password: string
}~~~

- error bodies: ~~~{
                    message: 'Ooops! Empty field!',
                    success: false,
                }

                {
                    message: 'We already have user with same username/email',
                    success: false,
                }

                {
                    message: 'Error!',
                    success: false,
                }~~~

### Login
- Method: POST
- URL: /login

- req body: ~~~{
   username: string,
   password: string
}~~~
- res body: ~~~{
                message: 'Success!',
                success: true,
                token,
                userConfig: {
                    username: user.username,
                    money: user.money,
                    isAdmin: user.isAdmin,
                    isBlock: user.isBlock
                }
            }~~~
            **Important!** Токен должен быть сохранен в сессионное хранилище. При дальнейших операциях с сервером по нему осуществляется проверка пользователя.

- error bodies: ~~~{
                    message: ${username} not found,
                    success: false,
                }
                {
                    message: 'Invalid password',
                    success: false,
                }
                {
                    message: 'Error!',
                    success: false,
                }~~~
                

### User