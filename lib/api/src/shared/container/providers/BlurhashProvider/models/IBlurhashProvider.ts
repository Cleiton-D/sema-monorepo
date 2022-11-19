export default interface IBlurhashProvider {
  encode: (path: string) => Promise<string>;
}
