/**
 * Delays the async function by `timeInMs` milliseconds
 */
export function sleep(
  /**
   * @defaultValue 300
   */
  timeInMs = 300
) {
  return new Promise((r) => {
    setTimeout(r, timeInMs);
  });
}
