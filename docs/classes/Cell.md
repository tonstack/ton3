[@tonstack/tontools](../README.md) / Cell

# Class: Cell

## Table of contents

### Accessors

- [bits](Cell.md#bits)
- [refs](Cell.md#refs)
- [exotic](Cell.md#exotic)
- [descriptors](Cell.md#descriptors)
- [augmentedBits](Cell.md#augmentedbits)

### Constructors

- [constructor](Cell.md#constructor)

### Methods

- [hash](Cell.md#hash)
- [print](Cell.md#print)
- [parse](Cell.md#parse)

## Accessors

### bits

• `get` **bits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### refs

• `get` **refs**(): [`Cell`](Cell.md)[]

#### Returns

[`Cell`](Cell.md)[]

___

### exotic

• `get` **exotic**(): `boolean`

#### Returns

`boolean`

___

### descriptors

• `get` **descriptors**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### augmentedBits

• `get` **augmentedBits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

## Constructors

### constructor

• **new Cell**(`bits?`, `refs?`, `exotic?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] | `[]` |
| `refs` | [`Cell`](Cell.md)[] | `[]` |
| `exotic` | `boolean` | `false` |

## Methods

### hash

▸ **hash**(): `string`

#### Returns

`string`

___

### print

▸ **print**(`indent?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `indent` | `string` | `''` |

#### Returns

`string`

___

### parse

▸ **parse**(): [`Slice`](Slice.md)

#### Returns

[`Slice`](Slice.md)
