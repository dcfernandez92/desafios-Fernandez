import { Router } from 'express';
import ProductManager from '../dao/managers/products.manager.js';
import MessageManager from '../dao/managers/message.manager.js';
import { productModel } from "../dao/models/product.model.js";
import CartManager from '../dao/managers/carts.manager.js'
import authMdw from '../middleware/auth.middleware.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

router.get('/products', authMdw, async (req, res) => {
    let {
        limit = 10, page = 1, sort, query, category, availability
    } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
        page,
        limit,
        sort: { price: sort === 'desc' ? -1 : 1 },
        lean: true
    };

    const filter = {};

    if (query) {
        filter.title = {
            $regex: query,
            $options: 'i'
        };
    }
    if (category && category !== 'undefined') {
        filter.category = category;
    }
    if (availability) {
        if (availability === 'available') {
            filter.stock = {
                $gt: 0
            };
        } else if (availability === 'out-of-stock') {
            filter.stock = 0;
        }
    }

    let result = await productModel.paginate(filter, options);

    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages);
    console.log(result)
    const user = req.session.user;
    console.log(user)
    res.render('products', {
        user: req.session.user,
        ...result
    });
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const {
            cid
        } = req.params;
        const cart = await cartManager.getCartById(cid);

        const products = await Promise.all(
            cart.products.map(async (product) => {
                const productId = product.productId;
                const productData = await productModel.findById(productId);
                return productData.toObject();
            })
        );

        res.render('cart', {
            cart: cart.toObject(),
            products
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            payload: err.message
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', {
        products
    });
});

router.get('/chat', async (req, res) => {
    const messages = await messageManager.getMessages();
    const simplifiedMessages = messages.map(message => message.toObject());
    res.render('chat', {
        messages: simplifiedMessages
    });
});

router.post('/api/messages', async (req, res) => {
    const {
        user,
        message
    } = req.body;
    const newMessage = await messageManager.addMessage(user, message);

    // Obtener el índice del nuevo mensaje
    const messages = await messageManager.getMessages();
    const index = messages.findIndex(m => m._id.toString() === newMessage._id.toString());

    res.json({
        ...newMessage.toObject(),
        index
    });
});

//Session
router.get("/login", async (req,res) => {
    if(req.session.user) return res.redirect('products');
    res.render('login');
})

router.get("/register", async (req,res) => {
    if(req.session.user) return res.redirect('products');
    res.render('register');
})

router.get("/profile", authMdw,  async (req,res) => {
    const user = req.session.user;
    console.log(user);

    res.render("profile", {
        user
    });
});


export default router;