export class RandomProvider {
    readonly randomChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    getString(length: number, prefix?: string) {
        const stringList = prefix ? [prefix] : [];
        for (let i = 0; i < length; ++i) {
            stringList.push(this.randomChars.charAt(
                Math.floor(Math.random() * this.randomChars.length)));
        }
        return stringList.join('');
    }
}