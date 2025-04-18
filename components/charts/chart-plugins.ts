import { Chart } from "chart.js/auto"

export const dashedBorders = {
  id: "dashedBorders",
  beforeDatasetsDraw(chart: Chart) {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = "rgb(211, 217, 223)"
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    ctx.moveTo(left, top)
    ctx.lineTo(left, bottom)
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])

    ctx.beginPath()
    ctx.strokeStyle = "rgb(211, 217, 223)"
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    ctx.moveTo(right, top)
    ctx.lineTo(right, bottom)
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])
  },
}
