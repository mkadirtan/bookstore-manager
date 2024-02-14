Simply:

```bash
cp .env.example .env && docker compose up -d
```

Find OpenAPI docs at `http://localhost:3000/api`

Or, you can import Insomnia document `Insomnia_2024-02-14.json` and start using.

Owner credentials are defined in the env file. You can create user and manager using owner credentials.

Use Bearer authentication to access APIs.

Owner can access all routes, Manager can modify the bookstores they are assigned to. They can be assigned to 
multiple bookstores.

Use `POST {{host}}/bookstore/assign-manager` endpoint to assign a manager to a store.
Use `DEL {{host}}/bookstore/dismiss-manager` endpoint to dismiss a manager from a store.

