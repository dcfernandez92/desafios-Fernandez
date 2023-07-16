import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import {
    userModel
} from "../dao/models/user.model.js";
import {
    createHashValue,
    isValidPasswd
} from "../utils/encrypt.js";

const GITHUB_CLIENT_ID = '679fab28436081fe2d04';
const GITHUB_CLIENT_SECRET = 'c1d70c7e656749296b93ffbd6b2f812f5194bad5';

const LocalStrategy = local.Strategy;
const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const {
            first_name,
            last_name,
            email,
            age
        } = req.body;

        try {
            let user = await userModel.findOne({
                email: username
            });
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

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({
                email: username
            })
            if (!user) {
                return done(null, false);
            }
            console.log(typeof user.password)
            console.log(typeof password);
            if (!isValidPasswd(password, user.password)) {
                console.log("check 01")
                return done(null, false);
            }
            console.log("check 02")
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.use(
        "github",
        new GithubStrategy({
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/api/sessions/github/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("PROFILE INFO ******", profile);
                    let user = await userModel.findOne({
                        email: profile._json?.email
                    });
                    if (!user) {
                        let addNewUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            email: profile._json?.email,
                            age: 0,
                            password: "",
                        };
                        let newUser = await userModel.create(addNewUser);
                        done(null, newUser);
                    } else {
                        // ya existia el usuario
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({
            _id: id
        });
        done(null, user);
    });
};

export default initializePassport;