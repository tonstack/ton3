[@tonstack/tontools](../README.md) / Hashmap

# Class: Hashmap<K, V\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

## Hierarchy

- **`Hashmap`**

  ↳ [`HashmapE`](HashmapE.md)

## Table of contents

### Methods

- [[iterator]](Hashmap.md#[iterator])
- [set](Hashmap.md#set)
- [setRaw](Hashmap.md#setraw)
- [get](Hashmap.md#get)
- [getRaw](Hashmap.md#getraw)
- [cell](Hashmap.md#cell)
- [parse](Hashmap.md#parse)

### Constructors

- [constructor](Hashmap.md#constructor)

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<[`K`, `V`]\>

#### Returns

`IterableIterator`<[`K`, `V`]\>

___

### set

▸ **set**(`key`, `value`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`Hashmap`](Hashmap.md)<`K`, `V`\>

___

### setRaw

▸ **setRaw**(`key`, `value`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Bit`](../README.md#bit)[] |
| `value` | [`Cell`](Cell.md) |

#### Returns

[`Hashmap`](Hashmap.md)<`K`, `V`\>

___

### get

▸ **get**(`key`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`V`

___

### getRaw

▸ **getRaw**(`key`): [`Cell`](Cell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Bit`](../README.md#bit)[] |

#### Returns

[`Cell`](Cell.md)

___

### cell

▸ **cell**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

___

### parse

▸ `Static` **parse**<`K`, `V`\>(`slice`, `keySize`, `options?`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

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

[`Hashmap`](Hashmap.md)<`K`, `V`\>

## Constructors

### constructor

• **new Hashmap**<`K`, `V`\>(`keySize`, `options?`)

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
