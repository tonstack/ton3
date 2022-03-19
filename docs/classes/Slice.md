[tontools](../README.md) / Slice

# Class: Slice

## Table of contents

### Constructors

- [constructor](Slice.md#constructor)

### Methods

- [skip](Slice.md#skip)
- [readRef](Slice.md#readref)
- [readBit](Slice.md#readbit)
- [readBits](Slice.md#readbits)
- [readInt](Slice.md#readint)
- [readUint](Slice.md#readuint)
- [readBytes](Slice.md#readbytes)
- [readString](Slice.md#readstring)
- [readAddress](Slice.md#readaddress)
- [readCoins](Slice.md#readcoins)
- [from](Slice.md#from)

## Constructors

### constructor

• **new Slice**(`cell`)

Creates an instance of [Slice](Slice.md) from provided [Cell](Cell.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()
const slice = new Slice(cell)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

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

### readRef

▸ **readRef**(`splice?`): [`Cell`](Cell.md)

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

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `splice` | `boolean` | `true` |

#### Returns

[`Cell`](Cell.md)

___

### readBit

▸ **readBit**(`splice?`): [`Bit`](../README.md#bit)

Read bit from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()

cell.bits.writeBit(1)

const slice = cell.toSlice()

console.log(slice.readBit()) // 1
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `splice` | `boolean` | `true` |

#### Returns

[`Bit`](../README.md#bit)

___

### readBits

▸ **readBits**(`size`, `splice?`): [`Bit`](../README.md#bit)[]

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

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `undefined` | Total bits should be readed to represent requested value |
| `splice` | `boolean` | `true` | - |

#### Returns

[`Bit`](../README.md#bit)[]

___

### readInt

▸ **readInt**(`size`, `splice?`): `number`

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

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `undefined` | Total bits should be readed to represent requested value |
| `splice` | `boolean` | `true` | - |

#### Returns

`number`

___

### readUint

▸ **readUint**(`size`, `splice?`): `number`

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

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `undefined` | Total bits should be readed to represent requested value |
| `splice` | `boolean` | `true` | - |

#### Returns

`number`

___

### readBytes

▸ **readBytes**(`size`, `splice?`): `Uint8Array`

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

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `undefined` |
| `splice` | `boolean` | `true` |

#### Returns

`Uint8Array`

___

### readString

▸ **readString**(`size?`, `splice?`): `string`

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
| `splice` | `boolean` | `true` |

#### Returns

`string`

___

### readAddress

▸ **readAddress**(`splice?`): [`Address`](Address.md)

Read [Address](Address.md) from [Slice](Slice.md)

**`example`**
```ts
import { Cell, Address, Slice } from '@tonstack/tontools'

const cell = new Cell()
const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

cell.bits.writeAddress(address)

const slice = cell.toSlice()

console.log(slice.readAddress().toString()) // 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `splice` | `boolean` | `true` |

#### Returns

[`Address`](Address.md)

___

### readCoins

▸ **readCoins**(`splice?`): [`Coins`](Coins.md)

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

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `splice` | `boolean` | `true` |

#### Returns

[`Coins`](Coins.md)

___

### from

▸ `Static` **from**(`cell`): [`Slice`](Slice.md)

Create new [Slice](Slice.md) from given [Cell](Cell.md)

**`static`**

**`example`**
```ts
import { Cell, Slice } from '@tonstack/tontools'

const cell = new Cell()
const slice = Slice.from(cell)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cell` | [`Cell`](Cell.md) | Cell to get slice from |

#### Returns

[`Slice`](Slice.md)
