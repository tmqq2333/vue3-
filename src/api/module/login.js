import request from '@/utils/axios';

/**
 * 登录
 */
 
export const login = (username, password) => {
    return request({
        url: '/api/auth/login',
        method: 'post',
        data: {
            username,
            password
        }
    });
};