import { NavLink } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="relative">
      <section className="gradient-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900">
                慧动：读懂你的孩子，定制专属的成长之路
              </h1>
              <p className="mt-5 text-lg text-slate-700">因材施教，慧动未来</p>
              <p className="mt-6 text-slate-700 leading-8">
                每个孩子都是独一无二的星辰，拥有独特的光芒与轨迹。我们引入儿童性格与潜能评估系统，不仅关注“学习”与“运动”，更为不同性格的孩子量身定制最适合他们的全面发展计划。
              </p>
              <div className="mt-8 flex gap-4">
                <NavLink to="/assessment" className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-white font-medium hover:bg-brand-700">
                  立即开启评估
                </NavLink>
                <NavLink to="/plan" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-slate-800 font-medium hover:bg-slate-50">
                  查看个性化计划
                </NavLink>
              </div>
            </div>
            <div className="md:justify-self-end">
              <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">为什么选择慧动？</h3>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>从“通用”到“专属”：真正为孩子量身定制的成长指南</li>
                  <li>扬长平短，全面发展：强化优势，温和补足短板</li>
                  <li>减少亲子摩擦：基于天性的计划更易执行</li>
                  <li>专业深度，科学可靠：联合心理与教育专家</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-900">慧动，如何为您的孩子量体裁衣？</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <h3 className="font-semibold text-slate-900">1. 精准评估</h3>
              <p className="mt-2 text-slate-700">科学性格图谱与优势潜能洞察，快速读懂孩子。</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <h3 className="font-semibold text-slate-900">2. 个性化计划</h3>
              <p className="mt-2 text-slate-700">基于评估结果生成每日/每周学动组合方案。</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <h3 className="font-semibold text-slate-900">3. 动态调整</h3>
              <p className="mt-2 text-slate-700">定期重新评估与家长反馈，持续优化培养计划。</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <FeatureCard title="探索型" points={["探索式学习：科学实验、户外观察", "刺激性运动：攀岩、球类", "在冒险中释放精力、满足好奇心"]} color="bg-sky-50" />
            <FeatureCard title="思考型" points={["深度阅读与策略性游戏", "独处型运动：射箭、瑜伽、慢跑", "在沉淀中锤炼心性"]} color=
              "bg-violet-50" />
            <FeatureCard title="社交型" points={["小组学习与演讲练习", "团队协作运动：足球、接力赛", "在互动中发挥影响力"]} color="bg-emerald-50" />
            <FeatureCard title="自律型" points={["目标管理与挑战任务", "规律性运动：跳绳打卡、游泳计时", "在成就感中不断突破"]} color="bg-amber-50" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900">【应用商店简介版】</h3>
          <p className="mt-4 text-slate-700">慧动App全新上线【性格适配计划】功能！我们相信，没有最好的培养方案，只有最适合的。</p>
          <ul className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-700">
            <li>🧠 科学评估：3分钟了解孩子的性格与优势</li>
            <li>📊 定制计划：探索/思考/社交/自律 四型适配</li>
            <li>🔄 动态优化：计划随成长而变</li>
            <li>💡 扬长平短：强化天赋，补足短板</li>
          </ul>
          <NavLink to="/assessment" className="inline-flex mt-8 items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-white font-medium hover:bg-brand-700">
            立即开始
          </NavLink>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, points, color }: { title: string; points: string[]; color: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 p-6 ${color}`}>
      <h4 className="font-semibold text-slate-900">{title} 孩子</h4>
      <ul className="mt-3 space-y-2 text-slate-700">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  )
}

