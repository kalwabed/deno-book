import { Application } from 'https://deno.land/x/oak/mod.ts'
import Home from './routers/home.routes.ts'
import Book from './routers/book.routes.ts'

const port = Deno.env.get('PORT') || 3000
const app = new Application()

app.use(Home.routes())
app.use(Home.allowedMethods())
app.use(Book.routes())
app.use(Book.allowedMethods())

console.log(`Server listen on port ${port}`)
await app.listen({ port: +port })
