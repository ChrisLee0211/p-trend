export declare const resolvePackage: () => Promise<string[]>;
export declare const resolveExternals: (obj: {
    [key: string]: string;
}) => string[];
