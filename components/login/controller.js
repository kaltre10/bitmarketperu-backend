const store = require('./store');
const authStore = require('../auth/store')
const jwt = require('jsonwebtoken');

const auth = ({ email, password, name, dni, phone }) => {
    return new Promise(async (resolve, reject) => {
        try {

            email = email.toLowerCase().trim();
            let checkUser = await getUser(email);

            if (checkUser) {
                resolve({
                    error: "El correo electrónico ya existe!",
                })
                return
            }

            const newUser = await addUser(email, password, name, dni, phone);
            //crear token 
            const dataUser = jwt.sign({
                newUser
            }, process.env.DATA_TOKEN, { expiresIn: '24h' });

            let getNewUser = await getUser(email);  //again

            resolve({
                message: "successfully added",
                token: dataUser,
                email: getNewUser.email,
                level: getNewUser.level,
                kyc: getNewUser.kyc,
                // wallet: checkUser.wallet,
                // config,
                // banksAdmin,
                // banksUser
            });

        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
};

const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {

            email = email.toLowerCase().trim();
            const user = await getUser(email);

            if (!email) throw 'Usuario no encontrado';

            if (password !== user.password) throw 'Contraseña invalida';

            const config = await authStore.getConfig();
            const userAdmin = await store.getUserAdmin();
  
            let banksAdmin = [];
            if(userAdmin){
                banksAdmin = await store.getBanksAdmin(userAdmin._id);
            }

            //crear token 
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                phone: user.phone,
                dni: user.dni,
                level: user.level,
                kyc: user.kyc,
                _id: user._id,
                banksAdmin
            }, process.env.DATA_TOKEN, { expiresIn: '24h' });

            resolve({
                message: "successfully",
                token,
                config,
                email: user.email,
                level: user.level,
                kyc: user.kyc,
                dni: user.dni,
                name: user.name,
                phone: user.phone,
                _id: user._id,
                banksAdmin
            });

        } catch (error) {
            reject(error);
        }
    });
}


const addUser = async (email, password, name, dni, phone) => await store.add(email, password, name, dni, phone);
const getUser = async (email) => await store.get(email);

module.exports = {
    auth,
    login,
    getUser
}