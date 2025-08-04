export type ArrayElement<ArrayType> = ArrayType extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;
