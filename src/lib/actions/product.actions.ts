"use server"

import { PAGE_SIZE } from "../constant"
import { connectToDatabase } from "../db"
import Product, { IProduct } from "../db/models/product.model"


export async function getAllCategory(){
    await connectToDatabase()
    const category = await Product.find({isPublished: true}).distinct('category')
    return category
}

export async function getProductForCard({tag, limit=4}:{
    tag: string,
    limit?: number
}){
    await connectToDatabase()
    const product = await Product.find(
        { tags:{ $in:[tag] }, isPublished: true },
        {
            name: 1,
            href:{ $concat: ['/products/', '$slug'] },
            image:{ $arrayElemAt:['$images', 0] }
        }
    ).sort({createdAt: 'desc'}).limit(limit)

    return JSON.parse(JSON.stringify(product)) as {
        name: string,
        href: string,
        image: string
    }[]
}

export async function getProductByTag({tag, limit=10}:{
    tag: string,
    limit?: number
}){
    await connectToDatabase()
    const product = await Product.find({
        tags: {$in: [tag]},
        isPublished: true
    }).sort({createdAt: 'desc'}).limit(limit)

    return JSON.parse(JSON.stringify(product)) as IProduct[]
}


export async function getProductBySlug(slug: string){
    await connectToDatabase()
    const product = await Product.findOne({slug, isPublished: true})
    if(!product){
        throw new Error('Product not found')
    }

    return JSON.parse(JSON.stringify(product)) as IProduct
}

export async function getRelatedProductByCategory({
    category,
    productId,
    limit = PAGE_SIZE,
    page = 1
}:{ category: string, productId: string, limit?: number, page: number }){
    await connectToDatabase()

    const skipSize = (Number(page) -1) * limit

    const condition = {
        isPublished: true,
        category,
        _id: {$ne: productId}
    }

    const products = await Product.find(condition)
    .sort({numSales: 'desc'})
    .skip(skipSize)
    .limit(limit)

    const productCount = await Product.countDocuments(condition)

    const productData = {
        data: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPage: Math.ceil(productCount/limit)
    }

    return productData;

}