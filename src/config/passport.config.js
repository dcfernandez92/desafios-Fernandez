import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";


const LocalStrategy = local.Strategy;
const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await userModel.findOne({email: username });
            if (!user) {
                const addNewUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: await createHashValue(password)
                };
                let newUser = await userModel.create(addNewUser);
                return done(null, newUser);
            } else {
                return done(null, user);
            }
        } catch (err) {
            return done("Error al obtener el usuario: " + err);
        }
    }));

    passport.use('login', new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
        try{
            const user = await userModel.findOne({email:username})
            if(!user){
                return done(null,false);
            }
            console.log(typeof user.password)
            console.log(typeof password);
            if(!isValidPasswd(password,user.password)){
                console.log("check 01")
                return done(null,false);
            }
            console.log("check 02")
            return done(null,user);
        }catch(err){
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({_id: id});
        done(null, user);
    });
};

export default initializePassport;