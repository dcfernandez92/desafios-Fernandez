import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import passport from 'passport';

const router = Router();

router.post("/login", passport.authenticate('login',{failureRedirect: '/faillogin'}),async (req, res) => {
    
    if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"})
    req.session.user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age : req.user.age,
        email : req.user.email
    }
    res.send({status:"success",payload:req.user})
    // try {
    //     const { email, password } = req.body;
    //     const session = req.session;

    //     const findUser = await userModel.findOne({email});

    //     if (!findUser) {
    //         return res.status(401).json({message: "usuario no registrado/existente"});
    //     }

    //     if (findUser.password !== password) {
    //         return res.status(401).json({message: "password incorrecto"});
    //     }

    //     req.session.user = {
    //         ...findUser.toObject(),
    //         role: email === "adminCoder@coder.com" ? true : false,
    //         password: ''
    //     };

    //     res.redirect("/products");
    // } catch (error) {
    //     console.log(error);
    // }
});

router.get('/faillogin', (req,res) =>{
    res.send({error:"Failed Login"});
})

router.post("/register", passport.authenticate('register',{failureRedirect: '/failregister'}), async (req, res) => {    
    return res.render("login");    
});

router.get('/failregister', async(req,res) => {
    res.send({error: "Failed"})
})

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