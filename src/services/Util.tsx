import { IUtil } from '../interfaces';

export class Util implements IUtil {
    readonly randomChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    generateRandomString(length: number) {
        const stringList = [];
        for (let i = 0; i < length; ++i) {
            stringList.push(this.randomChars.charAt(
                Math.floor(Math.random() * this.randomChars.length)));
        }
        return stringList.join('');
    }
}
