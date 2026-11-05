export default function NotFoundView() {
  return (
    <section aria-labelledby="not-found-title">
      <p class="eyebrow">404</p>
      <h1 id="not-found-title">找不到这个页面</h1>
      <p class="page-description">请检查链接，或从上方导航选择工具。</p>
      <a class="text-link" href="/">
        返回打印配方
      </a>
    </section>
  );
}
