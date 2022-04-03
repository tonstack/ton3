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
- [get](HashmapE.md#get)
- [has](HashmapE.md#has)
- [set](HashmapE.md#set)
- [add](HashmapE.md#add)
- [replace](HashmapE.md#replace)
- [getSet](HashmapE.md#getset)
- [getAdd](HashmapE.md#getadd)
- [getReplace](HashmapE.md#getreplace)
- [delete](HashmapE.md#delete)
- [isEmpty](HashmapE.md#isempty)
- [forEach](HashmapE.md#foreach)
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

### has

▸ **has**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`boolean`

#### Inherited from

[Hashmap](Hashmap.md).[has](Hashmap.md#has)

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

### add

▸ **add**(`key`, `value`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Inherited from

[Hashmap](Hashmap.md).[add](Hashmap.md#add)

___

### replace

▸ **replace**(`key`, `value`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Inherited from

[Hashmap](Hashmap.md).[replace](Hashmap.md#replace)

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

#### Inherited from

[Hashmap](Hashmap.md).[getSet](Hashmap.md#getset)

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

#### Inherited from

[Hashmap](Hashmap.md).[getAdd](Hashmap.md#getadd)

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

#### Inherited from

[Hashmap](Hashmap.md).[getReplace](Hashmap.md#getreplace)

___

### delete

▸ **delete**(`key`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

#### Inherited from

[Hashmap](Hashmap.md).[delete](Hashmap.md#delete)

___

### isEmpty

▸ **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Hashmap](Hashmap.md).[isEmpty](Hashmap.md#isempty)

___

### forEach

▸ **forEach**(`callbackfn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`key`: `K`, `value`: `V`) => `void` |

#### Returns

`void`

#### Inherited from

[Hashmap](Hashmap.md).[forEach](Hashmap.md#foreach)

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
