[@tonstack/tontools](../README.md) / Mnemonic

# Class: Mnemonic

## Table of contents

### Constructors

- [constructor](Mnemonic.md#constructor)

### Accessors

- [thisPassphrase](Mnemonic.md#thispassphrase)
- [thisMnemonic](Mnemonic.md#thismnemonic)
- [thisEntropy](Mnemonic.md#thisentropy)
- [thisKeyPair](Mnemonic.md#thiskeypair)

### Methods

- [isInit](Mnemonic.md#isinit)
- [clear](Mnemonic.md#clear)
- [setPassphrase](Mnemonic.md#setpassphrase)
- [setMnemonic](Mnemonic.md#setmnemonic)
- [generate](Mnemonic.md#generate)

## Constructors

### constructor

• **new Mnemonic**()

## Accessors

### thisPassphrase

• `get` **thisPassphrase**(): `string`

#### Returns

`string`

___

### thisMnemonic

• `get` **thisMnemonic**(): `string`[]

#### Returns

`string`[]

___

### thisEntropy

• `get` **thisEntropy**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### thisKeyPair

• `get` **thisKeyPair**(): [`KeyPairStruct`](../interfaces/KeyPairStruct.md)

#### Returns

[`KeyPairStruct`](../interfaces/KeyPairStruct.md)

## Methods

### isInit

▸ **isInit**(): `boolean`

#### Returns

`boolean`

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

___

### setPassphrase

▸ **setPassphrase**(`passphrase`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `passphrase` | `string` |

#### Returns

`void`

___

### setMnemonic

▸ **setMnemonic**(`mnemonic`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |

#### Returns

`void`

___

### generate

▸ **generate**(): `void`

#### Returns

`void`
