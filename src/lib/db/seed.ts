import { connectToDatabase } from "."
import products from "../data"
import Product from "./models/product.model"
import { loadEnvConfig } from '@next/env'
import { cwd } from "process"
import User from './models/user.model'
import users from "../user-data"
import Review from "./models/review.model"
import { reviews } from "../reviews"

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

        await Review.deleteMany()
        const rws = []
        for (let i = 0; i < createdProduct.length; i++) {
            let x = 0
            const { ratingDistribution } = createdProduct[i]
            for (let j = 0; j < ratingDistribution.length; j++) {
              for (let k = 0; k < ratingDistribution[j].count; k++) {
                x++
                rws.push({
                  ...reviews.filter((x) => x.rating === j + 1)[
                    x % reviews.filter((x) => x.rating === j + 1).length
                  ],
                  isVerifiedPurchase: true,
                  product: createdProduct[i]._id,
                  user: createdUser[x % createdUser.length]._id,
                  updatedAt: Date.now(),
                  createdAt: Date.now(),
                })
              }
            }
        }
        const createdReviews = await Review.insertMany(rws)

        console.log({
            createdUser, 
            createdProduct, 
            createdReviews,
            message: 'Products are inserted to DB'
        })

        process.exit(0)

    }catch(err){
        console.log(err)
        throw new Error('Failed to insert products')
    }
}

main()