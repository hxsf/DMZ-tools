/** 应用路由与静态资源共用 Vite 的部署路径。 */
export function appPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
