export const DashboardColumnChart = {
  series: [
    {
      name: "Aplication Sent",
      data: [40, 55, 15, 55],
    },
    {
      name: "Appllication Answered",
      data: [40, 55, 35, 55],
    },
    {
      name: "Hired",
      data: [40, 17, 55, 55],
    },
  ],

  chartOptions: {
    chart: {
      type: "bar",
      height: 120,
      width: 150,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1600,
        options: {
          chart: {
            width: 100,
          },
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
      {
        breakpoint: 1600,
        options: {
          chart: {
            width: 80,
          },
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        colors: {
          backgroundBarColors: ["#ECECEC", "#ECECEC", "#ECECEC", "#ECECEC"],
          backgroundBarOpacity: 1,
        },
      },
    },
    colors: ["#ECECEC", "#886CC0", "#886CC0"],
    xaxis: {
      show: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: "#828282",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "light",
          cssClass: "apexcharts-xaxis-label",
        },
      },

      crosshairs: {
        show: false,
      },

      categories: ["Sun", "Mon", "Tue"],
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    toolbar: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  },
};

export const NewCustomers1 = {
  series: [
    {
      name: "Net Profit",
      data: [100, 300, 100, 400, 200, 400],
      /* radius: 30,	 */
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 6,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    xaxis: {
      categories: ["Jan", "feb", "Mar", "Apr", "May"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
      colors: "#FB3E7A",
    },
    tooltip: {
      enabled: false,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};

export const NewCustomers2 = {
  series: [
    {
      name: "Net Profit",
      data: [100, 300, 200, 400, 100, 400],
      /* radius: 30,	 */
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      width: 80,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#0E8A74"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 6,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    xaxis: {
      categories: ["Jan", "feb", "Mar", "Apr", "May"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
      colors: "#FB3E7A",
    },
    tooltip: {
      enabled: false,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};

export const RevenueMap = {
  series: [
    {
      name: "Net Profit",
      data: [20, 40, 20, 30, 50, 40, 60],
      //radius: 12,
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        endingShape: "rounded",
      },
    },
    colors: ["#886CC0"],
    dataLabels: {
      enabled: false,
    },
    markers: {
      shape: "circle",
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 10,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      borderColor: "var(--border)",
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
      labels: {
        style: {
          colors: "#7E7F80",
          fontSize: "13px",
          fontFamily: "Poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        offsetX: -15,
        style: {
          colors: "#7E7F80",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: 100,
        },
        formatter: function (y: any) {
          return y.toFixed(0) + "k";
        },
      },
    },
    fill: {
      opacity: 1,
      colors: "#FAC7B6",
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " hundred";
        },
      },
    },
  },
};

export const redial = {
  series: [70],
  chartOptions: {
    chart: {
      type: "radialBar",
      offsetY: -2,
      height: 300,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        track: {
          background: "#f3edff",
          strokeWidth: "100%",
          margin: 5,
        },

        hollow: {
          margin: 30,
          size: "45%",
          background: "#F1EAFF",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
        },

        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
            fontSize: "22px",
            color: "#886CC0",
            fontWeight: 700,
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1600,
        options: {
          chart: {
            height: 250,
          },
        },
      },
    ],
    grid: {
      padding: {
        top: -10,
      },
    },
    /* stroke: {
          dashArray: 4,
      colors:'#6EC51E'
        }, */
    fill: {
      type: "gradient",
      colors: "#FF63E6",
      gradient: {
        shade: "white",
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    labels: ["Average Results"],
  },
};

export const Emailchart = {
  series: [27, 11, 22, 15, 25],
  chartOptions: {
    chart: {
      type: "donut",
      height: 230,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    colors: ["var(--primary)", "#26E023", "#61CFF1", "#FFDA7C", "#FF86B1"],
    legend: {
      position: "bottom",
      show: false,
    },
    responsive: [
      {
        breakpoint: 1800,
        options: {
          chart: {
            height: 200,
          },
        },
      },
      {
        breakpoint: 1800,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
  },
};

export const pieChart2 = {
  series: [90, 68, 85],
  chartOptions: {
    chart: {
      type: "donut",
      height: 230,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    colors: ["#1D92DF", "#4754CB", "#D55BC1"],
    legend: {
      position: "bottom",
      show: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
  },
};
export const pieChart3 = {
  series: [90, 68, 85],
  chartOptions: {
    chart: {
      type: "donut",
      height: 230,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    colors: ["#F6AD2E", "var(--primary)", "#412EFF"],
    legend: {
      position: "bottom",
      show: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
  },
};

export const chartBar = {
  series: [
    {
      name: "Net Profit",
      data: [15, 55, 90, 80, 25, 15, 70],
      //radius: 12,
    },
    {
      name: "Revenue",
      data: [60, 65, 15, 35, 30, 5, 40],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 230,

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        endingShape: "rounded",
      },
    },
    colors: ["#01111C", "var(--primary)"],
    dataLabels: {
      enabled: false,
    },
    markers: {
      shape: "circle",
    },

    grid: {
      show: true,
      strokeDashArray: 6,
    },
    legend: {
      show: false,
      fontSize: "12px",
      labels: {
        colors: "#000000",
      },
      markers: {
        width: 18,
        height: 18,
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 12,
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },

    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      grid: {
        color: "rgba(233,236,255,0.5)",
        drawBorder: true,
      },
      labels: {
        style: {
          colors: "#787878",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      crosshairs: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#787878",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " thousands";
        },
      },
    },
  },
};
export const columnChart = {
  series: [
    {
      name: "Number of Projects",
      type: "column",
      data: [75, 85, 72, 100, 50, 100, 80, 75, 95, 35, 75, 100],
    },
    {
      name: "Revenue",
      type: "area",
      data: [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50, 42],
    },
    {
      name: "Active Projects",
      type: "line",
      data: [30, 25, 45, 30, 25, 35, 20, 45, 35, 20, 35, 20],
    },
  ],
  chartOptions: {
    chart: {
      height: 300,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 1, 1],
      curve: "straight",
      dashArray: [0, 0, 5],
    },
    legend: {
      fontSize: "13px",
      fontFamily: "poppins",
      labels: {
        colors: "#888888",
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "18%",
        borderRadius: 6,
      },
    },
    fill: {
      //opacity: [0.1, 0.1, 1],
      type: "gradient",
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        /* opacityFrom: 0.85,
            opacityTo: 0.55, */
        colorStops: [
          [
            {
              offset: 0,
              color: "var(--primary)",
              opacity: 1,
            },
            {
              offset: 100,
              color: "var(--primary)",
              opacity: 1,
            },
          ],
          [
            {
              offset: 0,
              color: "#3AC977",
              opacity: 1,
            },
            {
              offset: 0.4,
              color: "#3AC977",
              opacity: 0.15,
            },
            {
              offset: 100,
              color: "#3AC977",
              opacity: 0,
            },
          ],
          [
            {
              offset: 0,
              color: "#FF5E5E",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#FF5E5E",
              opacity: 1,
            },
          ],
        ],
        stops: [0, 100, 100, 100],
      },
    },
    colors: ["var(--primary)", "#3AC977", "#FF5E5E"],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    markers: {
      size: 0,
    },
    xaxis: {
      type: "month",
      labels: {
        style: {
          fontSize: "13px",
          colors: "#888888",
        },
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#888888",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y: any) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
  },
};
export const VisitorsChart = {
  series: [
    {
      name: "Net Profit",
      data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const sessionsChart = {
  series: [
    {
      name: "Net Profit",
      data: [19, 9, 36, 12, 44, 25, 59, 41, 66, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--secondary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--secondary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const LiveChart = {
  series: [
    {
      name: "Net Profit",
      data: [20, 18, 30, 12, 44, 25, 59, 41, 66, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["#58bad7"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["#58bad7"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const chartBarRunning = {
  series: [
    {
      name: "Income",
      data: [31, 40, 28, 31, 40, 28, 31, 40, 28, 31, 40, 28],
    },
    {
      name: "Expense",
      data: [11, 32, 45, 38, 25, 20, 36, 45, 15, 11, 32, 45],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 300,

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "45%",
        borderRadius: 2,
      },
    },
    colors: ["#", "#77248B"],
    dataLabels: {
      enabled: false,
    },
    markers: {
      shape: "circle",
    },
    legend: {
      show: false,
      fontSize: "12px",
      labels: {
        colors: "#000000",
      },
      markers: {
        width: 30,
        height: 30,
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 35,
      },
    },
    stroke: {
      show: true,
      width: 6,
      colors: ["transparent"],
    },
    grid: {
      borderColor: "rgba(252, 252, 252,0.2)",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#000",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "#78909C",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: -16,
        style: {
          colors: "#000",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["var(--primary)", "#FFD125"],
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " thousands";
        },
      },
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "1%",
              borderRadius: -1,
            },
          },
          chart: {
            height: 250,
          },
          series: [
            {
              name: "Projects",
              data: [31, 40, 28, 31, 40, 28, 31, 40],
            },
            {
              name: "Projects",
              data: [11, 32, 45, 31, 40, 28, 31, 40],
            },
          ],
        },
      },
    ],
  },
};

function generateDayWiseTimeSeries(baseval: number, count: number, yrange: any) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = baseval;
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}
export const Statistics = {
  series: [
    {
      name: "Order",
      data: generateDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 20, {
        min: 10,
        max: 5287,
      }),
    },
    {
      name: "Profit",
      data: generateDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 20, {
        min: 10,
        max: 5658,
      }),
    },
    {
      name: "Last Month",
      data: generateDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 20, {
        min: 10,
        max: 8554,
      }),
    },
  ],
  chartOptions: {
    chart: {
      type: "area",
      height: 300,
      stacked: true,
      events: {
        selection: function (chart: any, e: any) {
          console.log(new Date(e.xaxis.min));
        },
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#3f7197", "#58bad7", "#ffd125"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      type: "datetime",
    },
  },
};

function generateData(count: any, yrange: any, includeZ: any) {
  let i = 0;
  const series = [];
  if (!includeZ) includeZ = false;
  while (i < count) {
    const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
    if (includeZ) {
      series.push([x, y, z]);
    } else {
      series.push([x, y]);
    }
    i++;
  }
  return series;
}

export const salesFigures = {
  series: [
    {
      name: "Dribble",
      // @ts-ignore
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Facebook",
      // @ts-ignore
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Meta",
      // @ts-ignore
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Google",
      // @ts-ignore
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
  ],
  chartOptions: {
    chart: {
      height: 250,
      // width: 250,
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        // columnWidth: "70%"
      },
    },

    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: ["#fff"],
      width: 8,
      dashArray: 0,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#452b90", "#ffd125"],
    title: {
      text: "",
    },
  },
};

export const totalSale = {
  series: [
    {
      name: "Net Profit",
      data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    markers: {
      size: [3],
      strokeWidth: [2],
      strokeColors: ["#fff"],
      border: 3,
      radius: 4,
      colors: ["var(--primary)"],
      hover: {
        size: 10,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const totalPurchase = {
  series: [
    {
      name: "Net Profit",
      data: [17, 13, 34, 13, 45, 24, 60, 40, 65, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--secondary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--secondary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    markers: {
      size: [3],
      strokeWidth: [2],
      strokeColors: ["#fff"],
      border: 3,
      radius: 4,
      colors: ["var(--secondary)"],
      hover: {
        size: 10,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const activeCustomers = {
  series: [
    {
      name: "Net Profit",
      data: [19, 12, 33, 12, 45, 24, 60, 40, 70, 30],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["#58bad7"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["#58bad7"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    markers: {
      size: [3],
      strokeWidth: [2],
      strokeColors: ["#fff"],
      border: 3,
      radius: 4,
      colors: ["#58bad7"],
      hover: {
        size: 10,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};

export const AllProject = {
  series: [12, 30, 20],
  chartOptions: {
    chart: {
      type: "donut",
      width: 150,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "Arial",
              fontWeight: "500",
              offsetY: -17,
            },
            total: {
              show: true,
              fontSize: "11px",
              fontWeight: "500",
              fontFamily: "Arial",
              label: "Compete",

              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: string, b: string) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#3AC977", "var(--primary)", "var(--secondary)"],
    labels: ["Compete", "Pending", "Not Start"],
    dataLabels: {
      enabled: false,
    },
  },
};
export const Traffic = {
  series: [12, 30, 20, 40, 20],
  chartOptions: {
    chart: {
      type: "donut",
      width: 270,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "Arial",
              fontWeight: "500",
              offsetY: -17,
            },
            total: {
              show: true,
              fontSize: "11px",
              fontWeight: "500",
              fontFamily: "Arial",
              label: "SCSS",

              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: string, b: string) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#3AC977", "#666cff", "var(--primary)", "var(--secondary)", "#000"],
    labels: ["Html", "CSS", "SCSS", "C++", "JavaScript"],
    dataLabels: {
      enabled: false,
    },
  },
};
const p = ["Html", "UI", "JS", "PHP", "CSS"];
export const ProjectChart = {
  series: [
    {
      data: [
        {
          x: "James",
          y: [new Date("2019-02-27").getTime(), new Date("2019-03-04").getTime()],
          fillColor: "var(--primary)",
        },
        {
          x: "Robert",
          y: [new Date("2019-03-04").getTime(), new Date("2019-03-08").getTime()],
          fillColor: "var(--secondary)",
        },
        {
          x: "Mary",
          y: [new Date("2019-03-07").getTime(), new Date("2019-03-10").getTime()],
          fillColor: "#3a9b94",
        },
        {
          x: "Patricia",
          y: [new Date("2019-03-08").getTime(), new Date("2019-03-12").getTime()],
          fillColor: "#666cff",
        },
        {
          x: "Smith",
          y: [new Date("2019-03-12").getTime(), new Date("2019-03-17").getTime()],
          fillColor: "#FF4560",
        },
      ],
    },
  ],
  chartOptions: {
    chart: {
      height: 260,
      type: "rangeBar",
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
        //borderRadius: 6,
        //radius: 30,
        //enableShades: false,
        distributed: !0,

        dataLabels: {
          hideOverflowingLabels: !1,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (_val: any, opts: any) {
        const label = opts.w.globals.labels[opts.dataPointIndex];
        const diff = 5;
        return label + ": " + diff + (diff > 1 ? " days" : " day");
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },

    xaxis: {
      type: "datetime",
      axisTicks: {
        show: !1,
      },
      axisBorder: {
        show: !1,
      },
      labels: {
        style: {
          colors: "#ee",
        },
        datetimeFormatter: {
          year: "MMM",
          month: "MMM",
        },
      },
    },
    yaxis: {
      labels: {
        show: !0,
        align: "left",
        style: {
          fontSize: "0.875rem",
          colors: "black",
        },
      },
    },
    grid: {
      strokeDashArray: 6,
      borderColor: "#eee",
      xaxis: {
        lines: {
          show: !0,
        },
      },
      yaxis: {
        lines: {
          show: !1,
        },
      },
      padding: {
        top: -32,
        left: 15,
        right: 18,
        bottom: 4,
      },
    },
    responsive: [
      {
        breakpoint: 1920,
        options: {
          dataLabels: {
            formatter: function (e: any, t: any) {
              return p[t.dataPointIndex];
            },
          },
        },
      },
    ],
  },
};
export const activity1 = {
  series: [
    {
      name: "Running",
      data: [1400, 800, 1200, 550, 1550, 600, 1250],
    },
  ],
  chartOptions: {
    chart: {
      height: 250,
      type: "area",
      group: "social",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
      tooltipHoverFormatter: function (val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "";
      },
      markers: {
        fillColors: ["var(--primary)"],
        width: 3,
        height: 16,
        strokeWidth: 0,
        radius: 16,
      },
    },
    markers: {
      size: [8],
      strokeWidth: [4],
      strokeColors: ["#fff"],
      border: 4,
      radius: 4,
      colors: ["var(--primary)"],
      hover: {
        size: 10,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: {
          colors: "#3E4954",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: 100,
        },
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: "right",
        minWidth: 15,
        offsetX: -16,
        style: {
          colors: "#666666",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: 100,
        },
      },
    },
    fill: {
      colors: ["#fff", "var(--primary)"],
      type: "gradient",
      opacity: 1,
      gradient: {
        shade: "light",
        shadeIntensity: 1,
        colorStops: [
          [
            {
              offset: 0,
              color: "var(--primary)",
              opacity: 0.4,
            },
            {
              offset: 0.6,
              color: "var(--primary)",
              opacity: 0.25,
            },
            {
              offset: 100,
              color: "var(--primary)",
              opacity: 0,
            },
          ],
          [
            {
              offset: 0,
              color: "var(--primary)",
              opacity: 0.4,
            },
            {
              offset: 50,
              color: "var(--primary)",
              opacity: 0.25,
            },
            {
              offset: 100,
              color: "#fff",
              opacity: 0,
            },
          ],
        ],
      },
    },
    colors: ["var(--primary)", "var(--primary)"],
    stroke: {
      curve: "straight",
      width: 3,
    },
    grid: {
      borderColor: "#e1dede",
      strokeDashArray: 8,

      xaxis: {
        lines: {
          show: true,
          opacity: 0.5,
        },
      },
      yaxis: {
        lines: {
          show: true,
          opacity: 0.5,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
    },
    responsive: [
      {
        breakpoint: 1602,
        options: {
          markers: {
            size: [6, 6, 4],
            hover: {
              size: 7,
            },
          },
          chart: {
            height: 230,
          },
        },
      },
    ],
  },
};
export const NewCustomers = {
  series: [
    {
      name: "Net Profit",
      data: [100, 300, 100, 400, 200, 400],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 250,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    fill: {
      opacity: 1,
      colors: "#FB3E7A",
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};

export const ExtraData = {
  series: [
    {
      name: "Sent",
      data: [40, 55, 15, 40, 55, 15, 40, 50],
    },
    {
      name: "Answered",
      data: [55, 55, 35, 60, 55, 35, 60, 30],
    },
    {
      name: "Hired",
      data: [20, 17, 55, 45, 17, 55, 45, 20],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 260,
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        endingShape: "rounded",
        startingShape: "rounded",
        backgroundRadius: 10,
        borderRadius: 5,
        colors: {
          backgroundBarColor: "#fff",
          backgroundBarOpacity: 1,
          backgroundBarRadius: 10,
        },
      },
    },
    stroke: {
      width: 5,
      colors: ["#fff"],
    },
    colors: ["var(--secondary)", "var(--primary)", "#58bad7"],
    xaxis: {
      show: false,
      axisBorder: {
        show: false,
      },

      labels: {
        show: false,
        style: {
          colors: "#828282",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "light",
          cssClass: "apexcharts-xaxis-label",
        },
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#828282",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "light",
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#DBDBDB",
      strokeDashArray: 10,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    toolbar: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    responsive: [
      {
        breakpoint: 1601,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
            },
          },
        },
      },
    ],
  },
};

export const analyticsChartbar = {
  series: [
    {
      name: "Earning",
      data: [96, 60, 90, 96, 60, 90],
      //radius: 12,
    },
    {
      name: "Profit",
      data: [80, 40, 55, 80, 40, 55],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 250,

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        endingShape: "rounded",
        borderRadius: 8,
      },
    },
    states: {
      hover: {
        filter: "none",
      },
    },
    colors: ["var(--primary)", "var(--secondary)"],
    dataLabels: {
      enabled: true,
      offsetY: -30,

      style: {
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    markers: {
      shape: "circle",
    },

    legend: {
      show: false,
      fontSize: "12px",
      labels: {
        colors: "#000000",
      },
      markers: {
        width: 18,
        height: 18,
        strokeWidth: 10,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 12,
      },
    },
    stroke: {
      show: true,
      width: 20,
      curve: "smooth",
      lineCap: "round",
      colors: ["transparent"],
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ["JAN", "FEB", "MAR", "APR", "MAY"],
      labels: {
        show: false,
        style: {
          colors: "#A5AAB4",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "poppins",
          cssClass: "apexcharts-xaxis-label",
        },
      },
      crosshairs: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
        offsetX: -16,
        style: {
          colors: "#000000",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
  },
};
export const TotalEarning = {
  series: [
    {
      name: "Earning",
      data: [15, 10, 20, 8, 12, 18, 12, 5, 18, 12, 5],
    },
    {
      name: "Expense",
      data: [-7, -10, -7, -12, -6, -9, -5, -8, -9, -5, -8],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 150,
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "25%",
        borderRadius: 5,
        endingShape: "rounded",
        startingShape: "rounded",
      },
    },
    stroke: {
      width: 5,
      colors: ["#fff"],
    },
    colors: ["var(--secondary)", "var(--primary)", "#58bad7"],
    xaxis: {
      show: false,
      axisBorder: {
        show: false,
      },

      labels: {
        show: false,
        style: {
          colors: "#828282",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "light",
          cssClass: "apexcharts-xaxis-label",
        },
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#828282",
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "light",
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    grid: {
      show: !1,
      padding: {
        top: -40,
        bottom: -20,
        left: -10,
        right: -2,
      },
    },
    toolbar: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    responsive: [
      {
        breakpoint: 1601,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
            },
          },
        },
      },
    ],
  },
};
export const SalesChart = {
  series: [
    {
      name: "Net Profit",
      data: [100, 300, 100, 400, 200, 400],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 120,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const EarningChart = {
  series: [
    {
      name: "Net Profit",
      data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--secondary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
      colors: ["var(--secondary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};

export const ProfitChart = {
  series: [
    {
      name: "Net Profit",
      data: [23, 18, 29, 45, 30, 41, 35, 56, 43, 70],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " ";
        },
      },
    },
  },
};
export const ExpenseChart = {
  series: [
    {
      name: "Net Profit",
      data: [20, 19, 30, 46, 32, 42, 37, 56, 42, 70],
    },
  ],
  chartOptions: {
    chart: {
      type: "line",
      height: 50,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["#58bad7"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
      colors: ["#58bad7"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    x: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    y: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " ";
        },
      },
    },
  },
};

export const doughtnutChart = {
  series: [30, 40, 20, 10],
  chartOption: {
    chart: {
      type: "donut",
      width: 250,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "90%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Arial",
              fontWeight: "500",
              offsetY: -17,
            },
            total: {
              show: true,
              fontSize: "11px",
              fontWeight: "500",
              fontFamily: "Arial",
              label: "Total projects",

              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: string, b: string) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#FF9F00", "var(--primary)", "#3AC977", "#FF5E5E"],
    labels: ["Compete", "Pending", "Not Start"],
    dataLabels: {
      enabled: false,
    },
  },
};

export const flotBar1Chart = {
  series: [
    {
      name: "bar chart",
      data: [2.5, 7.5, 5, 12.5, 7, 4, 6],
      bars: {
        show: true,
        lineWidth: 0,
        fillColor: "#0d99ff",
      },
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    bars: {
      show: true,
      lineWidth: 0,
      fillColor: "#0d99ff",
    },
    chart: {
      type: "bar",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
    },
  },
};
export const flotBar2Chart = {
  series: [
    {
      name: "Running",
      data: [3, 8, 5, 13, 5, 7, 8, 10],
    },
    {
      name: "Cycling",
      data: [5, 7, 10, 7, 9, 5, 4, 6],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
      },
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ["var(--primary)", "#2bc155"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
    },
  },
};

export const flotLineChart = {
  series: [
    {
      name: "High - 2013",
      data: [2, 3, 6, 5, 7, 8, 10],
    },
    {
      name: "Low - 2013",
      data: [1, 2, 5, 3, 5, 6, 9],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      width: 2,
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "line",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["#b2a0d5", "#fed49d"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
  },
};
export const flotLineChart2 = {
  series: [
    {
      name: "High - 2013",
      data: [2, 3, 6, 5, 7, 8, 10],
    },
    {
      name: "Low - 2013",
      data: [1, 2, 5, 3, 5, 6, 9],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "line",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["#b2a0d5", "#fed49d"],

    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
  },
};
export const flotLineChart3 = {
  series: [
    {
      name: "High - 2013",
      data: [10, 7, 8, 9, 6, 5, 7],
    },
    {
      name: "Low - 2013",
      data: [8, 5, 6, 8, 4, 3, 6],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      width: 2,
    },
    // markers: {
    //   size: [4, 4],
    //   strokeWidth: [2, 2],
    //   strokeColors: ["var(--primary)", "#ffb64a"],
    //   border: 2,
    //   radius: 2,
    //   colors: ["#fff", "#fff", "#fff"],
    //   hover: {
    //     size: 10,
    //   },
    // },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "line",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["#b2a0d5", "#fed49d"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
  },
};

export const flotArea1 = {
  series: [
    {
      name: "High - 2013",
      data: [2, 3, 6, 5, 7, 8, 10],
    },
    {
      name: "Low - 2013",
      data: [1, 2, 5, 3, 5, 6, 9],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },

    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["var(--primary)", "#2bc155"],
      opacity: 1,
      type: "solid",
    },

    chart: {
      type: "area",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#2bc155"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
  },
};
export const flotArea2 = {
  series: [
    {
      name: "High - 2013",
      data: [2, 3, 6, 5, 7, 8, 10],
    },
    {
      name: "Low - 2013",
      data: [1, 2, 5, 3, 5, 6, 9],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },

    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["var(--primary)", "#2bc155"],
      opacity: 1,
      type: "solid",
    },

    chart: {
      type: "area",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#2bc155"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
      labels: {
        formatter: (val: number) => {
          return `${val}.0`;
        },
      },
    },
  },
};

export const morris_donught = {
  series: [30, 12, 20],
  chartOption: {
    chart: {
      type: "donut",
      width: 250,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Arial",
              fontWeight: "500",
              offsetY: -17,
              color:'var(--text-dark)'
            },
            total: {
              show: true,
              fontSize: "11px",
              fontWeight: "500",
              fontFamily: "Arial",
              color:'var(--text-dark)',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: string, b: string) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#ff5c00", "#0d99ff", "#ffaa2b"],
    labels: ["In-Store-Salse", "Download Salse", "Mail-Order-Salse"],
    dataLabels: {
      enabled: false,
    },
  },
};

export const morris_line = {
  series: [
    {
      name: "line-chart",
      data: [3, 4, 3, 6, 4, 15, 2],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "line",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        show: false,
      },
    },
    xaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
      show: false,
    },
  },
};

export const morris_bar = {
  series: [
    {
      name: "Net Profit",
      data: [110, 85, 60, 85, 60, 85, 110],
    },
    {
      name: "Revenue",
      data: [100, 75, 50, 75, 50, 75, 100],
    },
    {
      name: "Free Cash Flow",
      data: [70, 50, 40, 50, 40, 50, 50],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#ffaa2b", "#ff9f00"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
    },
    xaxis: {
      categories: ["2006", "", "2008", "", "2010", "", "2006"],
    },
  },
};

export const line_chart_2 = {
  series: [
    {
      name: "High - 2013",
      data: [0, 90, 40, 30, 150, 25, 10],
    },
    {
      name: "mid - 2013",
      data: [0, 60, 80, 47, 40, 80, 10],
    },
    {
      name: "Low - 2013",
      data: [0, 25, 35, 17, 120, 40, 10],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: [4, 4],
      strokeWidth: [2, 2],
      strokeColors: ["#E47379", "#ffb64a"],
      border: 2,
      radius: 2,
      colors: ["var(--primary)", "#00abc5", "var(--primary)"],
      hover: {
        size: 10,
      },
    },
    grid: {
      borderWidth: 2,
      borderColor: "transparent",
    },

    chart: {
      type: "line",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#00abc5", "var(--primary)"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      categories: ["2001", "2002", "2003", "2004", "2005", "2006", "2007"],
    },
  },
};

export const morris_bar_stalked = {
  series: [
    {
      name: "Q1 Budget",
      group: "budget",
      data: [44000, 55000, 41000, 67000, 22000, 43000, 44000, 55000, 41000, 67000, 22000, 43000],
    },

    {
      name: "Q2 Budget",
      group: "budget",
      data: [13000, 36000, 20000, 8000, 13000, 27000, 13000, 36000, 20000, 8000, 13000, 27000],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },

    chart: {
      type: "bar",
      height: 350,
      toolbar: false,
      stacked: true,
    },

    colors: ["var(--primary)", "var(--rgba-primary-1)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#858282",
        size: 10,
      },
    },
    xaxis: {
      categories: ["2006", "", "2008", "", "2010", "", "2006"],
    },
  },
};

export const morris_area = {
  series: [
    {
      name: "High - 2013",
      data: [0, 90, 40, 30, 150, 25, 10],
    },
    {
      name: "mid - 2013",
      data: [0, 60, 80, 47, 40, 80, 10],
    },
    {
      name: "Low - 2013",
      data: [0, 25, 35, 17, 120, 40, 10],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },

    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["#55b2f6", "#25dfad", "#ea8342"],
      opacity: 1,
      type: "solid",
    },

    chart: {
      type: "area",
      height: 219,
      toolbar: {
        show: false,
      },
    },

    colors: ["var(--primary)", "#ffb64a"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      categories: ["2001", "2002", "2003", "2004", "2005", "2006", "2007"],
    },
  },
};

export const barChart_1 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#fff",
        borderWidth: "0",
        colors: "#fff",
        barPercentage: 0.7,
        backgroundColor: "#6673fd",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        show: false,
        //display:0,
        //labelFontColor: '#fff',

        ticks: {
          beginAtZero: true,
          color: "#888",

          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};

export const barChart_2 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#fff",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 250);

          gradient.addColorStop(0, "#6673fd");
          gradient.addColorStop(1, "rgba(102, 115, 253,0.5)");

          return gradient;
        },
        borderWidth: "0",
        colors: "#fff",
        barPercentage: 0.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        show: false,
        ticks: {
          beginAtZero: true,
          color: "#888",

          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const barChart_3 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Blue",
        backgroundColor: "#6673fd",
        hoverBackgroundColor: "#6673fd",
        data: ["12", "12", "12", "12", "12", "12", "12"],
      },
      {
        label: "Green",
        backgroundColor: "#56c7ce",
        hoverBackgroundColor: "#56c7ce",
        data: ["12", "12", "12", "12", "12", "12", "12"],
      },
      {
        label: "Red",
        backgroundColor: "#f35757",
        hoverBackgroundColor: "#f35757",
        data: ["12", "12", "12", "12", "12", "12", "12"],
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        show: false,
        stacked: true,

        ticks: {
          beginAtZero: true,
          color: "#888",

          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here
        stacked: true,
        ticks: {
          fontColor: "#888",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,
          offsetGridLines: true,
        },
      },
    },
  },
};
export const lineChart_1 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],
        borderColor: "#6673fd",
        borderWidth: "2",
        backgroundColor: "transparent",
        tension: 0.5,
        pointBackgroundColor: "#6673fd",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const lineChart_2 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],
        borderColor: "rgba(44, 44, 44, 1)",
        borderWidth: "2",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(500, 0, 100, 0);

          gradient.addColorStop(0, "rgba(44, 44, 44, 1)");
          gradient.addColorStop(1, "rgba(44, 44, 44, 0.5)");

          return gradient;
        },
        tension: 0.5,
        pointBackgroundColor: "rgba(44, 44, 44, 1)",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const lineChart_3 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],
        borderColor: "#b5a3d6",
        borderWidth: "2",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 160);
          gradient.addColorStop(0, "green");
          gradient.addColorStop(0.5, "cyan");
          gradient.addColorStop(1, "green");

          return gradient;
        },
        tension: 0.5,
        pointBackgroundColor: "#b5a3d6",
      },
      {
        label: "My First dataset",
        data: [5, 20, 15, 41, 35, 65, 80],
        borderColor: "rgb(255, 149, 72)",
        borderWidth: "2",
        backgroundColor: "rgba(255, 92, 0, 1)",
        tension: 0.5,
        pointBackgroundColor: "rgb(254, 176, 25)",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const areaChart_1 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],
        borderColor: "rgba(0, 0, 1128, .3)",
        borderWidth: 1,
        tension: 0.5,
        backgroundColor: "rgba(102, 115, 253,0.3)",
        pointBackgroundColor: "rgba(0, 0, 1128, .3)",
        fill: {
          target: true,
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};

export const areaChart_2 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],

        borderColor: "#ff2625",
        borderWidth: "4",
        tension: 0.5,
        backgroundColor: "rgba(255, 62, 62, 0.2)",
        pointBackgroundColor: "rgba(0, 0, 1128, .3)",
        fill: {
          target: true,
          above: "#fde6e6",
          below: "rgb(0, 0, 255)",
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const areaChart_3 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 20, 60, 41, 66, 45, 80],
        borderColor: "rgba(178, 167, 190, .8)",
        borderWidth: 1,
        tension: 0.5,
        backgroundColor: "rgba(178, 167, 190, .8)",
        pointBackgroundColor: "rgba(178, 167, 190, .8)",
        fill: {
          target: true,
        },
      },
      {
        label: "My First dataset",
        data: [5, 25, 20, 41, 36, 75, 70],
        borderColor: "rgba(255, 219, 127, .8)",
        borderWidth: 1,
        backgroundColor: "rgba(255, 219, 127, .8)",
        tension: 0.5,
        pointBackgroundColor: "rgba(255, 219, 127, .8)",
        fill: {
          target: true,
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        show: false,
        borderColor: "#fff",

        ticks: {
          beginAtZero: true,
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
      x: {
        // Change here

        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#fff",
          borderWidth: 0,

          offsetGridLines: true,
        },
      },
    },
  },
};
export const pie_chart = {
  data: {
    defaultFontFamily: "Poppins",
    type: "pie",
    datasets: [
      {
        data: [45, 25, 20, 10],
        borderWidth: 0,
        backgroundColor: ["#ed8d64", "#f1a786", "#f5c0a9", "rgba(0,0,0,0.07)"],
        hoverBackgroundColor: ["#ed8d64", "#f1a786", "#f5c0a9", "rgba(0,0,0,0.07)"],
      },
    ],
    labels: ["one", "two", "three", "four"],
  },
  options: {
    plugins: {
      legend: false,
      responsive: true,
    },

    aspectRatio: 5,
  },
};
export const doughnut_chart = {
  data: {
    defaultFontFamily: "Poppins",
    type: "doughnut",
    datasets: [
      {
        data: [45, 25, 20],
        borderWidth: 1,
        weight: 1,
        borderColor: "rgba(255,255,255,1)",
        backgroundColor: ["rgba(44, 44, 44, 1)", "rgba(98, 126, 234, 1)", "rgba(238, 60, 60, 1)"],
        hoverBackgroundColor: ["rgba(44, 44, 44, 0.9)", "rgba(98, 126, 234, .9)", "rgba(238, 60, 60, .9)"],
      },
    ],
  },
  options: {
    cutout: 1,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,
    },
  },
};
export const polar_chart = {
  data: {
    defaultFontFamily: "Poppins",
    datasets: [
      {
        data: [15, 18, 9, 6, 19],
        borderWidth: 0,
        backgroundColor: ["rgba(44, 44, 44, 1)", "rgba(98, 126, 234, 1)", "rgba(238, 60, 60, 1)", "rgba(54, 147, 255, 1)", "rgba(255, 92, 0, 1)"],
      },
    ],
  },
  options: {
    responsive: true,
    aspectRatio: 2,
    //maintainAspectRatio: false
  },
};
export const radar_chart = {
  type: "radar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 66, 45, 56, 55, 40],
        borderColor: "#ffff",
        borderWidth: "0",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(500, 0, 100, 0);

          gradient.addColorStop(0, "rgba(68, 0, 235, .5)");
          gradient.addColorStop(1, "rgba(68, 236, 245, .5)");

          return gradient;
        },
      },
      {
        label: "My Second dataset",
        data: [28, 12, 40, 19, 63, 27, 87],
        borderColor: "#ffff",
        borderWidth: "0",
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(500, 0, 100, 0);

          gradient.addColorStop(0, "rgba(54, 185, 216, .5)");
          gradient.addColorStop(1, "rgba(75, 255, 162, .5)");

          return gradient;
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  },
};
export const widgetChart1 = {
  type: "bar",

  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(255, 255, 255, .8)",
        borderWidth: "0",
        barPercentage: 0.5,
        backgroundColor: "rgba(255, 255, 255, .8)",
        hoverBackgroundColor: "rgba(255, 255, 255, .8)",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          display: false,
          max: 100,
          min: 0,
          stepSize: 10,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: false,
        barPercentage: 0.5,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
};
export const chart_widget_2 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40, 88, 45, 95, 54, 76],
        barPercentage:1,
        backgroundColor: "#6f74f7",
        hoverBackgroundColor: "#6f74f7",
      },
    ],
  },
  // data: {
  // 				defaultFontFamily: 'Poppins',
  // 				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  // 				datasets: [
  // 					{
  // 						label: "My First dataset",
  // 						data: [65, 59, 80, 81, 56, 55, 40, 88, 45, 95, 54, 76],
  // 						borderColor: chart_widget_2gradientStroke,
  // 						borderWidth: "0",
  // 						backgroundColor: chart_widget_2gradientStroke,
  // 						hoverBackgroundColor: chart_widget_2gradientStroke
  // 					}
  // 				]
  // 			},
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          display: false,
          max: 100,
          min: 0,
          stepSize: 10,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: false,
        barPercentage: 0.5,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
};
export const chart_widget_7 = {
  type: "bar",

  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40, 88, 45, 95, 54, 76],
        borderColor: "#ff2c53",
        borderWidth: "0",
        barPercentage: 0.8,
        backgroundColor: "#ff2c53",
        hoverBackgroundColor: "#ff2c53",
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          display: false,
          max: 100,
          min: 0,
          stepSize: 10,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: false,
        barPercentage: 0.5,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
};
export const chart_widget_3 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Expense",
        backgroundColor: "#ff2c53",
        hoverBackgroundColor: "#ff5777",
        barPercentage: 0.8,
        data: ["20", "14", "18", "25", "27", "22", "12", "24", "20", "14", "18", "16"],
      },
      {
        label: "Earning",
        backgroundColor: "#F1F3F7",
        hoverBackgroundColor: "#F1F3F7",
        barPercentage: 0.8,
        data: ["12", "18", "14", "7", "5", "10", "20", "8", "12", "18", "14", "16"],
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    title: {
      display: false,
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        stacked: true,
        ticks: {
          beginAtZero: true,
          display: false,
          max: 100,
          min: 0,
          stepSize: 10,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: false,
        stacked: true,
        barPercentage: 0.5,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
};
export const chart_widget_4 = {
  type: "bar",
  data: {
    defaultFontFamily: "Poppins",
    labels: [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "forteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
    ],
    datasets: [
      {
        label: "Expense",
        backgroundColor: "#600022",
        barPercentage: 0.8,
        hoverBackgroundColor: "#600022",
        data: [20, 14, 18, 25, 27, 22, 12, 24, 20, 14, 18, 16, 34, 32, 43, 36, 56, 12, 23, 34],
      },
      {
        label: "Earning",
        backgroundColor: "#F1F3F7",
        barPercentage: 0.8,
        hoverBackgroundColor: "#F1F3F7",
        data: [32, 58, 34, 37, 15, 41, 24, 38, 52, 38, 24, 19, 54, 34, 23, 34, 35, 22, 43, 33],
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    title: {
      display: false,
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        stacked: true,
        ticks: {
          beginAtZero: true,
          display: false,
          max: 100,
          min: 0,
          stepSize: 10,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
      x: {
        display: false,
        stacked: true,
        barPercentage: 0.5,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
};
export const chart_widget_5 = {
  series: [
    {
      name: "High - 2013",
      data: [4, 5, 1.5, 6, 7, 5.5, 5.8, 4.6],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },

    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["#20DEA6"],
      opacity: 1,
      type: "solid",
    },

    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      offsetY: 27,
    },

    colors: ["#20DEA6"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      show: false,
      labels: {
        show: false,
      },
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      show: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
      font: {
        color: "#999",
        size: 8,
      },
    },
  },
};
export const chart_widget_6 = {
  series: [
    {
      name: "High - 2013",
      data: [4, 5, 3.5, 5, 4, 5.5, 3.8, 4.6],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    fill: {
      colors: ["#6f73f6"],
      opacity: 1,
      type: "solid",
    },
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      offsetY: 27,
    },

    colors: ["#6f73f6"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      tickColor: "transparent",
      show: false,
      labels: {
        show: false,
      },
      font: {
        color: "#999",
        size: 8,
      },
    },
    xaxis: {
      tickColor: "transparent",
      show: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
      font: {
        color: "#999",
        size: 8,
      },
    },
  },
};
export const chart_widget_9 = {
  type: "line",
  data: {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "January",
      "February",
      "March",
      "April",
    ],
    datasets: [
      {
        label: "Sales Stats",
        backgroundColor: "#2780d4",
        borderColor: "#2780d4",
        pointBackgroundColor: "#2780d4",
        pointBorderColor: "#2780d4",
        pointHoverBackgroundColor: "#2780d4",
        pointHoverBorderColor: "#2780d4",
        data: [20, 10, 18, 15, 32, 18, 15, 22, 8, 6, 12, 13, 10, 18, 14, 24, 16, 12, 19, 21, 16, 14, 24, 21, 13, 15, 27, 29, 21, 11, 14, 19, 21, 17],
        fill: true,
      },
    ],
  },
  options: {
    title: {
      display: !1,
    },
    tooltips: {
      intersect: !1,
      mode: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
    plugins: {
      legend: false,
    },
    responsive: !0,
    maintainAspectRatio: !1,
    hover: {
      mode: "index",
    },
    scales: {
      x: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Month",
        },
      },
      y: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Value",
        },
        ticks: {
          beginAtZero: !0,
        },
      },
    },
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        radius: 2,
        borderWidth: 1,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 0,
      },
    },
  },
};
export const chart_widget_10 = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Sales Stats",
        backgroundColor: "#2780d4",
        borderColor: "#2780d4",
        pointBackgroundColor: "#2780d4",
        pointBorderColor: "#2780d4",
        pointHoverBackgroundColor: "#2780d4",
        pointHoverBorderColor: "#2780d4",
        //borderWidth: 0,
        fill: true,
        data: [20, 10, 18, 10, 32, 15, 15, 22, 18, 6, 12, 13],
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    title: {
      display: !1,
    },
    tooltips: {
      intersect: !1,
      mode: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
    responsive: !0,
    maintainAspectRatio: !1,
    hover: {
      mode: "index",
    },
    scales: {
      x: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Month",
        },
      },
      y: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Value",
        },
        ticks: {
          beginAtZero: !0,
        },
      },
    },
    elements: {
      line: {
        tension: 0.7,
      },
      point: {
        radius: 0,
        borderWidth: 0,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 0,
      },
    },
  },
};
export const chart_widget_11 = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales Stats",
        backgroundColor: "#fd9ebc",
        borderColor: "#fb3e7a",
        // pointBackgroundColor: "#4cbc9a",
        // pointBorderColor: "#4cbc9a",
        pointHoverBackgroundColor: "#fb3e7a",
        pointHoverBorderColor: "#fb3e7a",
        data: [0, 18, 14, 24, 16, 30],
        fill: true,
      },
    ],
  },
  options: {
    title: {
      display: !1,
    },
    tooltips: {
      intersect: !1,
      mode: "nearest",
      xPadding: 5,
      yPadding: 5,
      caretPadding: 5,
    },
    plugins: {
      legend: false,
    },
    responsive: !0,
    maintainAspectRatio: !1,
    hover: {
      mode: "index",
    },
    scales: {
      x: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Month",
        },
        ticks: {
          max: 30,
          min: 0,
        },
      },
      y: {
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: "Value",
        },
        ticks: {
          beginAtZero: !0,
        },
      },
    },
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        radius: 2,
        borderWidth: 1,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
};
export const chart_widget_14 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [55, 30, 90, 41, 86, 45, 80],
        borderColor: "#3693FF",
        borderWidth: "2",
        backgroundColor: "transparent",
        pointBackgroundColor: "#3693FF",
        pointRadius: 0,
        tension: 0.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 20,
          padding: 0,
          display: false,
        },
        gridLines: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        display: false,
        ticks: {
          padding: 0,
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    },
  },
};
export const chart_widget_15 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 60, 30, 71, 26, 85, 50],
        borderColor: "#2780d4",
        borderWidth: "2",
        backgroundColor: "transparent",
        pointBackgroundColor: "#2780d4",
        pointRadius: 0,
        tension: 0.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 20,
          padding: 0,
          display: false,
        },
        gridLines: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        display: false,
        ticks: {
          padding: 0,
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    },
  },
};
export const chart_widget_16 = {
  type: "line",
  data: {
    defaultFontFamily: "Poppins",
    labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        data: [25, 60, 30, 71, 26, 85, 50],
        borderColor: "#6e73f7",
        borderWidth: "2",
        backgroundColor: "#6e73f7",
        pointBackgroundColor: "#6e73f7",
        pointRadius: 0,
        fill: true,
        tension: 0.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      intersect: !1,
      mode: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
    scales: {
      y: {
        display: false,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 20,
          padding: 0,
          display: false,
        },
        gridLines: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        display: false,
        ticks: {
          padding: 0,
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    },
  },
};

export const chart_widget_8 = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
  series: [
    {
      data: [4, 5, 1.5, 6, 7, 5.5, 5.8, 4.6],
    },
  ],
  chartOptions: {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    stroke: {
      width: 2,
    },
    grid: {
      borderWidth: 1,
      borderColor: "transparent",
    },
    markers: {
      size: [2, 2],
      strokeWidth: [2, 2],
      strokeColors: ["var(--primary)", "#ffb64a"],
      border: 2,
      radius: 2,
      hover: {
        size: 2,
      },
    },
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    offsetY: -100,
    colors: ["#600022"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  },
};

export const salesBarChart = {
  series: [
    {
      name: "Week",
      data: [50, 90, 90, 50],
      //radius: 12,
    },
    {
      name: "Week",
      data: [80, 40, 55, 40],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 120,

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        endingShape: "rounded",
        borderRadius: 8,
      },
    },
    states: {
      hover: {
        filter: "none",
      },
    },
    colors: ["var(--primary)", "var(--primary)"],
    dataLabels: {
      enabled: false,
      offsetY: -30,
    },

    legend: {
      show: false,
      fontSize: "12px",
      labels: {
        colors: "#000000",
      },
      markers: {
        width: 15,
        height: 18,
        strokeWidth: 5,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 12,
      },
    },
    stroke: {
      show: true,
      width: 7,
      curve: "smooth",
      lineCap: "round",
      colors: ["transparent"],
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ["JAN", "FEB", "MAR", "APR", "MAY"],
      labels: {
        show: false,
        style: {
          colors: "#A5AAB4",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "poppins",
          cssClass: "apexcharts-xaxis-label",
        },
      },
      crosshairs: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
        offsetX: -16,
        style: {
          colors: "#000000",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
  },
};

export const activityChart = {
  series: [
    {
      name: "New Clients",
      data: [180, 150, 200, 100, 150, 180, 150, 170, 115, 190, 140, 80, 70, 90, 120, 50, 90, 100, 200, 300, 180, 200, 150],
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 230,
      stacked: true,
      toolbar: {
        show: false,
      },
      sparkline: {
        //enabled: true
      },
      offsetX: 0,
    },
    plotOptions: {
      bar: {
        columnWidth: "25%",
        endingShape: "rounded",
        startingShape: "rounded",
        borderRadius: 5,
        colors: {
          backgroundBarColors: ["#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8", "#F8F8F8"],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 5,
        },
      },
      distributed: true,
    },
    colors: ["var(--primary)"],
    grid: {
      show: false,
      borderColor: "#F8F8F8",
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
      colors: ["#000"],
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 1,
      },
    },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "M", "T", "W", "T", "F", "S", "M", "T", "W"],
      labels: {
        style: {
          colors: "#787878",
          fontSize: "13px",
          fontFamily: "poppins",
          fontWeight: 100,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      crosshairs: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },

    tooltip: {
      x: {
        show: true,
      },
    },
  },
};

export const salesNewCustomers = {
  series: [
    {
      name: "Month",
      data: [100, 300, 200, 250, 200, 240, 180, 230, 200, 250, 300],
      /* radius: 30,	 */
    },
  ],
  chartOptions: {
    chart: {
      type: "area",
      height: 100,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--primary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 3,
      curve: "smooth",
      colors: ["var(--primary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: -1,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    xaxis: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "August", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 0.9,
      colors: "var(--primary)",
      type: "gradient",
      gradient: {
        colorStops: [
          {
            offset: 0,
            color: "var(--primary)",
            opacity: 0.8,
          },
          {
            offset: 0.6,
            color: "var(--primary)",
            opacity: 0.6,
          },
          {
            offset: 100,
            color: "white",
            opacity: 0,
          },
        ],
      },
    },
    tooltip: {
      enabled: false,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
export const salesActive = {
  series: [
    {
      name: "Net Profit",
      data: [100, 400, 200, 250, 200, 150, 180, 230, 200, 250, 300],
      /* radius: 30,	 */
    },
  ],
  chartOptions: {
    chart: {
      type: "area",
      height: 100,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },

    colors: ["var(--secondary)"],
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 3,
      curve: "smooth",
      colors: ["var(--secondary)"],
    },

    grid: {
      show: false,
      borderColor: "#eee",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: -1,
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    xaxis: {
      categories: ["Jan", "feb", "Mar", "Apr", "May", "June", "July", "August", "Sept", "Oct"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 0.9,
      colors: "var(--secondary)",
      type: "gradient",
      gradient: {
        colorStops: [
          {
            offset: 0,
            color: "var(--secondary)",
            opacity: 0.8,
          },
          {
            offset: 0.6,
            color: "var(--secondary)",
            opacity: 0.6,
          },
          {
            offset: 100,
            color: "white",
            opacity: 0,
          },
        ],
      },
    },
    tooltip: {
      enabled: false,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val: any) {
          return "$" + val + " thousands";
        },
      },
    },
  },
};
