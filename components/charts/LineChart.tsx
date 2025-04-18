"use client"

import React, { useEffect, useRef } from "react"
import type { ChartType } from "chart.js"
import { Chart, ChartData } from "chart.js/auto"

import { applyGradientToDatasets, chartDefaults, getChartOptions } from "./chart-configs"
import { dashedBorders } from "./chart-plugins"

interface LineChartProps {
  data?: ChartData
}

const LineChart: React.FC<LineChartProps> = ({ data = null }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  if (!data) return null

  const buildChart = (chartData: ChartData) => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")

    if (ctx) {
      Chart.defaults.font.size = chartDefaults.fontSize
      Chart.defaults.font.family = chartDefaults.fontFamily
      Chart.defaults.color = chartDefaults.fontColor

      const dataWithGradient = applyGradientToDatasets(ctx, chartData)

      chartInstance.current = new Chart(ctx, {
        type: "line" as ChartType,
        data: dataWithGradient,
        options: getChartOptions(),
        plugins: [dashedBorders],
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }

  useEffect(() => {
    const cleanup = buildChart(data)
    return cleanup
  }, [data])

  return (
    <div className="h-50 w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

export default LineChart
