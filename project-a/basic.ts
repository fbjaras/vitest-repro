import { print, Kind} from 'graphql';
export const squared = (n: number) => {
    print({ kind: Kind.NAME, value: "test" });
    return n * n;

};

//test