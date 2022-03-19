[tontools](../README.md) / Cell

# Class: Cell

## Table of contents

### Properties

- [bits](Cell.md#bits)
- [refs](Cell.md#refs)
- [isExotic](Cell.md#isexotic)

### Constructors

- [constructor](Cell.md#constructor)

### Methods

- [concat](Cell.md#concat)
- [maxDepth](Cell.md#maxdepth)
- [refsDescriptor](Cell.md#refsdescriptor)
- [bitsDescriptor](Cell.md#bitsdescriptor)
- [toSlice](Cell.md#toslice)
- [hash](Cell.md#hash)
- [print](Cell.md#print)

## Properties

### bits

• **bits**: [`BitArray`](BitArray.md)

___

### refs

• **refs**: [`Cell`](Cell.md)[]

___

### isExotic

• **isExotic**: `boolean`

## Constructors

### constructor

• **new Cell**()

## Methods

### concat

▸ **concat**(`cell`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

#### Returns

`void`

___

### maxDepth

▸ **maxDepth**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### refsDescriptor

▸ **refsDescriptor**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### bitsDescriptor

▸ **bitsDescriptor**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### toSlice

▸ **toSlice**(): [`Slice`](Slice.md)

#### Returns

[`Slice`](Slice.md)

___

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
