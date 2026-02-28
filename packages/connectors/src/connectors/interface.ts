export interface Connector<TRecord> {
  readonly id: string;
  readonly description: string;
  fetch(): Promise<TRecord[]>;
}
