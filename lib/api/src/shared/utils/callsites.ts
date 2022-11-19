export default function callsites(): NodeJS.CallSite[] {
  const { prepareStackTrace } = Error;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack?.slice(1);
  Error.prepareStackTrace = prepareStackTrace;
  return stack as unknown as NodeJS.CallSite[];
}
