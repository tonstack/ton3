[tontools](../README.md) / Address

# Class: Address

Smart contract address

## Table of contents

### Properties

- [NULL](Address.md#null)

### Constructors

- [constructor](Address.md#constructor)

### Methods

- [toString](Address.md#tostring)
- [setWorkchain](Address.md#setworkchain)
- [setBounceableFlag](Address.md#setbounceableflag)
- [setTestOnlyFlag](Address.md#settestonlyflag)
- [getHash](Address.md#gethash)
- [getWorkchain](Address.md#getworkchain)
- [isBounceable](Address.md#isbounceable)
- [isTestOnly](Address.md#istestonly)
- [isValid](Address.md#isvalid)

## Properties

### NULL

▪ `Static` `Readonly` **NULL**: `any` = `null`

Helper method for writing null addresses to [BitArray](BitArray.md)

**`static`**

## Constructors

### constructor

• **new Address**(`address`)

Creates an instance of [Address](Address.md)

Next formats can be used as constructor argument:
- Raw
- Base64
- Bytes containing Workchain ID and hash part
- Address

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const bytes = new Uint8Array() // containing Workchain ID and address hash bytes
const address = new Address('kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny')

new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
new Address(bytes)
new Address(address)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| [`Address`](Address.md) \| `Uint8Array` |

## Methods

### toString

▸ **toString**(`type?`, `urlSafe?`): `string`

Get raw or base64 representation of [Address](Address.md)

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)
    .setBounceableFlag(true)
    .setTestOnlyFlag(true)

console.log(address.toString('base64')) // kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
console.log(address.toString('base64', false)) // kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny
console.log(address.toString('raw')) // -1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`AddressType`](../README.md#addresstype) | `'base64'` |
| `urlSafe` | `boolean` | `true` |

#### Returns

`string`

___

### setWorkchain

▸ **setWorkchain**(`value`): [`Address`](Address.md)

Set int8 as Workchain ID

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

address.setWorkchain(0)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Address`](Address.md)

___

### setBounceableFlag

▸ **setBounceableFlag**(`value`): [`Address`](Address.md)

If the transaction has been aborted, and the inbound message has its bounceable flag set to true,
then it is "bounced" by automatically generating an outbound message (with the bounce flag clear) to its original sender

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

address.setBounceableFlag(true)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Address`](Address.md)

___

### setTestOnlyFlag

▸ **setTestOnlyFlag**(`value`): [`Address`](Address.md)

Set if address should not be accepted by software running in the production network

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

address.setTestOnlyFlag(true)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

[`Address`](Address.md)

___

### getHash

▸ **getHash**(): `Uint8Array`

Returns address hash as Uint8Array with 32 bytes length

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

console.log(address.getHash())
// Uint8Array(32) [
//     252, 185,  26,  58,  56,  22, 208, 247,
//     184, 194, 199,  97,   8, 184, 169, 188,
//     90, 107, 122,  85, 189, 121, 248, 171,
//     16,  28,  82, 219,  41,  35,  34,  96
// ]
```

#### Returns

`Uint8Array`

___

### getWorkchain

▸ **getWorkchain**(): `number`

Returns workchain as int8

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

console.log(address.getWorkchain()) // -1
```

#### Returns

`number`

___

### isBounceable

▸ **isBounceable**(): `boolean`

Returns value of bounceable flag

**`example`**
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

console.log(address.isBounceable()) // false
```

@return {boolean}

#### Returns

`boolean`

___

### isTestOnly

▸ **isTestOnly**(): `boolean`

Return value of test only flag

**`example`**
```ts
import { Address } from '@tonstack/tontools'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw)

console.log(address.isTestOnly()) // false
```

#### Returns

`boolean`

___

### isValid

▸ `Static` **isValid**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `any` |

#### Returns

`boolean`
