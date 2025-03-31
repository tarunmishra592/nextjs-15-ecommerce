import { connectToDatabase } from "."
import products from "../data"
import Product from "./models/product.model"
import { loadEnvConfig } from '@next/env'
import { cwd } from "process"
import User from './models/user.model'
import users from "../user-data"

loadEnvConfig(cwd())


const main = async() => {
    try{
        const productsData = [...products]
        const usersData = [...users]
        await connectToDatabase(process.env.DATABASE_URL)

        await User.deleteMany()
        const createdUser = await User.insertMany(usersData)

        await Product.deleteMany()
        const createdProduct = await Product.insertMany(productsData)

        console.log({
            createdUser, 
            createdProduct, 
            message: 'Products are inserted to DB'
        })

        process.exit(0)

    }catch(err){
        console.log(err)
        throw new Error('Failed to insert products')
    }
}

main()