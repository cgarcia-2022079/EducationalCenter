import { compare, hash } from 'bcrypt';

export const encrypt = async (password) => {
    try {
        const hashedPassword = await hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const checkPassword = async (password, hashedPassword) => {
    try {
        return await compare(password, hashedPassword);
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const checkUpdate = (data, userId) => {
    if (userId) {
        if (Object.entries(data).length === 0 || data.password || data.password === '' || data.role || data.role === '') {
            return false;
        }
        return true;
    } else {
        if (
            Object.entries(data).length === 0 ||
            data.students ||
            data.students === '' ||
            data.teachers ||
            data.teachers === ''
        ) {
            return false;
        }
        return true;
    }
};