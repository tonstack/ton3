[@tonstack/tontools](../README.md) / Address

# Class: Address

Smart contract address

## Table of contents

### Properties

- [NULL](Address.md#null)

### Constructors

- [constructor](Address.md#constructor)

### Accessors

- [hash](Address.md#hash)
- [workchain](Address.md#workchain)
- [bounceable](Address.md#bounceable)
- [testOnly](Address.md#testonly)

### Methods

- [toString](Address.md#tostring)
- [isValid](Address.md#isvalid)

## Properties

### NULL

▪ `Static` `Readonly` **NULL**: `any` = `null`

Helper method for writing null addresses to {@link BitArray}

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

## Accessors

### hash

• `get` **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### workchain

• `get` **workchain**(): `number`

#### Returns

`number`

• `set` **workchain**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

___

### bounceable

• `get` **bounceable**(): `boolean`

#### Returns

`boolean`

• `set` **bounceable**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

___

### testOnly

• `get` **testOnly**(): `boolean`

#### Returns

`boolean`

• `set` **testOnly**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

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

### isValid

▸ `Static` **isValid**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `any` |

#### Returns

`boolean`
