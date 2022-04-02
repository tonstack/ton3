[@tonstack/tontools](../README.md) / Slice

# Class: Slice

## Table of contents

### Accessors

- [bits](Slice.md#bits)
- [refs](Slice.md#refs)

### Constructors

- [constructor](Slice.md#constructor)

### Methods

- [skip](Slice.md#skip)
- [loadRef](Slice.md#loadref)
- [preloadRef](Slice.md#preloadref)
- [loadBit](Slice.md#loadbit)
- [preloadBit](Slice.md#preloadbit)
- [loadBits](Slice.md#loadbits)
- [preloadBits](Slice.md#preloadbits)
- [loadInt](Slice.md#loadint)
- [preloadInt](Slice.md#preloadint)
- [loadUint](Slice.md#loaduint)
- [preloadUint](Slice.md#preloaduint)
- [loadBytes](Slice.md#loadbytes)
- [preloadBytes](Slice.md#preloadbytes)
- [loadString](Slice.md#loadstring)
- [preloadString](Slice.md#preloadstring)
- [loadAddress](Slice.md#loadaddress)
- [preloadAddress](Slice.md#preloadaddress)
- [loadCoins](Slice.md#loadcoins)
- [preloadCoins](Slice.md#preloadcoins)
- [parse](Slice.md#parse)

## Accessors

### bits

• `get` **bits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### refs

• `get` **refs**(): [`Cell`](Cell.md)[]

#### Returns

[`Cell`](Cell.md)[]

## Constructors

### constructor

• **new Slice**(`bits`, `refs`)

Creates an instance of [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()
const slice = new Slice(cell)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](../README.md#bit)[] |
| `refs` | [`Cell`](Cell.md)[] |

## Methods

### skip

▸ **skip**(`size`): [`Slice`](Slice.md)

Skip bits from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeBits([ 0, 1, 1, 0 ])

const slice = cell.toSlice()

console.log(slice.skip(2).readBits(2)) // [ 1, 0 ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be skipped |

#### Returns

[`Slice`](Slice.md)

___

### loadRef

▸ **loadRef**(): [`Cell`](Cell.md)

Read ref from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()
const ref = new Cell()

cell.refs.push(ref)

const slice = cell.toSlice()

console.log(slice.readRef()) // Cell
```

#### Returns

[`Cell`](Cell.md)

___

### preloadRef

▸ **preloadRef**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

___

### loadBit

▸ **loadBit**(): [`Bit`](../README.md#bit)

Read bit from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeBit(1)

const slice = cell.toSlice()

console.log(slice.readBit()) // 1
```

#### Returns

[`Bit`](../README.md#bit)

___

### preloadBit

▸ **preloadBit**(): [`Bit`](../README.md#bit)

#### Returns

[`Bit`](../README.md#bit)

___

### loadBits

▸ **loadBits**(`size`): [`Bit`](../README.md#bit)[]

Read bits from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeBits([ 0, 1 ])

const slice = cell.toSlice()

console.log(slice.readBits(2)) // [ 0, 1 ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

[`Bit`](../README.md#bit)[]

___

### preloadBits

▸ **preloadBits**(`size`): [`Bit`](../README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

[`Bit`](../README.md#bit)[]

___

### loadInt

▸ **loadInt**(`size`): `number`

Read int from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeUint(-14, 15)

const slice = cell.toSlice()

console.log(slice.readUint(15)) // -14
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

`number`

___

### preloadInt

▸ **preloadInt**(`size`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`number`

___

### loadUint

▸ **loadUint**(`size`): `number`

Read uint from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeUint(14, 9)

const slice = cell.toSlice()

console.log(slice.readUint(9)) // 14
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

`number`

___

### preloadUint

▸ **preloadUint**(`size`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`number`

___

### loadBytes

▸ **loadBytes**(`size`): `Uint8Array`

Read bytes from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeBytes(new Uint8Array([ 255, 255 ]))

const slice = cell.toSlice()

console.log(slice.readBytes(16)) // [ 255, 255 ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`Uint8Array`

___

### preloadBytes

▸ **preloadBytes**(`size`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`Uint8Array`

___

### loadString

▸ **loadString**(`size?`): `string`

Read string from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeString('Привет, мир!')

const slice = cell.toSlice()

console.log(slice.readString()) // 'Привет, мир!'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `null` |

#### Returns

`string`

___

### preloadString

▸ **preloadString**(`size?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `null` |

#### Returns

`string`

___

### loadAddress

▸ **loadAddress**(): [`Address`](Address.md)

Read [Address](Address.md) from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Address, Slice } from '@tonstack/tontools'

const cell = new Cell()
const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

cell.bits.writeAddress(address)

const slice = cell.toSlice()

console.log(slice.readAddress().toString())
// 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
```

#### Returns

[`Address`](Address.md)

___

### preloadAddress

▸ **preloadAddress**(): [`Address`](Address.md)

#### Returns

[`Address`](Address.md)

___

### loadCoins

▸ **loadCoins**(): [`Coins`](Coins.md)

Read [Coins](Coins.md) from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Coins, Slice } from '@tonstack/tontools'

const cell = new Cell()
const coins = new Coins('100')

cell.bits.writeCoins(coins)

const slice = cell.toSlice()

console.log(slice.readCoins().toString()) // '100'
```

#### Returns

[`Coins`](Coins.md)

___

### preloadCoins

▸ **preloadCoins**(): [`Coins`](Coins.md)

#### Returns

[`Coins`](Coins.md)

___

### parse

▸ `Static` **parse**(`cell`): [`Slice`](Slice.md)

Creates new [Slice](Slice.md) from [Cell](Cell.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()
const slice = Slice.parse(cell)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

#### Returns

[`Slice`](Slice.md)
