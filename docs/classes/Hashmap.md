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
- [get](Hashmap.md#get)
- [has](Hashmap.md#has)
- [set](Hashmap.md#set)
- [add](Hashmap.md#add)
- [replace](Hashmap.md#replace)
- [getSet](Hashmap.md#getset)
- [getAdd](Hashmap.md#getadd)
- [getReplace](Hashmap.md#getreplace)
- [delete](Hashmap.md#delete)
- [isEmpty](Hashmap.md#isempty)
- [forEach](Hashmap.md#foreach)
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

### get

▸ **get**(`key`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`V`

___

### has

▸ **has**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`boolean`

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

### add

▸ **add**(`key`, `value`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`Hashmap`](Hashmap.md)<`K`, `V`\>

___

### replace

▸ **replace**(`key`, `value`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`Hashmap`](Hashmap.md)<`K`, `V`\>

___

### getSet

▸ **getSet**(`key`, `value`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

`V`

___

### getAdd

▸ **getAdd**(`key`, `value`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

`V`

___

### getReplace

▸ **getReplace**(`key`, `value`): `V`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

`V`

___

### delete

▸ **delete**(`key`): [`Hashmap`](Hashmap.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

[`Hashmap`](Hashmap.md)<`K`, `V`\>

___

### isEmpty

▸ **isEmpty**(): `boolean`

#### Returns

`boolean`

___

### forEach

▸ **forEach**(`callbackfn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`key`: `K`, `value`: `V`) => `void` |

#### Returns

`void`

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
