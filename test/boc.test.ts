import { expect } from 'chai'
import { BOC } from '../src/boc'
import { hexToBytes } from '../src/utils/helpers'

describe('BOC', () => {
    const BOC_FIFT_LARGE_HASH = '2f013a05f1522b9288e0412c524186f089ea30e87afc9a51395eed0019f2cf8f'
    const BOC_FIFT_WITH_DUPS_HASH = '5049e60708f6f8aefb51009361aa6ad6fc6a14becd8d8bef37d10cf2e8ea281d'
    const BOC_FIFTHEX_HASH = '92f18ee3a6c7082d33a25b704a7e9fa06200d9541517c450733d1b8eb4d3dce4'
    const BOC_FIFT_HEX_LARGE = 'b5ee9c7201023201000498000114ff00f4a413f4bcf2c80b0102012002030201480405000cf2308048f2f00202cb0607020120282902012008090201ce26270201200a0b02012017180201200c0d02012011120201200e0f00215fa4001fa46804602c00012f2f4d3ff30801ed20120871c03cbc807434c0c05c6c2497c0f83c00cc4074c7dc208061a808f00023858cc074c7e01200a0841b5a5b9d2e84bcbd2082c63cd865d6f4cffe801400f880fe0048840d10015bc13e186084100d28f014842ea4cc3c033820842296cbb9d4842ea4cc3c03782082c63cd854842ea4cc3c03f82010001134c1c06a80b5c6006000588210982535785210ba9330f00ee08210b766741a5210ba9330f011e0821025d53dfdba92f010e0308048f2f002012013140201201516001d1c081cb232c072c032c1f2fff274200023104cfd039be8482540b5c04c00780c5c0ca0003d1c20043232c1417c010573c5893e808532da84b2c7f2cff3c4f260103ec020003d1c20043232c141bc0105b3c594013e808532dab2c7c4b2cff3c4f25c7ec020020120191a0201201f200201201b1c0201201d1e001d0060c1fd039be864fe800c380c1c20003b20128870403cbc8830802672007e8080a0c1fd10e5cc0060c1fd16cc38a000193b51343e803d013d0135350c20001f3214017e8084fd003d003333327b55200201202122020120232400ed3e105bc90c0c40b4fff4c7fe803d01347c0288e0080a60c1fc016011c07cbd2011d4c6eebcbd14cc3c0214d2bc020af232ffd5082e20083d10c06951543c0241291509243c025004fc02e084260abfffc97232ffd49032c7d4883d00095110d4a17c01e0840c19b443c0f232ffc4b2c7fd00104c3c01a000e33e105bc90c0c40b4fff4c7fe803d01347c02887434ffcc20125446eebcbd08e0080a60c1fc014c6011c07cbc94ca3c020a7232ffd50825a0083d10c1291508e43c0240bc02e0840d2212a4497232ffd49032c7d4883d00095110d4a17c01e0841c04df21c0f232ffc4b2c7fd00104c3c01a000793e105bc90c0c40b53d01347b5134350c3434ffcc201254c52ebcbd08b434ffcc201200aebcbd3c028c54943c02e0843218aeaf40b2333d00104c3c01a001f73e105bc90c80fd01347c02b434c03e8034c7f4c7fd010c2012c97cbd2012d4e4ae7cbd2012d4e4ee7cbd20134920840ee6b2802814032ec6fcbd3e097e0554c1e8483e0454c2e0083d039be864f4c7cc248c083880a94b20083d039be865900720083d05a74c083232c7f274100720083d05b882a9013232c01400e0250038fa02cb1fcb1f17f400c9f00b82101a69387e02c8cb1ff4004130f00600513e105bc90c0c40bd01347b5134350c3434ffcc20125444eebcbd20840764eab600723d00104c3c01a0005b3e105bc90c0c40b53d01347b5134350c3434ffcc201254452ebcbd087ec120841ca368e840b2333d00104c3c01a00201202a2b02012030310017bb9a5ed44d0d430d0d3ff3080201202c2d0201202e2f003bb6e53da89a1f401a803a1a7ffe00203e00203a861a1e0026209a8608a8100011b323bc02840d17c120002bb2fe7c02840917c120c1fd039be864fe800c380c1c200011bbbd182108325e4c38001db9c34f00a5f03802032028307f0058'
    const BOC_FIFT_HEX_WITH_DUPS = 'b5ee9c720101180100e800020310c201020163a90da09563b6740a4b7f68ca09fbdb76b0035cc101450a16e2e79b985ebbb38a0c5768616c657320546f6b656e0357484c40030119a1dcd65000000003200000032604003e1e68747470733a2f2f746f6e7768616c65732e636f6d2f636f6e74656e742f0203ccc0050602012007080201481415020120090a0201200f10000ba38000002cc00201200b0c0009b6000000c30201480d0e00094000000638000950000005f8000ba6000000304002012011170201581213000940000005c8000950000005e8000ba18000002ec002012016170009b4000000b70009d8000002d4'
    const BOC_FIFT_BASE64_LARGE = 'te6ccgECMgEABJgAART/APSkE/S88sgLAQIBIAIDAgFIBAUADPIwgEjy8AICywYHAgEgKCkCASAICQIBziYnAgEgCgsCASAXGAIBIAwNAgEgERICASAODwAhX6QAH6RoBGAsAAEvL00/8wgB7SASCHHAPLyAdDTAwFxsJJfA+DwAzEB0x9wggGGoCPAAI4WMwHTH4BIAoIQbWludLoS8vSCCxjzYZdb0z/6AFAD4gP4ASIQNEAFbwT4YYIQQDSjwFIQupMw8AzgghCKWy7nUhC6kzDwDeCCCxjzYVIQupMw8A/ggEAARNMHAaoC1xgBgAFiCEJglNXhSELqTMPAO4IIQt2Z0GlIQupMw8BHgghAl1T39upLwEOAwgEjy8AIBIBMUAgEgFRYAHRwIHLIywHLAMsHy//J0IAAjEEz9A5voSCVAtcBMAHgMXAygAD0cIAQyMsFBfAEFc8WJPoCFMtqEssfyz/PE8mAQPsAgAD0cIAQyMsFBvAEFs8WUAT6AhTLassfEss/zxPJcfsAgAgEgGRoCASAfIAIBIBscAgEgHR4AHQBgwf0Dm+hk/oAMOAwcIAA7IBKIcEA8vIgwgCZyAH6AgKDB/RDlzABgwf0WzDigABk7UTQ+gD0BPQE1NQwgAB8yFAF+gIT9AD0AMzMye1UgAgEgISICASAjJADtPhBbyQwMQLT/9Mf+gD0BNHwCiOAICmDB/AFgEcB8vSAR1MbuvL0UzDwCFNK8AgryMv/VCC4gCD0QwGlRVDwCQSkVCSQ8AlAE/ALghCYKv//JcjL/1JAyx9SIPQAJURDUoXwB4IQMGbRDwPIy/8Syx/0AEEw8AaAA4z4QW8kMDEC0//TH/oA9ATR8Aoh0NP/MIBJURu68vQjgCApgwfwBTGARwHy8lMo8AgpyMv/VCCWgCD0QwSkVCOQ8AkC8AuCEDSISpElyMv/UkDLH1Ig9AAlRENShfAHghBwE3yHA8jL/xLLH/QAQTDwBoAB5PhBbyQwMQLU9ATR7UTQ1DDQ0/8wgElTFLry9CLQ0/8wgEgCuvL08AoxUlDwC4IQyGK6vQLIzPQAQTDwBoAH3PhBbyQyA/QE0fAK0NMA+gDTH9Mf9AQwgEsl8vSAS1OSufL0gEtTk7ny9IBNJIIQO5rKAKBQDLsb8vT4JfgVUwehIPgRUwuAIPQOb6GT0x8wkjAg4gKlLIAg9A5voZZAHIAg9BadMCDIyx/J0EAcgCD0FuIKpATIywBQA4CUAOPoCyx/LHxf0AMnwC4IQGmk4fgLIyx/0AEEw8AYAUT4QW8kMDEC9ATR7UTQ1DDQ0/8wgElRE7ry9IIQHZOq2AHI9ABBMPAGgAFs+EFvJDAxAtT0BNHtRNDUMNDT/zCASVEUuvL0IfsEghByjaOhAsjM9ABBMPAGgAgEgKisCASAwMQAXu5pe1E0NQw0NP/MIAgEgLC0CASAuLwA7tuU9qJofQBqAOhp//gAgPgAgOoYaHgAmIJqGCKgQABGzI7wChA0XwSAAK7L+fAKECRfBIMH9A5voZP6ADDgMHCAAEbu9GCEIMl5MOAAducNPAKXwOAIDICgwfwBY'
    const BOC_FIFT_BASE64_WITH_DUPS = 'te6ccgEBGAEA6AACAxDCAQIBY6kNoJVjtnQKS39oygn723awA1zBAUUKFuLnm5heu7OKDFdoYWxlcyBUb2tlbgNXSExAAwEZodzWUAAAAAMgAAADJgQAPh5odHRwczovL3RvbndoYWxlcy5jb20vY29udGVudC8CA8zABQYCASAHCAIBSBQVAgEgCQoCASAPEAALo4AAACzAAgEgCwwACbYAAADDAgFIDQ4ACUAAAAY4AAlQAAAF+AALpgAAADBAAgEgERcCAVgSEwAJQAAABcgACVAAAAXoAAuhgAAALsACASAWFwAJtAAAALcACdgAAALU'
    const BOC_FIFT_BYTES_LARGE = hexToBytes(BOC_FIFT_HEX_LARGE)
    const BOC_FIFT_BYTES_WITH_DUPS = hexToBytes(BOC_FIFT_HEX_WITH_DUPS)
    const BOC_FIFTHEX = 'x{C8}\n x{62_}\n  x{6E_}\n   x{500A9}\n   x{400AA}\n  x{A08090C_}\n x{BEFDF21}'

    describe('#from()', () => {
        it('should deserialize-serialize-deserialize boc from hex', () => {
            const cells1 = BOC.from(BOC_FIFT_HEX_LARGE)
            const cells2 = BOC.from(BOC_FIFT_HEX_WITH_DUPS)
            const hex1 = BOC.toHex(cells1)
            const hex2 = BOC.toHex(cells2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cells3 = BOC.from(hex1)
            const cells4 = BOC.from(hex2)

            expect(cells1.length).to.eq(1)
            expect(cells1[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells2.length).to.eq(1)
            expect(cells2[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cells3.length).to.eq(1)
            expect(cells3[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells4.length).to.eq(1)
            expect(cells4[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })

        it('should deserialize-serialize-deserialize standard boc from hex', () => {
            const cell1 = BOC.fromStandard(BOC_FIFT_HEX_LARGE)
            const cell2 = BOC.fromStandard(BOC_FIFT_HEX_WITH_DUPS)
            const hex1 = BOC.toHexStandard(cell1)
            const hex2 = BOC.toHexStandard(cell2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cell3 = BOC.fromStandard(hex1)
            const cell4 = BOC.fromStandard(hex2)

            expect(cell1.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell2.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cell3.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell4.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })

        // it('should deserialize-serialize-deserialize boc from fift hex', () => {
        //     const cells1 = BOC.from(BOC_FIFTHEX)
        //     const fift = BOC.toFiftHex(cells1)
        //     const cells2 = BOC.from(fift)

        //     expect(cells1.length).to.eq(1)
        //     expect(cells1[0].hash()).to.eq(BOC_FIFTHEX_HASH)
        //     expect(cells2.length).to.eq(1)
        //     expect(cells2[0].hash()).to.eq(BOC_FIFTHEX_HASH)
        // })

        it('should deserialize-serialize-deserialize standard boc fift from hex', () => {
            const cell1 = BOC.fromStandard(BOC_FIFTHEX)
            const fift = BOC.toFiftHexStandard(cell1)
            const cell2 = BOC.fromStandard(fift)

            expect(cell1.hash()).to.eq(BOC_FIFTHEX_HASH)
            expect(cell2.hash()).to.eq(BOC_FIFTHEX_HASH)
        })

        it('should deserialize-serialize-deserialize boc from base64', () => {
            const cells1 = BOC.from(BOC_FIFT_BASE64_LARGE)
            const cells2 = BOC.from(BOC_FIFT_BASE64_WITH_DUPS)
            const base641 = BOC.toBase64(cells1)
            const base642 = BOC.toBase64(cells2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cells3 = BOC.from(base641)
            const cells4 = BOC.from(base642)

            expect(cells1.length).to.eq(1)
            expect(cells1[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells2.length).to.eq(1)
            expect(cells2[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cells3.length).to.eq(1)
            expect(cells3[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells4.length).to.eq(1)
            expect(cells4[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })

        it('should deserialize-serialize-deserialize standard boc from base64', () => {
            const cell1 = BOC.fromStandard(BOC_FIFT_BASE64_LARGE)
            const cell2 = BOC.fromStandard(BOC_FIFT_BASE64_WITH_DUPS)
            const base641 = BOC.toBase64Standard(cell1)
            const base642 = BOC.toBase64Standard(cell2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cell3 = BOC.fromStandard(base641)
            const cell4 = BOC.fromStandard(base642)

            expect(cell1.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell2.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cell3.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell4.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })

        it('should deserialize-serialize-deserialize boc from bytes', () => {
            const cells1 = BOC.from(BOC_FIFT_BYTES_LARGE)
            const cells2 = BOC.from(BOC_FIFT_BYTES_WITH_DUPS)
            const hex1 = BOC.toBytes(cells1)
            const hex2 = BOC.toBytes(cells2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cells3 = BOC.from(hex1)
            const cells4 = BOC.from(hex2)

            expect(cells1.length).to.eq(1)
            expect(cells1[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells2.length).to.eq(1)
            expect(cells2[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cells3.length).to.eq(1)
            expect(cells3[0].hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cells4.length).to.eq(1)
            expect(cells4[0].hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })

        it('should deserialize-serialize-deserialize standard boc from bytes', () => {
            const cell1 = BOC.fromStandard(BOC_FIFT_BYTES_LARGE)
            const cell2 = BOC.fromStandard(BOC_FIFT_BYTES_WITH_DUPS)
            const hex1 = BOC.toBytesStandard(cell1)
            const hex2 = BOC.toBytesStandard(cell2, {
                has_cache_bits: false,
                has_index: true,
                hash_crc32: true,
                topological_order: 'depth-first',
                flags: 2
            })
            const cell3 = BOC.fromStandard(hex1)
            const cell4 = BOC.fromStandard(hex2)

            expect(cell1.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell2.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
            expect(cell3.hash()).to.eq(BOC_FIFT_LARGE_HASH)
            expect(cell4.hash()).to.eq(BOC_FIFT_WITH_DUPS_HASH)
        })
    })
})
