import Decimal from 'decimal.js'

class Coins {
    private value: Decimal

    /**
     * Creates an instance of {@link Coins}
     *
     * @param {(Coins | bigint | number | string)} value
     * @param {boolean} [isNano=false] - Is argument value represented in nanocoins
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('100')
     *
     * new Coins(coins)
     * new Coins(BigInt('100'))
     * new Coins(100)
     * new Coins('100')
     * ```
     */
    constructor (value: Coins | bigint | number | string, isNano: boolean = false) {
        Coins.checkCoinsType(value)

        const nano = !isNano
            ? new Decimal(value.toString()).mul(1e9)
            : new Decimal(value.toString())

        this.value = nano
    }

    /**
     * Add value to instance value
     *
     * @param {(Coins | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10').add(9)
     *
     * console.log(coins.toString()) // '19'
     * ```
     *
     * @return {Coins} - Current instance reference
     */
    public add (value: Coins | bigint | number | string): Coins {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toString()).mul(1e9)

        this.value = this.value.add(nano)

        return this
    }

    /**
     * Subtract value from instance value
     *
     * @param {(Coins | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10').sub(9)
     *
     * console.log(coins.toString()) // '1'
     * ```
     *
     * @return {Coins} - Current instance reference
     */
    public sub (value: Coins | bigint | number | string): Coins {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toString()).mul(1e9)

        this.value = this.value.sub(nano)

        return this
    }

    /**
     * Multiplies instance value by value
     *
     * @param {(Coins | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10').mul(2)
     *
     * console.log(coins.toString()) // '20'
     * ```
     *
     * @return {Coins} - Current instance reference
     */
    public mul (value: Coins | bigint | number | string): Coins {
        Coins.checkCoinsType(value)

        const multiplier = value.toString()

        this.value = this.value.mul(multiplier)

        return this
    }

    /**
     * Divides instance value by value
     *
     * @param {(Coins | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10').div(2)
     *
     * console.log(coins.toString()) // '5'
     * ```
     *
     * @return {Coins} - Current instance reference
     */
    public div (value: Coins | bigint | number | string): Coins {
        Coins.checkCoinsType(value)

        const divider = new Decimal(value.toString())

        this.value = this.value.div(divider)

        return this
    }

    /**
     * Checks if instance value equal another {@link Coins} instance value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const notEqual = new Coins('11')
     *
     * console.log(equal.eq(coins), notEqual.eq(coins)) // true, false
     * ```
     *
     * @return {boolean}
     */
    public eq (value: Coins): boolean {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.eq(nano)
    }

    /**
     * Checks if instance value greater than another {@link Coins} instance value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const greater = new Coins('11')
     *
     * console.log(equal.gt(coins), greater.gt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public gt (value: Coins): boolean {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.gt(nano)
    }

    /**
     * Checks if instance value greater than or equal another {@link Coins} instance value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const greater = new Coins('11')
     *
     * console.log(equal.gte(coins), greater.gte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public gte (value: Coins): boolean {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.gte(nano)
    }

    /**
     * Checks if instance value lesser than another {@link Coins} instance value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const lesser = new Coins('9')
     *
     * console.log(equal.lt(coins), lesser.lt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public lt (value: Coins): boolean {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.lt(nano)
    }

    /**
     * Checks if instance value lesser than or equal another {@link Coins} instance value
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const lesser = new Coins('9')
     *
     * console.log(equal.lte(coins), lesser.lte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public lte (value: Coins): boolean {
        Coins.checkCoinsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.lte(nano)
    }

    /**
     * Checks if instance value is negative
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const zero = new Coins('0')
     * const negative = new Coins('-1')
     *
     * console.log(zero.isNegative(), negative.isNegative()) // false, true
     * ```
     *
     * @return {boolean}
     */
    public isNegative (): boolean {
        return this.value.isNegative()
    }

    /**
     * Checks if instance value is positive
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const zero = new Coins('0')
     * const positive = new Coins('1')
     *
     * console.log(zero.isPositive(), positive.isPositive()) // true, true
     * ```
     *
     * @return {boolean}
     */
    public isPositive (): boolean {
        return this.value.isPositive()
    }

    /**
     * Checks if instance value equals zero
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const zero = new Coins('0')
     *
     * console.log(zero.isZero()) // true
     * ```
     *
     * @return {boolean}
     */
    public isZero (): boolean {
        return this.value.isZero()
    }

    /**
     * Returns string representation of instance in coins
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('100')
     *
     * console.log(coins.toString()) // '100'
     * ```
     *
     * @return {string}
     */
    public toString (): string {
        const value = this.value.div(1e9).toFixed(9)
        // Remove all trailing zeroes
        const coins = value.replace(/\.0{9}$/, '')
            .replace(/(\.\d*?[1-9])0+$/, '$1')

        return coins
    }

    /**
     * Returns string representation of instance in nanocoins
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = new Coins('100')
     *
     * console.log(coins.toNano()) // '100000000000'
     * ```
     *
     * @return {string}
     */
    public toNano (): string {
        return this.value.toFixed(0)
    }

    private static checkCoinsType (coins: any): void {
        if (!Coins.isValid(coins)) {
            throw new Error('Invalid coins value')
        }
    }

    private static isValid (coins: any): boolean {
        return coins instanceof Coins
            || typeof coins === 'string'
            || typeof coins === 'number'
            || typeof coins === 'bigint'
    }

    /**
     * Creates instance of Coins from value in nano
     *
     * @static
     * @param {(bigint | number | string)} value - Value in nanocoins
     *
     * @example
     * ```ts
     * import { Coins } from '@tonstack/tontools'
     *
     * const coins = Coins.fromNano('100000000000')
     *
     * console.log(coins.toString()) // 100 coins
     * ```
     *
     * @return {Coins}
     */
    public static fromNano (value: bigint | number | string): Coins {
        Coins.checkCoinsType(value)

        return new Coins(value, true)
    }
}

export { Coins }
