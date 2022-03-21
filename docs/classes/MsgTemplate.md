[@tonstack/tontools](../README.md) / MsgTemplate

# Class: MsgTemplate

## Table of contents

### Methods

- [ExtInMsgInfo$10](MsgTemplate.md#extinmsginfo$10)
- [MessageX](MsgTemplate.md#messagex)

### Constructors

- [constructor](MsgTemplate.md#constructor)

## Methods

### ExtInMsgInfo$10

▸ `Static` **ExtInMsgInfo$10**(`dest`, `src?`, `importFee?`): [`Cell`](Cell.md)

Creates a new `CommonMsgInfo` with `ext_in_msg_info$10` prefix

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dest` | [`Address`](Address.md) | `undefined` |
| `src` | [`Address`](Address.md) | `Address.NULL` |
| `importFee` | [`Coins`](Coins.md) | `undefined` |

#### Returns

[`Cell`](Cell.md)

___

### MessageX

▸ `Static` **MessageX**(`info`, `init`, `body`): [`Cell`](Cell.md)

 Creates a new MessageX

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`Cell`](Cell.md) |
| `init` | [`Cell`](Cell.md) |
| `body` | [`Cell`](Cell.md) |

#### Returns

[`Cell`](Cell.md)

## Constructors

### constructor

• **new MsgTemplate**()
