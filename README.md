# storebridger-backend

The backend application

## Instalation

Clone This Repository

```bash
git clone https://github.com/storebridger/storebridger-backend.git
```

Install Package

```bash
yarn install
```

Clone .env file from .env.example and edit

```bash
cat .env.example >> .env
```

Generate Public And Private Key

### Private Key

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.pem
```

### Public Key

```bash
openssl rsa -in private.pem -pubout -outform PEM -out public.pub
```

## Usage

Start The Server

```bash
yarn start
```

Run Test

```bash
yarn run test
```

Run ESLint to fix code

```bash
yarn run eslint:fix
```
