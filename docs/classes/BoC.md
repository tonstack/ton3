[tontools](../README.md) / BoC

# Class: BoC

## Table of contents

### Constructors

- [constructor](BoC.md#constructor)

### Properties

- [root](BoC.md#root)

### Methods

- [from](BoC.md#from)
- [toBytes](BoC.md#tobytes)
- [toHex](BoC.md#tohex)

## Constructors

### constructor

• **new BoC**(`cells?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cells` | [`Cell`](Cell.md)[] | `[]` |

## Properties

### root

• **root**: [`Cell`](Cell.md)[]

## Methods

### from

▸ `Static` **from**(`data`, `type?`): [`BoC`](BoC.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `string` \| `Uint8Array` | `undefined` |
| `type` | ``"fift"`` \| ``"hex"`` \| ``"bytes"`` | `'bytes'` |

#### Returns

[`BoC`](BoC.md)

___

### toBytes

▸ **toBytes**(`options?`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SerializationOptions`](../interfaces/SerializationOptions.md) |

#### Returns

`Uint8Array`

___

### toHex

▸ **toHex**(`options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SerializationOptions`](../interfaces/SerializationOptions.md) |

#### Returns

`string`
