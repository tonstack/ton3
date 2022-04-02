[@tonstack/tontools](../README.md) / WalletV3Contract

# Class: WalletV3Contract

## Hierarchy

- [`Wallet`](Wallet.md)

  ↳ **`WalletV3Contract`**

## Table of contents

### Methods

- [addTransfers](WalletV3Contract.md#addtransfers)
- [simpleTextMsg](WalletV3Contract.md#simpletextmsg)
- [sendTransfersExtMsg](WalletV3Contract.md#sendtransfersextmsg)
- [deployExtMsg](WalletV3Contract.md#deployextmsg)
- [cleanUpTransfers](WalletV3Contract.md#cleanuptransfers)

### Constructors

- [constructor](WalletV3Contract.md#constructor)

### Accessors

- [subWalletID](WalletV3Contract.md#subwalletid)
- [keyPair](WalletV3Contract.md#keypair)
- [code](WalletV3Contract.md#code)
- [stateInit](WalletV3Contract.md#stateinit)
- [address](WalletV3Contract.md#address)
- [transfers](WalletV3Contract.md#transfers)

## Methods

### addTransfers

▸ **addTransfers**(`transfers`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transfers` | [`WalletTransfer`](../interfaces/WalletTransfer.md)[] |

#### Returns

`void`

___

### simpleTextMsg

▸ `Static` **simpleTextMsg**(`text`): [`Cell`](Cell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

[`Cell`](Cell.md)

___

### sendTransfersExtMsg

▸ **sendTransfersExtMsg**(`seqno`, `timeout?`, `cleanUp?`): [`Cell`](Cell.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `seqno` | `number` | `undefined` |
| `timeout` | `number` | `60` |
| `cleanUp` | `boolean` | `true` |

#### Returns

[`Cell`](Cell.md)

___

### deployExtMsg

▸ **deployExtMsg**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

___

### cleanUpTransfers

▸ **cleanUpTransfers**(): `void`

#### Returns

`void`

#### Inherited from

[Wallet](Wallet.md).[cleanUpTransfers](Wallet.md#cleanuptransfers)

## Constructors

### constructor

• **new WalletV3Contract**(`workchain`, `subWalletID`, `keyPair`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `workchain` | `number` |
| `subWalletID` | `number` |
| `keyPair` | [`KeyPairStruct`](../interfaces/KeyPairStruct.md) |

#### Overrides

[Wallet](Wallet.md).[constructor](Wallet.md#constructor)

## Accessors

### subWalletID

• `get` **subWalletID**(): `number`

#### Returns

`number`

#### Inherited from

Wallet.subWalletID

___

### keyPair

• `get` **keyPair**(): [`KeyPairStruct`](../interfaces/KeyPairStruct.md)

#### Returns

[`KeyPairStruct`](../interfaces/KeyPairStruct.md)

#### Inherited from

Wallet.keyPair

___

### code

• `get` **code**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

#### Inherited from

Wallet.code

___

### stateInit

• `get` **stateInit**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

#### Inherited from

Wallet.stateInit

___

### address

• `get` **address**(): [`Address`](Address.md)

#### Returns

[`Address`](Address.md)

#### Inherited from

Wallet.address

___

### transfers

• `get` **transfers**(): [`WalletTransfer`](../interfaces/WalletTransfer.md)[]

#### Returns

[`WalletTransfer`](../interfaces/WalletTransfer.md)[]

#### Inherited from

Wallet.transfers
