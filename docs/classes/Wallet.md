[@tonstack/tontools](../README.md) / Wallet

# Class: Wallet

## Hierarchy

- **`Wallet`**

  ↳ [`HighloadWalletV2Contract`](HighloadWalletV2Contract.md)

  ↳ [`WalletV3Contract`](WalletV3Contract.md)

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Accessors

- [subWalletID](Wallet.md#subwalletid)
- [keyPair](Wallet.md#keypair)
- [code](Wallet.md#code)
- [stateInit](Wallet.md#stateinit)
- [address](Wallet.md#address)
- [transfers](Wallet.md#transfers)

### Methods

- [cleanUpTransfers](Wallet.md#cleanuptransfers)

## Constructors

### constructor

• **new Wallet**()

## Accessors

### subWalletID

• `get` **subWalletID**(): `number`

#### Returns

`number`

___

### keyPair

• `get` **keyPair**(): [`KeyPairStruct`](../interfaces/KeyPairStruct.md)

#### Returns

[`KeyPairStruct`](../interfaces/KeyPairStruct.md)

___

### code

• `get` **code**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

___

### stateInit

• `get` **stateInit**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

___

### address

• `get` **address**(): [`Address`](Address.md)

#### Returns

[`Address`](Address.md)

___

### transfers

• `get` **transfers**(): [`WalletTransfer`](../interfaces/WalletTransfer.md)[]

#### Returns

[`WalletTransfer`](../interfaces/WalletTransfer.md)[]

## Methods

### cleanUpTransfers

▸ **cleanUpTransfers**(): `void`

#### Returns

`void`
