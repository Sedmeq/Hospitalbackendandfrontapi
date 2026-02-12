import axiosInstance from './axiosConfig';

export const chatApi = {
    sendMessage: (message) =>
        axiosInstance.post('/chat/Chatbot', { message }),
};
