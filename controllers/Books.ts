import { Client } from 'https://deno.land/x/postgres/mod.ts'
import { routerType, booksType } from '../types.ts'
import { dbConfig } from '../config.ts'

const client = new Client(dbConfig)

// @desc    get all data
// @route   /a/v1/books
const getAllData = async ({ response }: routerType) => {
    try {
        await client.connect()
        const result = await client.query('SELECT * FROM books')
        let data: any = []

        result.rows.map(r => {
            let obj: any = {}
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = r[i]
            })
            data.push(obj)
        })

        response.status = 200
        response.body = {
            success: true,
            data,
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString(),
        }
    } finally {
        await client.end()
    }
}

// @desc    get data by id
// @route   /a/v1/books/:id
const getDatabyId = async ({ response, params }: routerType) => {
    try {
        await client.connect()
        const result = await client.query(
            'SELECT * FROM books WHERE id=$1',
            params.id
        )
        if (result.rows.toLocaleString() == '') {
            response.status = 404
            response.body = {
                success: false,
                msg: `data with id ${params.id} is not found`,
            }
            return
        }

        const data: any = {}
        result.rows.map(r => {
            result.rowDescription.columns.map((el, i) => {
                data[el.name] = r[i]
            })
        })

        response.status = 200
        response.body = {
            success: true,
            data,
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString(),
        }
    } finally {
        await client.end()
    }
}

// @desc    add new data
// @route   /a/v1/books
const addData = async ({ request, response }: routerType) => {
    const body = await request.body()
    const data: booksType = body.value
    if (!request.hasBody) {
        response.status = 401
        response.body = {
            success: false,
            msg: 'Please input a data!',
        }
        return
    }
    try {
        await client.connect()
        await client.query(
            'INSERT INTO books(title,author,price,stock) VALUES($1,$2,$3,$4)',
            data.title,
            data.author,
            data.price,
            data.stock
        )

        response.status = 201
        response.body = {
            success: true,
            msg: 'a new book has been saved!',
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString(),
        }
    } finally {
        await client.end()
    }
}

// @desc    update book by id
// @route   /a/v1/books
const updateData = async ({ request, response, params }: routerType) => {
    await getDatabyId({ response, params, request })
    if (response.status === 404) {
        response.status = 404
        response.body = {
            success: false,
            msg: response.body.msg,
        }
        return
    }
    if (!request.hasBody) {
        response.status = 401
        response.body = {
            success: false,
            msg: 'Please input a data!',
        }
        return
    }

    try {
        await client.connect()
        const body = await request.body()
        const data: booksType = body.value

        await client.query(
            'UPDATE books SET title=$1,author=$2,price=$3,stock=$4 WHERE id=$5',
            data.title,
            data.author,
            data.price,
            data.stock,
            params.id
        )
        response.status = 200
        response.body = {
            success: true,
            msg: `data with id ${params.id} has been updated.`,
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString(),
        }
    } finally {
        await client.end()
    }
}

const deleteData = async ({ response, params, request }: routerType) => {
    await getDatabyId({ response, params, request })
    if (response.status === 404) {
        response.status = 404
        response.body = {
            success: false,
            msg: response.body.msg,
        }
        return
    }

    try {
        await client.connect()
        await client.query('DELETE FROM books WHERE id=$1', params.id)
        response.status = 204
        response.body = {
            success: true,
            msg: `book with id ${params.id} has been deleted!`,
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString(),
        }
    } finally {
        await client.end()
    }
}

export { getAllData, getDatabyId, addData, updateData, deleteData }
