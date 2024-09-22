<template>
  <div class="p-2" style="border-radius: 10px; background: #146ec833;">
    <apexchart :height="260" type="bar" class="dactivity1" id="dactivity1" :options="chartLogs.options" :series="chartLogs.series" />
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import axios from "axios"
import AOS from "aos"

export default {
  setup() {
    const chartLogs = ref({
      series: [{ data: [] }],
      options: {
        chart: { type: "bar", stacked: false, toolbar: { show: true } },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            columnWidth: "28%",
            endingShape: "rounded",
            borderRadius: 5,
            dataLabels: { position: "bottom" }
          }
        },
        legend: { show: true },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: { colors: ["#fff"] },
          formatter: (val, opt) => `${opt.w.globals.labels[opt.dataPointIndex]}:  ${val}`,
          offsetX: 0,
          dropShadow: { enabled: true }
        },
        stroke: { width: 1, colors: ["#fff"] },
        xaxis: { categories: [] },
        yaxis: { labels: { show: false } },
        title: { text: "", align: "center", floating: true },
        fill: { opacity: 1 },
        tooltip: {
          x: { show: true },
          y: { formatter: (val) => `${val} Histori` }
        }
      }
    })

    const fetchChartLogs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        const response = await axios.get("/api/v1/dashboard/logs-chart", config)
        const logsData = response.data.data

        console.log("💚 LOGS CHART", logsData)

        const keyOrder = ["checkin", "checkout", "fraud", "out_of_scope"]
        const dataArray = keyOrder.map((key) => logsData[key] || 0)

        chartLogs.value = {
          series: [{ data: dataArray }],
          options: {
            xaxis: { categories: ["CHECKIN", "CHECKOUT", "FRAUD", "OUT OF SCOPE"] }
          }
        }
      } catch (error) {
        console.error("💥 LOGS CHART Error:", error)
      }
    }

    onMounted(() => {
      AOS.init({
        disable: () => window.innerWidth < 996,
        once: true,
        duration: 800
      })

      fetchChartLogs()
    })

    return { chartLogs }
  }
}
</script>
