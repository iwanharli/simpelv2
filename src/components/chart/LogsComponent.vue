<template>
  <div class="bg-soft-light p-2" style="border-radius: 10px">
    <apexchart :height="260" type="bar" class="dactivity1" id="dactivity1" :options="chartLogs.options" :series="chartLogs.series" />
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import axios from "axios"
import AOS from "aos"

export default {
  data() {
    return {
      logsData: []
    }
  },

  setup() {
    const chartLogs = ref({
      series: [
        {
          data: []
        }
      ],
      options: {
        chart: {
          type: "bar",
          stacked: false,
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            columnWidth: "28%",
            endingShape: "rounded",
            borderRadius: 5,
            dataLabels: {
              position: "bottom"
            }
          }
        },
        legend: {
          show: true
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#fff"]
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
          text: "",
          align: "center",
          floating: true
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          x: {
            show: true
          },
          y: {
            formatter: function (val) {
              return val + " Histori"
            }
          }
        }
      }
    })

    onMounted(() => {
      AOS.init({
        disable: function () {
          var maxWidth = 996
          return window.innerWidth < maxWidth
        },
        once: true,
        duration: 800
      })
    })
    return { chartLogs }
  },

  mounted() {
    this.fetchChartLogs()
  },

  methods: {
    async fetchChartLogs() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      await axios
        .get("/api/v1/dashboard/logs-chart", config)
        .then((response) => {
          this.logsData = response.data.data
          console.log("💚 LOGS CHART", this.logsData)

          const keyOrder = ["checkin", "checkout", "fraud", "out_of_scope"]

          // Create an array based on the specified order
          const dataArray = keyOrder.map((key) => this.logsData[key])

          console.log(dataArray)

          this.chartLogs = {
            series: [
              {
                data: dataArray
              }
            ],
            options: {
              xaxis: {
                categories: ["CHECKIN", "CHECKOUT", "FRAUD", "OUT OF SCOPE"]
              }
            }
          }
        })
        .catch((error) => {
          console.error("💥 LOGS CHART Error:", error)
        })
    }
  }
}
</script>
