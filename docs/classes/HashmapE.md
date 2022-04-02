[@tonstack/tontools](../README.md) / HashmapE

# Class: HashmapE<K, V\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

## Hierarchy

- [`Hashmap`](Hashmap.md)<`K`, `V`\>

  ↳ **`HashmapE`**

## Table of contents

### Methods

- [[iterator]](HashmapE.md#[iterator])
- [set](HashmapE.md#set)
- [setRaw](HashmapE.md#setraw)
- [get](HashmapE.md#get)
- [getRaw](HashmapE.md#getraw)
- [cell](HashmapE.md#cell)
- [parse](HashmapE.md#parse)

### Constructors

- [constructor](HashmapE.md#constructor)

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<[`K`, `V`]\>

#### Returns

`IterableIterator`<[`K`, `V`]\>

#### Inherited from

[Hashmap](Hashmap.md).[[iterator]](Hashmap.md#[iterator])

___

### set

▸ **set**(`key`, `value`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Inherited from

[Hashmap](Hashmap.md).[set](Hashmap.md#set)

___

### setRaw

▸ **setRaw**(`key`, `value`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Bit`](../README.md#bit)[] |
| `value` | [`Cell`](Cell.md) |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Inherited from

[Hashmap](Hashmap.md).[setRaw](Hashmap.md#setraw)

___

### get

▸ **get**(`key`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`V`

#### Inherited from

[Hashmap](Hashmap.md).[get](Hashmap.md#get)

___

### getRaw

▸ **getRaw**(`key`): [`Cell`](Cell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Bit`](../README.md#bit)[] |

#### Returns

[`Cell`](Cell.md)

#### Inherited from

[Hashmap](Hashmap.md).[getRaw](Hashmap.md#getraw)

___

### cell

▸ **cell**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

#### Inherited from

[Hashmap](Hashmap.md).[cell](Hashmap.md#cell)

___

### parse

▸ `Static` **parse**<`K`, `V`\>(`slice`, `keySize`, `options?`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `slice` | [`Slice`](Slice.md) |
| `keySize` | `number` |
| `options?` | [`HashmapOptions`](../interfaces/HashmapOptions.md)<`K`, `V`\> |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Overrides

[Hashmap](Hashmap.md).[parse](Hashmap.md#parse)

## Constructors

### constructor

• **new HashmapE**<`K`, `V`\>(`keySize`, `options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySize` | `number` |
| `options?` | [`HashmapOptions`](../interfaces/HashmapOptions.md)<`K`, `V`\> |

#### Overrides

[Hashmap](Hashmap.md).[constructor](Hashmap.md#constructor)
