import { Router } from 'https://deno.land/x/oak/mod.ts'
import Home from '../controllers/Home.ts'

const router = new Router({ prefix: '/' })

router.get('/', Home)

export default router
