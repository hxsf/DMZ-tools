export default function RecipesView() {
  return (
    <section aria-labelledby="recipes-title">
      <p class="eyebrow">解锁跟踪</p>
      <h1 id="recipes-title">打印配方</h1>
      <p class="page-description">查阅装备和材料的打印配方，记录解锁进度。</p>
      <div class="empty-state">
        <h2>配方资料整理中</h2>
        <p>正在核对配方成本与解锁条件。配方查询和进度记录功能将在后续加入。</p>
      </div>
    </section>
  );
}
