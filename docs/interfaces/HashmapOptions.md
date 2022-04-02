[@tonstack/tontools](../README.md) / HashmapOptions

# Interface: HashmapOptions<K, V\>

## Type parameters

| Name |
| :------ |
| `K` |
| `V` |

## Table of contents

### Properties

- [keySize](HashmapOptions.md#keysize)
- [prefixed](HashmapOptions.md#prefixed)
- [nonEmpty](HashmapOptions.md#nonempty)
- [serializers](HashmapOptions.md#serializers)
- [deserializers](HashmapOptions.md#deserializers)

## Properties

### keySize

• `Optional` **keySize**: `number` \| ``"auto"``

___

### prefixed

• `Optional` **prefixed**: `boolean` \| ``"auto"``

___

### nonEmpty

• `Optional` **nonEmpty**: `boolean`

___

### serializers

• `Optional` **serializers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | (`key`: `K`) => [`Bit`](../README.md#bit)[] |
| `value` | (`value`: `V`) => [`Cell`](../classes/Cell.md) |

___

### deserializers

• `Optional` **deserializers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | (`key`: [`Bit`](../README.md#bit)[]) => `K` |
| `value` | (`value`: [`Cell`](../classes/Cell.md)) => `V` |
