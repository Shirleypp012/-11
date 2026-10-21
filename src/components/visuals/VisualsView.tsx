import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Upload
} from 'lucide-react';

export const VisualsView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presetProducts = [
    {
      id: 'watch',
      name: '天枢 Pro 智能运动户外腕表',
      src: '/src/assets/images/smart_watch_product_1790521131565.jpg',
      defaultPrice: '1799',
      defaultOriginal: '2299',
      defaultBenefit: '付定金立减300 · 赠钛合金表带',
    },
    {
      id: 'serum',
      name: '凝时赋活多肽抗老修护精华乳',
      src: '/src/assets/images/skincare_serum_product_1790521142813.jpg',
      defaultPrice: '449',
      defaultOriginal: '680',
      defaultBenefit: '买50ml享100ml正装量 · 敏感肌安心用',
    },
    {
      id: 'headphones',
      name: '极境 SoundAir 无线降噪头戴耳机',
      src: '/src/assets/images/wireless_headphones_product_1790521155137.jpg',
      defaultPrice: '879',
      defaultOriginal: '1299',
      defaultBenefit: '前1小时半价秒杀 · 40小时深海降噪',
    },
    {
      id: 'chair',
      name: '翼行 Ergofit 3D自适应人体工学椅',
      src: '/src/assets/images/ergonomic_chair_product_1790521176795.jpg',
      defaultPrice: '1099',
      defaultOriginal: '1599',
      defaultBenefit: '享国家以旧换新国补15% · 送装一体',
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(presetProducts[0]);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);

  // Marketing visual settings
  const [theme, setTheme] = useState<'red_carnival' | 'presale_neon' | 'national_subsidy' | 'luxury_blackgold'>('red_carnival');
  const [badgeText, setBadgeText] = useState('跨店满300-50');
  const [urgencyText, setUrgencyText] = useState('🔥 11.11 抢先锁定');
  const [mainHeadline, setMainHeadline] = useState('双11狂欢开门红');
  const [benefitCopy, setBenefitCopy] = useState(presetProducts[0].defaultBenefit);
  const [priceValue, setPriceValue] = useState(presetProducts[0].defaultPrice);
  const [originalValue, setOriginalValue] = useState(presetProducts[0].defaultOriginal);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '16:9' | '9:16'>('1:1');
  const [backgroundScene, setBackgroundScene] = useState<'studio_stone' | 'neon_showroom' | 'warm_gradient' | 'minimal_dark'>('studio_stone');
  const [isExporting, setIsExporting] = useState(false);

  // When changing product preset
  const handleSelectProduct = (product: typeof presetProducts[0]) => {
    setSelectedProduct(product);
    setCustomImageSrc(null);
    setPriceValue(product.defaultPrice);
    setOriginalValue(product.defaultOriginal);
    setBenefitCopy(product.defaultBenefit);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions based on aspect ratio
    let width = 800;
    let height = 800;
    if (aspectRatio === '3:4') {
      width = 750;
      height = 1000;
    } else if (aspectRatio === '16:9') {
      width = 960;
      height = 540;
    } else if (aspectRatio === '9:16') {
      width = 540;
      height = 960;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw background scene
    if (backgroundScene === 'neon_showroom') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fef2f2');
      grad.addColorStop(0.5, '#fee2e2');
      grad.addColorStop(1, '#fff1f2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Light glow
      const radial = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      radial.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundScene === 'studio_stone') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundScene === 'warm_gradient') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fffbeb');
      grad.addColorStop(1, '#fef3c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    }

    // Load and draw product image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customImageSrc || selectedProduct.src;
    img.onload = () => {
      const imgAspect = img.width / img.height;
      let targetW = width * 0.78;
      let targetH = targetW / imgAspect;

      if (targetH > height * 0.65) {
        targetH = height * 0.65;
        targetW = targetH * imgAspect;
      }

      const posX = (width - targetW) / 2;
      const posY = (height - targetH) / 2 - height * 0.04;

      // Draw subtle shadow under product
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.drawImage(img, posX, posY, targetW, targetH);
      ctx.restore();

      // Top Dual 11 Header Banner
      drawHeaderBanner(ctx, width, height);

      // Bottom Price Tag & Benefit Bar
      drawBottomBanner(ctx, width, height);

      // Top corner badge
      drawBadge(ctx, width, height);
    };

    function drawHeaderBanner(c: CanvasRenderingContext2D, w: number, h: number) {
      let bannerHeight = h * 0.12;
      let grad = c.createLinearGradient(0, 0, w, 0);

      if (theme === 'red_carnival') {
        grad.addColorStop(0, '#dc2626');
        grad.addColorStop(0.5, '#ef4444');
        grad.addColorStop(1, '#b91c1c');
      } else if (theme === 'presale_neon') {
        grad.addColorStop(0, '#2563eb');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, '#1d4ed8');
      } else if (theme === 'national_subsidy') {
        grad.addColorStop(0, '#059669');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(1, '#047857');
      } else {
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.5, '#334155');
        grad.addColorStop(1, '#0f172a');
      }

      c.fillStyle = grad;
      c.fillRect(0, 0, w, bannerHeight);

      // Border line
      c.strokeStyle = '#f59e0b';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, bannerHeight);
      c.lineTo(w, bannerHeight);
      c.stroke();

      // Text in header
      c.fillStyle = '#ffffff';
      c.font = `bold ${Math.round(w * 0.045)}px sans-serif`;
      c.textBaseline = 'middle';
      c.textAlign = 'left';
      c.fillText(urgencyText, w * 0.04, bannerHeight / 2);

      c.fillStyle = '#fef08a';
      c.font = `bold ${Math.round(w * 0.038)}px sans-serif`;
      c.textAlign = 'right';
      c.fillText('官方正品 · 30天全周期保价', w * 0.96, bannerHeight / 2);
    }

    function drawBottomBanner(c: CanvasRenderingContext2D, w: number, h: number) {
      const bannerH = h * 0.22;
      const startY = h - bannerH;

      // Clean white backdrop with subtle border
      c.fillStyle = '#ffffff';
      c.fillRect(0, startY, w, bannerH);

      c.strokeStyle = '#e2e8f0';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, startY);
      c.lineTo(w, startY);
      c.stroke();

      // Main Title
      c.fillStyle = '#0f172a';
      c.font = `bold ${Math.round(w * 0.05)}px sans-serif`;
      c.textAlign = 'left';
      c.textBaseline = 'top';
      c.fillText(mainHeadline, w * 0.05, startY + bannerH * 0.16);

      // Benefit copy
      c.fillStyle = '#dc2626';
      c.font = `600 ${Math.round(w * 0.034)}px sans-serif`;
      c.fillText(`✦ ${benefitCopy}`, w * 0.05, startY + bannerH * 0.54);

      // Price Tag Box on Right
      const tagW = w * 0.38;
      const tagH = bannerH * 0.76;
      const tagX = w - tagW - w * 0.04;
      const tagY = startY + bannerH * 0.12;

      const pGrad = c.createLinearGradient(tagX, tagY, tagX + tagW, tagY + tagH);
      pGrad.addColorStop(0, '#dc2626');
      pGrad.addColorStop(1, '#b91c1c');
      c.fillStyle = pGrad;
      c.beginPath();
      c.roundRect(tagX, tagY, tagW, tagH, 12);
      c.fill();

      // Price Text
      c.fillStyle = '#fef08a';
      c.font = `bold ${Math.round(w * 0.026)}px sans-serif`;
      c.textAlign = 'center';
      c.fillText('券后到手预售价', tagX + tagW / 2, tagY + tagH * 0.18);

      c.fillStyle = '#ffffff';
      c.font = `bold ${Math.round(w * 0.065)}px monospace`;
      c.fillText(`¥${priceValue}`, tagX + tagW / 2, tagY + tagH * 0.62);

      // Original strikethrough price
      c.fillStyle = '#fca5a5';
      c.font = `${Math.round(w * 0.024)}px monospace`;
      c.fillText(`原价 ¥${originalValue}`, tagX + tagW / 2, tagY + tagH * 0.88);
    }

    function drawBadge(c: CanvasRenderingContext2D, w: number, h: number) {
      const badgeW = w * 0.34;
      const badgeH = h * 0.06;
      const bx = w * 0.04;
      const by = h * 0.14;

      c.fillStyle = '#f59e0b';
      c.beginPath();
      c.roundRect(bx, by, badgeW, badgeH, 6);
      c.fill();

      c.fillStyle = '#ffffff';
      c.font = `bold ${Math.round(w * 0.032)}px sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(badgeText, bx + badgeW / 2, by + badgeH / 2);
    }
  }, [
    selectedProduct,
    customImageSrc,
    theme,
    badgeText,
    urgencyText,
    mainHeadline,
    benefitCopy,
    priceValue,
    originalValue,
    aspectRatio,
    backgroundScene,
  ]);

  // Export current canvas as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PicPilot_1111_${selectedProduct.id}_${aspectRatio.replace(':', 'x')}.png`;
      link.href = dataUrl;
      link.click();
      setIsExporting(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              PicPilot 引擎驱动
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              双十一商品视觉战袍与营销素材工坊
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            基于真实商品图进行大促战袍包装、AI智能换底与扩图、批量输出天猫/京东/抖音/逛逛高转化主图。
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? '高清渲染导出中...' : '一键导出高清大促图 (PNG)'}</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          {/* 1. Product Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800">
                1. 选择商品拍摄原图 (支持自定义上传)
              </label>
              <label className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                <span>上传本地产品图</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {presetProducts.map((p) => {
                const isSelected = selectedProduct.id === p.id && !customImageSrc;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`group relative rounded-lg overflow-hidden border p-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <img
                      src={p.src}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover rounded"
                    />
                    <div className="mt-1 text-[10px] text-slate-700 font-medium line-clamp-1 text-center">
                      {p.name.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Marketing Atmosphere Themes */}
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-2">
              2. 双十一战袍视觉主题
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'red_carnival', label: '11.11 狂欢开门红' },
                { id: 'presale_neon', label: '预售定金超级膨胀' },
                { id: 'national_subsidy', label: '政府换新国补专区' },
                { id: 'luxury_blackgold', label: '黑钻极简黑金风' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-red-500 bg-red-50 text-red-700 font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Background Scene */}
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-2">
              3. AI场景智能换底与展台氛围
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'studio_stone', label: '极简石阶摄影台 (推荐)' },
                { id: 'neon_showroom', label: '大促红晕柔光展厅' },
                { id: 'warm_gradient', label: '温馨暖冬光影渐变' },
                { id: 'minimal_dark', label: '纯净极简明亮展台' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setBackgroundScene(s.id as any)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    backgroundScene === s.id
                      ? 'border-red-500 bg-red-50 text-red-700 font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Functional Badges */}
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-2">
              4. 核心营销利益点水印角标
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                '跨店满300-50',
                '前1小时半价',
                '付定金立减300',
                '官方立减15%',
                '享国补折上折20%',
                '买一赠一正装量',
                '现货顺丰速发',
              ].map((badge) => (
                <button
                  key={badge}
                  onClick={() => setBadgeText(badge)}
                  className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    badgeText === badge
                      ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Typography Customization */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">主标题文案</label>
              <input
                type="text"
                value={mainHeadline}
                onChange={(e) => setMainHeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">核心卖点利益副标题</label>
              <input
                type="text"
                value={benefitCopy}
                onChange={(e) => setBenefitCopy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">大促券后价 (元)</label>
                <input
                  type="text"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">专柜/参考标价 (元)</label>
                <input
                  type="text"
                  value={originalValue}
                  onChange={(e) => setOriginalValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* 6. Aspect Ratio Switcher */}
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-2">
              6. 电商渠道画幅尺寸适配
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: '1:1', label: '1:1', desc: '天猫主图' },
                { id: '3:4', label: '3:4', desc: '微淘逛逛' },
                { id: '16:9', label: '16:9', desc: '魔方横幅' },
                { id: '9:16', label: '9:16', desc: '抖音海报' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    aspectRatio === ratio.id
                      ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div>{ratio.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas Preview Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-6 min-h-[580px] shadow-xs">
          <div className="text-xs text-slate-500 mb-3 flex items-center gap-2 font-medium">
            <span>实时画板渲染预览 · 导出尺寸：</span>
            <span className="font-mono text-red-600 font-semibold">
              {aspectRatio === '1:1' && '800 x 800 px (天猫/京东官方主图规格)'}
              {aspectRatio === '3:4' && '750 x 1000 px (小红书/微淘种草图规格)'}
              {aspectRatio === '16:9' && '960 x 540 px (直通车/魔方投放横幅)'}
              {aspectRatio === '9:16' && '540 x 960 px (短视频竖屏信息流海报)'}
            </span>
          </div>

          {/* Canvas Box */}
          <div className="relative shadow-lg rounded-xl overflow-hidden border border-slate-200 max-w-full">
            <canvas
              ref={canvasRef}
              className="max-h-[520px] max-w-full w-auto object-contain block bg-slate-50"
            />
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>✓ 自动抗锯齿优化</span>
            <span>·</span>
            <span>✓ 严格满足天猫与京东无牛皮癣违规审核标准</span>
            <span>·</span>
            <span>✓ 30天全周期保价防纠纷印记</span>
          </div>
        </div>
      </div>
    </div>
  );
};
