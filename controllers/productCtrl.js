const Products = require('../models/productModel')


class APIfeature {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.body
        console.log({ before: queryObj }); //before delete page

        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.forEach(el => delete (queryObj[el]))
        console.log({ after: queryObj }); //after delete page

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match =>`$${match}`)
        console.log({ queryObj, queryStr });
        return this
    }

    sorting() { }

    paginating() { }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeature(Products.find(), req.query).filtering()
            const products = await features.query
            res.json(products)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ msg: "no image uploaded" })
            const product = await Products.findOne({ product_id })
            if (product)
                return res.status(400).json({ msg: "This product is already exist." })
            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            await newProduct.save()
            res.json({ msg: "Created a product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProducts: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "product deleted" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body
            if (!images) return res.status(400).json({ msg: "no image uploaded" })
            await Products.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), price, description, content, images, category
            })
            res.json({ msg: "Updated a product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = productCtrl