[@tonstack/tontools](../README.md) / BOC

# Class: BOC

## Table of contents

### Constructors

- [constructor](BOC.md#constructor)

### Methods

- [from](BOC.md#from)
- [fromStandard](BOC.md#fromstandard)
- [toBytes](BOC.md#tobytes)
- [toBytesStandard](BOC.md#tobytesstandard)
- [toHex](BOC.md#tohex)
- [toHexStandard](BOC.md#tohexstandard)

## Constructors

### constructor

• **new BOC**()

## Methods

### from

▸ `Static` **from**(`data`): [`Cell`](Cell.md)[]

Returns deserialized BOC root cells.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` \| `Uint8Array` | Bytes or HEX of serialized BOC. |

#### Returns

[`Cell`](Cell.md)[]

___

### fromStandard

▸ `Static` **fromStandard**(`data`): [`Cell`](Cell.md)

Returns deserialized standard BOC root cell.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` \| `Uint8Array` | Bytes or HEX of serialized BOC. |

#### Returns

[`Cell`](Cell.md)

___

### toBytes

▸ `Static` **toBytes**(`cells`, `options?`): `Uint8Array`

Returns serialized BOC in bytes representation.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cells` | [`Cell`](Cell.md)[] | Root cells. |
| `options?` | [`BOCOptions`](../interfaces/BOCOptions.md) | - |

#### Returns

`Uint8Array`

___

### toBytesStandard

▸ `Static` **toBytesStandard**(`cell`, `options?`): `Uint8Array`

Returns serialized standard BOC in bytes representation.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cell` | [`Cell`](Cell.md) | Root cell. |
| `options?` | [`BOCOptions`](../interfaces/BOCOptions.md) | - |

#### Returns

`Uint8Array`

___

### toHex

▸ `Static` **toHex**(`cells`, `options?`): `string`

Returns serialized BOC in hex representation.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cells` | [`Cell`](Cell.md)[] | Root cells. |
| `options?` | [`BOCOptions`](../interfaces/BOCOptions.md) | - |

#### Returns

`string`

___

### toHexStandard

▸ `Static` **toHexStandard**(`cell`, `options?`): `string`

Returns serialized standard BOC in hex representation.

**`static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cell` | [`Cell`](Cell.md) | Root cell. |
| `options?` | [`BOCOptions`](../interfaces/BOCOptions.md) | - |

#### Returns

`string`
