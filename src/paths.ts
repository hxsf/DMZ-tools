/** 与 Vite 资源路径共用部署前缀；本地为 /，Pages 为 /DMZ-tools/。 */
export function appPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
