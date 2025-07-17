import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DecodedToken {
  exp: number;
  iat: number;
  profileId: string;
  rol: string;
}

export const decodeJwt = (token: string): DecodedToken => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        throw error;
    }
};

export const getUserInfoFromToken = async (): Promise<DecodedToken> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    return decodeJwt(token);
};