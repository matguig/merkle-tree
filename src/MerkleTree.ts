import { createHash, Hash } from "crypto";

class MerkleTree {
    private constructor(
        private dataBlocks: string[],
        private hashes: Hash[][]
    ) {
    }

    /**
     * Create Merkle tree
     * @throws {Error} Empty data blocks
     *
     * @param {string[]} dataBlocks
     * @returns {MerkleTree}
     */
    public static createMerkleTree(dataBlocks: string[]): MerkleTree {
        if (dataBlocks.length === 0) {
            throw new Error('A valid MerkleTree must have at least one data block.');
        }
        const hashes = MerkleTree.createHashes(dataBlocks);
        return new MerkleTree(dataBlocks, hashes);
    }

    /**
     * Create hashes by levels from a data blocks array
     *
     * @param {string[]} dataBlocks
     * @returns {Hash[]}
     */
    private static createHashes(dataBlocks: string[]): Hash[][] {
        const hashes = dataBlocks.map((value) => (this.createHash(Buffer.from(value, 'utf-8'))));
        const height = Math.ceil(Math.log2(dataBlocks.length));
        const levels = [hashes];

        let previousLevel = hashes;
        for (let index = 0; index < height; index++) {
            previousLevel = MerkleTree
                .findPairs(previousLevel)
                .map((pair) => (MerkleTree.createHash(
                    pair[0].copy().digest(),
                    pair[1] && pair[1].copy().digest()
                )));
            levels.push(previousLevel);
        }
        return levels;
    }

    /**
     * Gather the hashes in pairs.
     * If there is an odd number of hashes
     * then the last item will be alone
     *
     * @param {Hash[]} hashes
     * @returns {Hash[][]}
     */
    private static findPairs(hashes: Hash[]): Hash[][] {
        return hashes.reduce((acc: Hash[][], value: Hash, index: number) => {
            if (index%2 === 0) {
                acc.push([value]);
            } else {
                acc[acc.length - 1].push(value);
            }
            return acc;
        }, []);
    }

    /**
     * Create a new hash from one or two buffer(s)
     *
     * @param {Buffer} left
     * @param {Buffer|undefined} right
     * @returns {Hash}
     */
    private static createHash(left: Buffer, right?: Buffer): Hash {
        const hash = createHash('sha256');

        const buffers = [left];
        if (right) {
            buffers.push(right);
        }
        hash.update(Buffer.concat(buffers));
        return hash;
    }

    /**
     * Return merkle tree `root` hash Buffer
     *
     * @return {Buffer}
     */
    public root(): Buffer {
        return this.hashes[this.hashes.length - 1][0].copy().digest();
    }

    /**
     * Return height of the merkle tree
     *
     * @return {number}
     */
    public height(): number {
        return this.hashes.length;
    }

    /**
     * Returns an Array containing the hashes of the specified level
     *
     * @throws {Error} Level does not exist
     *
     * @param {number} index
     * @returns {Buffer[]}
     */
    public level(index: number): Buffer[] {
        if (!this.hashes[index]) {
            throw new Error(`MerkleTree Level #${index} does not exist`);
        }
        return this.hashes[index].map((hash) => (hash.copy().digest()));
    }
}

export default MerkleTree;