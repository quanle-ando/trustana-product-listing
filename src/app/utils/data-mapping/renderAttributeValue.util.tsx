export function renderAttributeValue({
  value,
  key,
}: {
  key: string;
  value: unknown;
}) {
  const castVal = value as unknown as
    | { isRichText?: true; value: string | number; unit?: string }
    | null
    | undefined;

  if (castVal?.unit) {
    return [key, `${castVal.value} ${castVal.unit}`];
  }

  if (castVal?.isRichText) {
    return [
      key,
      <p
        key={key}
        dangerouslySetInnerHTML={{
          __html: String(castVal.value),
        }}
      />,
    ];
  }
  return [key, value];
}
