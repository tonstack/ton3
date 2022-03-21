[@tonstack/tontools](../README.md) / KeyPair

# Class: KeyPair

## Table of contents

### Constructors

- [constructor](KeyPair.md#constructor)

### Properties

- [passphrase](KeyPair.md#passphrase)
- [mnemonic](KeyPair.md#mnemonic)
- [privateKey](KeyPair.md#privatekey)
- [publicKey](KeyPair.md#publickey)

### Methods

- [deriveChecksumBits](KeyPair.md#derivechecksumbits)
- [getRandomEntropy](KeyPair.md#getrandomentropy)
- [normalizeString](KeyPair.md#normalizestring)
- [mnemonicFromEntropy](KeyPair.md#mnemonicfromentropy)
- [mnemonicToSeed](KeyPair.md#mnemonictoseed)
- [ed25519PubKeyFromSeed](KeyPair.md#ed25519pubkeyfromseed)

## Constructors

### constructor

• **new KeyPair**(`passphrase?`, `mnemonic?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `passphrase` | `string` | `''` |
| `mnemonic` | `string`[] | `[]` |

## Properties

### passphrase

• **passphrase**: `string`

___

### mnemonic

• **mnemonic**: `string`[]

___

### privateKey

• **privateKey**: `Uint8Array`

___

### publicKey

• **publicKey**: `Uint8Array`

## Methods

### deriveChecksumBits

▸ `Static` **deriveChecksumBits**(`entropy`): [`Bit`](../README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `entropy` | `Uint8Array` |

#### Returns

[`Bit`](../README.md#bit)[]

___

### getRandomEntropy

▸ `Static` **getRandomEntropy**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### normalizeString

▸ `Static` **normalizeString**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

___

### mnemonicFromEntropy

▸ `Static` **mnemonicFromEntropy**(`entropy`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `entropy` | `Uint8Array` |

#### Returns

`string`[]

___

### mnemonicToSeed

▸ `Static` **mnemonicToSeed**(`mnemonic`, `passphrase`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |
| `passphrase` | `string` |

#### Returns

`Uint8Array`

___

### ed25519PubKeyFromSeed

▸ `Static` **ed25519PubKeyFromSeed**(`seed`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

#### Returns

`Uint8Array`
