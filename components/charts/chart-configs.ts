import { ChartData, ChartOptions } from "chart.js"

export const chartDefaults = {
  fontFamily: "Hanken Grotesk",
  fontSize: 12,
  fontColor: "rgb(153, 165, 176)",
}

export const formatCurrency = (value: number | string): string => {
  if (typeof value === "number") {
    if (value >= 1000) {
      const formattedValue = value / 1000
      if (formattedValue === Math.floor(formattedValue)) {
        return "$" + formattedValue + "k"
      } else {
        return "$" + formattedValue.toFixed(1) + "k"
      }
    }
    return "$" + value
  }
  return String(value)
}

export const formatTooltipCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export const getChartOptions = (): ChartOptions => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          stepSize: 1000,
          crossAlign: "far",
          callback: function (value) {
            return formatCurrency(value)
          },
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 3,
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += formatTooltipCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
  }
}

export const applyGradientToDatasets = (ctx: CanvasRenderingContext2D, chartData: ChartData): ChartData => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, "rgba(108, 180, 218, 0.5)")
  gradient.addColorStop(1, "rgba(108, 180, 218, 0.0)")

  if (chartData.datasets && chartData.datasets.length > 0) {
    chartData.datasets.forEach((dataset) => {
      dataset.backgroundColor = gradient
    })
  }

  return chartData
}
