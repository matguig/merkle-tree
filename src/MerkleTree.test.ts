import { createHash } from 'crypto';
import MerkleTree from './MerkleTree';

test('Merkle Tree implements the statics `createMerkleTree`', () => {
    expect(typeof MerkleTree.createMerkleTree)
        .toBe('function');
});

test('CreateMerkleTree should generate an error if an empty data block array is passed', () => {
    expect(() => MerkleTree.createMerkleTree([]))
        .toThrowError('A valid MerkleTree must have at least one data block.');
});

test('Test merkle tree length computation', () => {
    // Extra small
    // 1. (x)
    const extraSmallDataBlocks = ['e-markets'];
    const extraSmall = MerkleTree.createMerkleTree(extraSmallDataBlocks);
    expect(extraSmall.height())
        .toBe(1);

    // Small
    // 1.      (x)
    //        /   \
    // 2.   (x)   (x)
    //     /   \   |
    // 3. (x) (x) (x)
    const smallDataBlocks = ['e-markets', 'Garden', 'Dobra Open-source Lane'];
    const small = MerkleTree.createMerkleTree(smallDataBlocks);
    expect(small.height())
        .toBe(3);

    // Medium
    // 1.                          (x)
    //                    /                 \
    // 2.               (x)                 (x)
    //            /             \            |
    // 3.       (x)             (x)         (x)
    //        /     \         /      \       |
    // 4.   (x)     (x)     (x)     (x)     (x)
    //      / \     / \     / \     / \     / \
    // 5. (x) (x) (x) (x) (x) (x) (x) (x) (x) (x)
    const MediumDataBlocks = [
        'e-markets', 'Shoes Senior',
        'Sharon Gleichner', 'Mandy.Block42',
        'MyISAM', 'x',
        'Central Operations Facilitator', 'Manager',
        'system', 'quantifying'
    ];
    const mediumSmall = MerkleTree.createMerkleTree(MediumDataBlocks);
    expect(mediumSmall.height())
        .toBe(5);
});

test('Test merkle tree level index', () => {
    const smallDataBlocks = ['e-markets', 'Garden', 'Dobra Open-source Lane'];
    const small = MerkleTree.createMerkleTree(smallDataBlocks);
    expect(small.level(0).length)
        .toBe(3);

    expect(small.level(1).map((buffer: Buffer) => buffer.toString('hex')))
        .toStrictEqual(["0a19c403a7e3a0b014367eedf9c2aaec217d290f1bce2367a3c0b91b29df2b21", "4d69cacdd7c9f23e2947379ab466222b23a7a0fa11e2b4bd54e39d63a452e70b"])
});

test('Test merkle tree non existing level index', () => {
    const smallDataBlocks = ['e-markets', 'Garden', 'Dobra Open-source Lane'];
    const small = MerkleTree.createMerkleTree(smallDataBlocks);
    expect(() => small.level(42))
        .toThrowError('MerkleTree Level #42 does not exist');
});

test('Test merkle tree root', () => {
    const smallDataBlocks = ['e-markets', 'Garden', 'Dobra Open-source Lane'];
    const small = MerkleTree.createMerkleTree(smallDataBlocks);
    const root = small.root();

    expect(root)
        .toBeInstanceOf(Buffer)
    expect(root.toString('hex'))
        .toBe('67cefb11f7e49f4e44e5f6540df70185f3b5ebbc3696eafc2723c1da8fa17efc')
});

test('Test merkle tree coherence', () => {
    const smallDataBlocks = ['e-markets', 'Garden', 'Dobra Open-source Lane'];
    const small = MerkleTree.createMerkleTree(smallDataBlocks);
    const firstHashLevel = small.level(0);

    expect(firstHashLevel)
        .toStrictEqual(smallDataBlocks.map((val) => createHash('sha256').update(val).digest()));

    const secondHashLevel = small.level(1);
    expect(secondHashLevel)
        .toStrictEqual([
            createHash('sha256').update(
                Buffer.concat([
                    createHash('sha256').update('e-markets').digest(),
                    createHash('sha256').update('Garden').digest()
                ])
            ).digest(),
            createHash('sha256').update(
                createHash('sha256').update('Dobra Open-source Lane').digest(),
            ).digest()
        ]);

    const thirdHashLevel = small.level(2);
    expect(thirdHashLevel)
        .toStrictEqual([
            createHash('sha256').update(
                Buffer.concat([
                    createHash('sha256').update(
                        Buffer.concat([
                            createHash('sha256').update('e-markets').digest(),
                            createHash('sha256').update('Garden').digest()
                        ])
                    ).digest(),
                    createHash('sha256').update(
                        createHash('sha256').update('Dobra Open-source Lane').digest(),
                    ).digest()
                ])
            ).digest()
        ]);
});