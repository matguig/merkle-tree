# Basic Merkle Tree

Basic implementation of a Merkle tree

## Installation

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install all dependencies.

```bash
$ yarn
> yarn install v1.22.4
> [1/5] 🔍  Validating package.json...
> [2/5] 🔍  Resolving packages...
> [3/5] 🚚  Fetching packages...
> [4/5] 🔗  Linking dependencies...
> [5/5] 🔨  Building fresh packages...
> ✨  Done in 1.60s.
```

## Usage

```ts
import MerkleTree from "./MerkleTree";

const tree = MerkleTree.createMerkleTree([
    'L1',
    'L2',
    'L3',
    'L4',
]);

for (let index = 0; index < tree.height(); index++) {
    console.log(`Layer ${index} -`);
    console.log(tree.level(index).map((buffer: Buffer) => buffer.toString('hex')));
}

```

## Linter and Tests
### Linter
```bash
$ yarn lint
> yarn run v1.22.4
> $ tslint -c tslint.json 'src/**/*.ts'
> ✨  Done in 0.69s.
```
### Test
```bash
$ yarn test
> yarn run v1.22.4
> $ jest --coverage
>  PASS  src/MerkleTree.test.ts
>   ✓ Merkle Tree implements the statics `createMerkleTree` (2 ms)
>   ✓ CreateMerkleTree should generate an error if an empty data block array is passed (5 ms)
>   ✓ Test merkle tree length computation (2 ms)
>   ✓ Test merkle tree level index (1 ms)
>   ✓ Test merkle tree non existing level index (1 ms)
>   ✓ Test merkle tree root
>   ✓ Test merkle tree coherence (2 ms)
> 
> ---------------|---------|----------|---------|---------|-------------------
> File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
> ---------------|---------|----------|---------|---------|-------------------
> All files      |     100 |      100 |     100 |     100 |                   
>  MerkleTree.ts |     100 |      100 |     100 |     100 |                   
> ---------------|---------|----------|---------|---------|-------------------
> Test Suites: 1 passed, 1 total
> Tests:       7 passed, 7 total
> Snapshots:   0 total
> Time:        1.344 s
> Ran all test suites.
> ✨  Done in 2.00s.
```
