import { Router } from 'https://deno.land/x/oak/mod.ts'
import {
    getAllData,
    getDatabyId,
    addData,
    updateData,
} from '../controllers/Books.ts'
const router = new Router({ prefix: '/a/v1/books' })

router
    .get('/', getAllData)
    .get('/:id', getDatabyId)
    .post('/', addData)
    .put('/:id', updateData)

export default router
