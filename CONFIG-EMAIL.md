# Configurar envio de e-mail

O sistema envia e-mail ao locador quando um motorista manifesta interesse. Para ativar:

## 1. Criar o arquivo .env

Na pasta `locadora-app`, crie um arquivo chamado `.env` (copiando do exemplo):

- **Windows (PowerShell):** `Copy-Item .env.example .env`
- **Ou** copie manualmente: duplique `.env.example` e renomeie para `.env`

## 2. Preencher com suas credenciais

Abra o `.env` e edite:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS="sua-senha-de-app"
EMAIL_FROM=seu-email@gmail.com
```

### Gmail – senha de app

O Gmail não aceita mais a senha normal. Use uma **senha de app**:

1. Acesse: https://myaccount.google.com/apppasswords
2. Faça login e crie uma senha de app (ex.: "Locadora App")
3. Copie a senha de 16 caracteres (ex.: `abcd efgh ijkl mnop`)
4. No `.env`, use **aspas** porque tem espaços: `EMAIL_PASS="abcd efgh ijkl mnop"`

## 3. Reiniciar o servidor

Após salvar o `.env`, reinicie: `npm start`

## 4. Testar

1. Cadastre um locador com um e-mail seu
2. Cadastre um motorista
3. O locador publica um veículo
4. O motorista manifesta interesse
5. O locador deve receber o e-mail

## Problemas comuns

- **"Não configurado"** → O `.env` não existe ou está na pasta errada (deve ficar em `locadora-app/.env`)
- **Erro de autenticação** → Use senha de app, não a senha normal do Gmail
- **Senha com espaços** → Coloque entre aspas: `EMAIL_PASS="abc def ghi jkl"`
- **E-mail não chega** → Verifique a pasta de spam
