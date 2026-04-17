/*
 * LightningChartJS example that showcases visualization of XY scatter chart with confidence ellipse.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, PointShape, ColorCSS, SolidLine, SolidFill, emptyLine, Themes } = lcjs

// Create chart and series.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        legend: { visible: false },
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    const smallView = window.devicePixelRatio >= 2
    if (!window.__lcjsDebugOverlay) {
        window.__lcjsDebugOverlay = document.createElement('div')
        window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
        if (document.body) document.body.appendChild(window.__lcjsDebugOverlay)
        setInterval(() => {
            if (!window.__lcjsDebugOverlay.parentNode && document.body) document.body.appendChild(window.__lcjsDebugOverlay)
            window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + (window.devicePixelRatio >= 2)
        }, 500)
    }
    return t && smallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.devicePixelRatio >= 2 ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle('Scatter chart + confidence Ellipse')

// Create point series for visualizing scatter points.
const pointSeries = chart.addPointSeries().setPointShape(PointShape.Circle).setPointSize(3).setName('Scatter series')

// Visualize confidence ellipse with polygon series.
// Note, routine for calculation of confidence ellipse coordinates from scatter data set is not currently included in LightningChart JS!
const polygonSeries = chart.addPolygonSeries().setCursorEnabled(false).setPointerEvents(false)

// Fetch example data from JSON asset.
fetch(
    new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'examples/assets/0015/data-confidenceEllipseXY.json',
)
    .then((r) => r.json())
    .then((data) => {
        const { scatterPoints, confidenceEllipsePolygonCoords } = data

        // Add data to series.
        pointSeries.appendJSON(scatterPoints)
        polygonSeries
            .add(confidenceEllipsePolygonCoords)
            .setFillStyle(new SolidFill({ color: ColorCSS('gray').setA(30) }))
            .setStrokeStyle(
                new SolidLine({
                    thickness: 1,
                    fillStyle: new SolidFill({ color: ColorCSS('white') }),
                }),
            )
    })
