const { Client, Account, Users, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject('670ad826002ece434464')
    .setKey('standard_9e12cf9e7e1506973e6bd234d2f4e108ed3b4c539ee671f9023221be7c3022a81d896fafe8475f56cc5e5510c655605606850edff7d8be2b24961ddc247bc54c0adc93faa6ca49f20712d9a17d5af78e00aa98b022664b95ad0e702db44087925b6cc9dd8872e6e80e48366b8930bb1de579b5d27f1cdbbb0bc61a22a63bd85c')

    
const account = new Account(client);

const users = new Users(client);
      
const createAdminAccount = async (email, password) => {
    try{

        if(!email || !password) throw 'Email or password missing'

        const randomID = ID.unique()

        const result = await account.create(
            randomID, // userId
            email, // email
            password, // password
            'BillPoint POS Admin' // name (optional)
        );
        
        return result
        
    }
    catch(err){
        console.log(err)
        throw err
    }
}


 const signinAdminAccount = async (email, password) => {
    try{

        const result = await account.createEmailPasswordSession(
            email, // email
            password // password
        );
        
        
        console.log(result);
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

 const changeForgottenPassword = async (userId, password) => {
    try {
        console.log(userId, password)
        if (!userId || !password) throw 'Missing Parameters';

        const result = await users.updatePassword(userId, password);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const sendEmailOneTimePassword = async (userId, email) => {
    try {
        const randomID = ID.unique();
        const result = await account.createEmailToken(randomID, email, false);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


const verifyUserOneTimePassword = async (userId, otp) => {
    try {
        const result = await account.createSession(userId, otp);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


const logoutUser = async (userId) => {
    try {
        if (!userId) return null;
        const result = await users.deleteSessions(userId);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


module.exports = {
    createAdminAccount,
    signinAdminAccount,
    verifyUserOneTimePassword,
    sendEmailOneTimePassword,
    changeForgottenPassword,
    logoutUser
}