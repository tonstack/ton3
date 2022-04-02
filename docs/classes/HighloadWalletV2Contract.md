[@tonstack/tontools](../README.md) / HighloadWalletV2Contract

# Class: HighloadWalletV2Contract

## Hierarchy

- [`Wallet`](Wallet.md)

  ↳ **`HighloadWalletV2Contract`**

## Table of contents

### Methods

- [addTransfers](HighloadWalletV2Contract.md#addtransfers)
- [sendTransfersExtMsg](HighloadWalletV2Contract.md#sendtransfersextmsg)
- [deployExtMsg](HighloadWalletV2Contract.md#deployextmsg)
- [cleanUpTransfers](HighloadWalletV2Contract.md#cleanuptransfers)

### Constructors

- [constructor](HighloadWalletV2Contract.md#constructor)

### Accessors

- [subWalletID](HighloadWalletV2Contract.md#subwalletid)
- [keyPair](HighloadWalletV2Contract.md#keypair)
- [code](HighloadWalletV2Contract.md#code)
- [stateInit](HighloadWalletV2Contract.md#stateinit)
- [address](HighloadWalletV2Contract.md#address)
- [transfers](HighloadWalletV2Contract.md#transfers)

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

### sendTransfersExtMsg

▸ **sendTransfersExtMsg**(`timeout?`, `cleanUp?`): [`Cell`](Cell.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
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

• **new HighloadWalletV2Contract**(`workchain`, `subWalletID`, `keyPair`)

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
