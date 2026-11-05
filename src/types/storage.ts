import type { Option, Result } from "ts-results-es";

export type KVOperation = "get" | "set" | "delete";

/** 错误码供界面翻译，cause 保留底层诊断信息，不直接作为用户文案。 */
export interface KVError {
  readonly code: "access-denied" | "quota-exceeded" | "unavailable";
  readonly operation: KVOperation;
  readonly key: string;
  readonly cause: unknown;
}

/**
 * 异步字符串 KV；业务数据的校验和序列化由调用方负责。
 * get 在键不存在时返回 Ok(None)，有值时返回 Ok(Some(value))。
 * 访问失败返回 Err，不 reject；空字符串是存在的值。
 * 写操作成功完成后才返回 Ok；不提供事务或多端冲突合并。
 */
export interface AsyncKV {
  get(key: string): Promise<Result<Option<string>, KVError>>;
  set(key: string, value: string): Promise<Result<void, KVError>>;
  /** 删除不存在的键也视为成功。 */
  delete(key: string): Promise<Result<void, KVError>>;
}
