export type SourceId = `source:${string}`;

export interface DataSource {
  readonly id: SourceId;
  readonly title: string;
  readonly url: string;
  readonly kind: "official" | "community" | "in-game";
  readonly accessedOn: string;
  readonly publishedOn: string | null;
  readonly updatedOn: string | null;
  /** 来源适用版本；无法确定时不能用访问日期代替游戏版本。 */
  readonly gameVersion: string | null;
}

export interface Claim<T> {
  readonly value: T;
  readonly sourceIds: readonly [SourceId, ...SourceId[]];
  readonly note?: string;
}

/** reported 仅表示来源有记载，不表示已经在当前游戏版本中实测。 */
export type Fact<T> =
  | ({ readonly status: "reported" } & Claim<T>)
  | {
      readonly status: "unknown";
      readonly note: string;
    }
  | {
      readonly status: "conflicting";
      readonly claims: readonly [Claim<T>, Claim<T>, ...Claim<T>[]];
      readonly note: string;
    };
