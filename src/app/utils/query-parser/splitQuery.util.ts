/**
 * Splits a search query string into individual field expressions,
 * handling parentheses, quoted strings, and preserving `NOT` operator.
 *
 * @returns {string[]} An array of field expressions, each trimmed and isolated.
 *
 * @example
 * splitQuery("field1:* field2:(A OR B) field3:value NOT field4:value")
 * // Returns: ['field1:*', 'field2:(A OR B)', 'field3:value', 'NOT field4:value']
 *
 * @example
 * splitQuery("name:regexp(Apple) weight>=10 brand:(Apple OR Banana) date>=dt(2.5 weeks ago)")
 * // Returns: ['name:regexp(apple|banana)', 'weight>=10', 'brand:(Apple OR Banana)']
 */
export function splitQuery({
  query,
}: {
  /**
   * The full query string to split. Each field expression is separated by spaces,
   * but spaces inside parentheses are preserved.
   * Supports wildcards (*), quotes ("), NOT operator, and function-style expressions like abc:regexp(...)
   */
  query: string;
}) {
  const tokens: string[] = [];
  let current = "";
  let depth = 0;
  let inQuotes = false;
  let i = 0;

  while (i < query.length) {
    const char = query[i];
    const next4 = query.slice(i, i + 4);
    const prevChar = query[i - 1];

    // Toggle quote state (ignore escaped quote)
    if (char === '"' && prevChar !== "\\") {
      inQuotes = !inQuotes;
      current += char;
      i++;
      continue;
    }

    // Handle NOT operator as special token
    if (
      next4 === "NOT " &&
      !inQuotes &&
      depth === 0 &&
      (i === 0 || query[i - 1] === " ")
    ) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = "";
      }
      current += "NOT ";
      i += 4;
      continue;
    }

    // Handle parentheses depth for abc:regexp(...)
    if (!inQuotes) {
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
      }
    }

    // Split on space only if we're outside quotes, asterisks, and parentheses
    if (char === " " && !inQuotes && depth === 0) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = "";
      }
    } else {
      current += char;
    }

    i++;
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}
