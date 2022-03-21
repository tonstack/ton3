[@tonstack/tontools](../README.md) / Builder

# Class: Builder

## Table of contents

### Methods

- [augmentBits](Builder.md#augmentbits)
- [storeSlice](Builder.md#storeslice)
- [storeRef](Builder.md#storeref)
- [storeBit](Builder.md#storebit)
- [storeBits](Builder.md#storebits)
- [storeInt](Builder.md#storeint)
- [storeUint](Builder.md#storeuint)
- [storeBytes](Builder.md#storebytes)
- [storeString](Builder.md#storestring)
- [storeAddress](Builder.md#storeaddress)
- [storeCoins](Builder.md#storecoins)
- [clone](Builder.md#clone)
- [rollbackBits](Builder.md#rollbackbits)
- [cell](Builder.md#cell)

### Constructors

- [constructor](Builder.md#constructor)

### Accessors

- [size](Builder.md#size)
- [bits](Builder.md#bits)
- [bytes](Builder.md#bytes)
- [refs](Builder.md#refs)
- [remainder](Builder.md#remainder)

## Methods

### augmentBits

▸ `Static` **augmentBits**(`bits`, `divider?`): [`Bit`](../README.md#bit)[]

Augment bits with 1 and leading 0 to be divisible by 8 or 4 without remainder.
Mostly used for {@link BoC} serialization or [Cell](Cell.md) hash calculations.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] | `undefined` | Bits which need to be augmented. |
| `divider` | ``4`` \| ``8`` | `8` | - |

#### Returns

[`Bit`](../README.md#bit)[]

___

### storeSlice

▸ **storeSlice**(`slice`): [`Builder`](Builder.md)

Merge [Slice](Slice.md) into instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slice` | [`Slice`](Slice.md) | An instance of a [Slice](Slice.md). |

#### Returns

[`Builder`](Builder.md)

___

### storeRef

▸ **storeRef**(`ref`): [`Builder`](Builder.md)

Add cell to instance refs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ref` | [`Cell`](Cell.md) | Cell |

#### Returns

[`Builder`](Builder.md)

___

### storeBit

▸ **storeBit**(`bit`): [`Builder`](Builder.md)

Store one bit in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bit` | `number` | 1 or 0. |

#### Returns

[`Builder`](Builder.md)

___

### storeBits

▸ **storeBits**(`bits`): [`Builder`](Builder.md)

Store multiple bits as array in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] | Array of 1 and/or 0. |

#### Returns

[`Builder`](Builder.md)

___

### storeInt

▸ **storeInt**(`value`, `length`): [`Builder`](Builder.md)

Store an integer in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` \| `bigint` | Int. |
| `length` | `number` | Size in bits of allocated space for value. |

#### Returns

[`Builder`](Builder.md)

___

### storeUint

▸ **storeUint**(`value`, `length`): [`Builder`](Builder.md)

Store an unsigned integer in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` \| `bigint` | UInt. |
| `length` | `number` | Size in bits of allocated space for value. |

#### Returns

[`Builder`](Builder.md)

___

### storeBytes

▸ **storeBytes**(`value`): [`Builder`](Builder.md)

Store a bytes array in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Uint8Array` \| `number`[] | Array of bytes. |

#### Returns

[`Builder`](Builder.md)

___

### storeString

▸ **storeString**(`value`): [`Builder`](Builder.md)

Store a string in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | Any string, Unicode is suppported. |

#### Returns

[`Builder`](Builder.md)

___

### storeAddress

▸ **storeAddress**(`address`): [`Builder`](Builder.md)

Store an [Address](Address.md) in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](Address.md) | Smart contract address as [Address](Address.md) or as null. |

#### Returns

[`Builder`](Builder.md)

___

### storeCoins

▸ **storeCoins**(`coins`): [`Builder`](Builder.md)

Store a [Coins](Coins.md) in instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `coins` | [`Coins`](Coins.md) | Toncoin as [Coins](Coins.md). |

#### Returns

[`Builder`](Builder.md)

___

### clone

▸ **clone**(): [`Builder`](Builder.md)

Returns this instance copy as a new instance.

#### Returns

[`Builder`](Builder.md)

___

### rollbackBits

▸ `Static` **rollbackBits**(`bits`): [`Bit`](../README.md#bit)[]

Remove augmented bits.
Mostly used for {@link BoC} serialization or [Cell](Cell.md) hash calculations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] | Bits which needs to be cleared from augmented bits. |

#### Returns

[`Bit`](../README.md#bit)[]

___

### cell

▸ **cell**(): [`Cell`](Cell.md)

Returns builded [Cell](Cell.md).

**`example`**
```typescript
import { Builder } from '@tonstack/tontools'

const bits = [ 1, 0, 0, 1 ]
const cell = new Builder(bits.length)
    .storeBits(bits)
    .cell()
```

#### Returns

[`Cell`](Cell.md)

## Constructors

### constructor

• **new Builder**(`size?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `1023` |

## Accessors

### size

• `get` **size**(): `number`

Returns instance maximum allowed size in bits.

**`readonly`**

#### Returns

`number`

___

### bits

• `get` **bits**(): [`Bit`](../README.md#bit)[]

Returns instance stored bits [Bit](../README.md#bit).

**`readonly`**

#### Returns

[`Bit`](../README.md#bit)[]

___

### bytes

• `get` **bytes**(): `Uint8Array`

Returns instance stored bits in bytes.

**`readonly`**

#### Returns

`Uint8Array`

___

### refs

• `get` **refs**(): [`Cell`](Cell.md)[]

Returns instance stored refs [Cell](Cell.md).

**`readonly`**

#### Returns

[`Cell`](Cell.md)[]

___

### remainder

• `get` **remainder**(): `number`

Returns instance unused space in bits.

**`readonly`**

#### Returns

`number`
