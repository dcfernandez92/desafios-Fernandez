import {
    Router
} from 'express';
import {
    userModel
} from '../dao/models/user.model.js';

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const session = req.session;

        const findUser = await userModel.findOne({email});

        if (!findUser) {
            return res.status(401).json({message: "usuario no registrado/existente"});
        }

        if (findUser.password !== password) {
            return res.status(401).json({message: "password incorrecto"});
        }

        req.session.user = {
            ...findUser.toObject(),
            role: email === "adminCoder@coder.com" ? true : false,
            password: ''
        };

        res.redirect("/products");
    } catch (error) {
        console.log(error);
    }
});

router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const newUser = await userModel.create(body);
        req.session.user = {
            ...body
        }
        return res.render("login");
    } catch (error) {
        console.log(error);
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({
            message: `logout Error`,
            body: err
        });
    });
});

export default router;