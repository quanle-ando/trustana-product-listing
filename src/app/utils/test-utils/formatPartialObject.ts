export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends
    | null
    | undefined
    | string
    | number
    | boolean
    | bigint
    ? T[P]
    : Exclude<T[P], undefined | null> extends Map<infer K, infer V>
    ? Map<DeepPartial<K>, DeepPartial<V>>
    : DeepPartial<T[P]>;
};

/**
 * Casts a partial object to its full shape. Useful when mocking just part of an object
 * in Typescript
 */
export function formatPartialObject<T, V extends T>(obj: DeepPartial<V>) {
  return obj as T;
}
