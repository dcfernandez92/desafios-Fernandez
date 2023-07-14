import bcrypt from 'bcrypt';

const createHashValue = async (value) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hashSync(value, salt);
}

const isValidPasswd = async (psw, encryptPsw) => {
    const validValue = await bcrypt.compareSync(psw, encryptPsw);
    console.log(validValue)
    return validValue;
}

export {
    createHashValue,
    isValidPasswd
}