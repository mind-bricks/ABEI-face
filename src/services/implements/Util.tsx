import { IUtilService } from '..';

export class UtilService implements IUtilService {
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
