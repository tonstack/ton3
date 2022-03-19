[tontools](../README.md) / BitArray

# Class: BitArray

## Table of contents

### Constructors

- [constructor](BitArray.md#constructor)

### Accessors

- [length](BitArray.md#length)
- [remainder](BitArray.md#remainder)

### Methods

- [getBit](BitArray.md#getbit)
- [getBits](BitArray.md#getbits)
- [getBytes](BitArray.md#getbytes)
- [writeBit](BitArray.md#writebit)
- [writeBits](BitArray.md#writebits)
- [writeInt](BitArray.md#writeint)
- [writeUint](BitArray.md#writeuint)
- [writeBytes](BitArray.md#writebytes)
- [writeAddress](BitArray.md#writeaddress)
- [writeCoins](BitArray.md#writecoins)
- [writeFiftHex](BitArray.md#writefifthex)
- [writeString](BitArray.md#writestring)
- [append](BitArray.md#append)
- [clone](BitArray.md#clone)
- [toString](BitArray.md#tostring)
- [fromFiftHex](BitArray.md#fromfifthex)
- [topUp](BitArray.md#topup)
- [backUp](BitArray.md#backup)

## Constructors

### constructor

• **new BitArray**()

## Accessors

### length

• `get` **length**(): `number`

Total size of [BitArray](BitArray.md) in bits (1023 bits max)

**`readonly`**

#### Returns

`number`

___

### remainder

• `get` **remainder**(): `number`

Free space left of [BitArray](BitArray.md) in bits (1023 bits max)

**`readonly`**

#### Returns

`number`

## Methods

### getBit

▸ **getBit**(`pointer`): [`Bit`](../README.md#bit)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pointer` | `number` |

#### Returns

[`Bit`](../README.md#bit)

___

### getBits

▸ **getBits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### getBytes

▸ **getBytes**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### writeBit

▸ **writeBit**(`bit`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bit` | `number` |

#### Returns

[`BitArray`](BitArray.md)

___

### writeBits

▸ **writeBits**(`bits`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] |

#### Returns

[`BitArray`](BitArray.md)

___

### writeInt

▸ **writeInt**(`value`, `length`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| `bigint` |
| `length` | `number` |

#### Returns

[`BitArray`](BitArray.md)

___

### writeUint

▸ **writeUint**(`value`, `length`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| `bigint` |
| `length` | `number` |

#### Returns

[`BitArray`](BitArray.md)

___

### writeBytes

▸ **writeBytes**(`value`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Uint8Array` \| `number`[] |

#### Returns

[`BitArray`](BitArray.md)

___

### writeAddress

▸ **writeAddress**(`address`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](Address.md) |

#### Returns

[`BitArray`](BitArray.md)

___

### writeCoins

▸ **writeCoins**(`value`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

[`BitArray`](BitArray.md)

___

### writeFiftHex

▸ **writeFiftHex**(`value`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`BitArray`](BitArray.md)

___

### writeString

▸ **writeString**(`value`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`BitArray`](BitArray.md)

___

### append

▸ **append**(`data`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`BitArray`](BitArray.md) |

#### Returns

[`BitArray`](BitArray.md)

___

### clone

▸ **clone**(): [`BitArray`](BitArray.md)

#### Returns

[`BitArray`](BitArray.md)

___

### toString

▸ **toString**(`type?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | ``"bits"`` \| ``"fift"`` \| ``"hex"`` | `'bits'` |

#### Returns

`string`

___

### fromFiftHex

▸ **fromFiftHex**(`fift`): [`BitArray`](BitArray.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fift` | `string` |

#### Returns

[`BitArray`](BitArray.md)

___

### topUp

▸ **topUp**(`toModulo?`): [`BitArray`](BitArray.md)

Top up bits with 1 and leading 0 to be divisible by 8 or 4 without remainder
Mostly used for [BoC](BoC.md) serialization

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `toModulo` | ``4`` \| ``8`` | `8` |

#### Returns

[`BitArray`](BitArray.md)

___

### backUp

▸ **backUp**(): [`BitArray`](BitArray.md)

Remove topped up bits from {@link BitArray.topUp()} operation
Mostly used for [BoC](BoC.md) deserialization

#### Returns

[`BitArray`](BitArray.md)
