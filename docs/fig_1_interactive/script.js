const xRange = 20;
function S(x, gamma, kappa) {
  return Math.sinh(kappa * (Math.asinh(x) - gamma));
}

function C(x, gamma, kappa) {
  return (1 + S(x, gamma, kappa) ** 2) ** 0.5;
}

function sinhArcSinhPDF(x, mu, sigma, gamma, kappa) {
  x = (x - mu) / sigma;
  return (
    (1 / sigma) *
    (1 / Math.sqrt(2 * Math.PI)) *
    ((kappa * C(x, gamma, kappa)) / Math.sqrt(1 + x ** 2)) *
    Math.exp(-0.5 * S(x, gamma, kappa) ** 2)
  );
}

function sinhArcSinhCDF(x, mu, sigma, gamma, kappa) {
  return normalCDF(
    Math.sinh(kappa * Math.asinh((x - mu) / sigma) - gamma),
    0,
    1
  );
}

function generatePDF(mean, std, skew, kurt) {
  const x = [];
  const y = [];

  for (let i = -1 * xRange; i <= xRange; i += 0.1) {
    const val = i / 2;
    const probDensity = sinhArcSinhPDF(val, mean, std, skew, kurt);
    x.push(val);
    y.push(probDensity);
  }

  return { x, y };
}

function generateGaussPDF() {
  const x = [];
  const y = [];

  for (let i = -1 * xRange; i <= xRange; i += 0.1) {
    const val = i / 2;
    const gaussPDF = normalPDF(val, 0, 1);
    x.push(val);
    y.push(gaussPDF);
  }

  return { x, y };
}

function generateCDF(mean, std, skew, kurt) {
  const x = [];
  const y = [];

  for (let i = -1 * xRange; i <= xRange; i += 0.1) {
    const val = i / 2;
    const cumDensity = sinhArcSinhCDF(val, mean, std, skew, kurt);
    const cumDensityNorm = normalCDF(val, 0, 1);
    x.push(cumDensity);
    y.push(cumDensityNorm);
  }

  return { x, y };
}

function updatePlot(mean, std, skew, kurt) {
  const pdfData = generatePDF(mean, std, skew, kurt);
  const gaussianData = generateGaussPDF();
  const gaussianTrace = {
    x: gaussianData.x,
    y: gaussianData.y,
    type: "scatter",
    mode: "lines",
    line: { color: "#1f77b4" },
    name: "$f$",
    hoverinfo: "skip",
    xaxis: "x1",
    yaxis: "y1",
  };
  const pdfTrace = {
    x: pdfData.x,
    y: pdfData.y,
    type: "scatter",
    mode: "lines",
    line: { color: "#ff7f0e" },
    name: "$\\hat{f}$",

    hoverinfo: "skip",
    xaxis: "x1",
    yaxis: "y1",
  };

  const cdfData = generateCDF(mean, std, skew, kurt);
  const cdfTrace = {
    x: cdfData.x,
    y: cdfData.y,
    type: "scatter",
    mode: "lines",
    line: { color: "#ff7f0e", width: 3 },
    hoverinfo: "skip",
    xaxis: "x2",
    yaxis: "y2",
    showlegend: false,
  };
  const identityTrace = {
    x: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    y: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    type: "scatter",
    mode: "lines",
    line: { color: "black", dash: "dash" },
    hoverinfo: "skip",
    xaxis: "x2",
    yaxis: "y2",
    showlegend: false,
  };

  var layout = {
    grid: { rows: 1, columns: 2, pattern: "independent" },
    height: 500,
    annotations: [
      {
        text: "$\\mathrm{Conditional\\ Density}$",
        x: -1,
        y: 1.05,
        xanchor: "center",
        yanchor: "bottom",
        xref: "x1",
        yref: "paper",
        showarrow: false,
        font: { size: 30 },
      },
      {
        text: "$\\mathrm{Local\\ Diagnostic\\ Plot}$",
        x: 0.5,
        y: 1.05,
        xanchor: "center",
        yanchor: "bottom",
        xref: "x2",
        yref: "paper",
        showarrow: false,
        font: { size: 30 },
      },
    ],
    xaxis1: {
      title: { text: "$\\mathbf{x}$", standoff: 10 },
      domain: [0, 0.45],
      titlefont: {
        size: 25,
      },
      tickfont: {
        size: 15,
      },
    },
    yaxis1: {
      title: "$f(\\theta|\\mathbf{x}) \\mathrm{\\ or \\ } f(y|\\mathbf{x}))$",
      domain: [0.1, 1],
      anchor: "x1",
      titlefont: {
        size: 20,
      },
      tickfont: {
        size: 15,
      },
    },
    xaxis2: {
      title: { text: "$\\gamma$", standoff: 10 },
      domain: [0.55, 1],
      titlefont: {
        size: 25,
      },
      tickfont: {
        size: 15,
      },
    },
    yaxis2: {
      title: "$\\hat{r}(\\gamma;\\mathbf{x})$",
      domain: [0.1, 1],
      anchor: "x2",
      titlefont: {
        size: 20,
      },
      tickfont: {
        size: 15,
      },

      scaleanchor: "x2",
      scaleratio: 1,
    },
    legend: {
      x: 0.4,
      xanchor: "right",
      y: 0.95,
      font: { size: 30 },
      bgcolor: "rgba(0,0,0,0)",
    },
  };

  Plotly.newPlot(
    "plots-container",
    [pdfTrace, gaussianTrace, cdfTrace, identityTrace],
    layout
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const meanSlider = document.getElementById("mean");
  const stdSlider = document.getElementById("std");
  const skewSlider = document.getElementById("skew");
  const kurtSlider = document.getElementById("kurt");

  const meanValue = document.getElementById("mean-value");
  const stdValue = document.getElementById("std-value");
  const skewValue = document.getElementById("skew-value");
  const kurtValue = document.getElementById("kurt-value");

  meanSlider.addEventListener("input", () => {
    meanValue.textContent = meanSlider.value;
    updatePlot(
      parseFloat(meanSlider.value),
      parseFloat(stdSlider.value),
      parseFloat(skewSlider.value),
      parseFloat(kurtSlider.value)
    );
  });

  stdSlider.addEventListener("input", () => {
    stdValue.textContent = stdSlider.value;
    updatePlot(
      parseFloat(meanSlider.value),
      parseFloat(stdSlider.value),
      parseFloat(skewSlider.value),
      parseFloat(kurtSlider.value)
    );
  });

  skewSlider.addEventListener("input", () => {
    skewValue.textContent = skewSlider.value;
    updatePlot(
      parseFloat(meanSlider.value),
      parseFloat(stdSlider.value),
      parseFloat(skewSlider.value),
      parseFloat(kurtSlider.value)
    );
  });

  kurtSlider.addEventListener("input", () => {
    kurtValue.textContent = kurtSlider.value;
    updatePlot(
      parseFloat(meanSlider.value),
      parseFloat(stdSlider.value),
      parseFloat(skewSlider.value),
      parseFloat(kurtSlider.value)
    );
  });
  // Add event listener for the reset button
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => {
    meanSlider.value = 0;
    stdSlider.value = 1;
    skewSlider.value = 0;
    kurtSlider.value = 1;

    meanValue.textContent = meanSlider.value;
    stdValue.textContent = stdSlider.value;
    skewValue.textContent = skewSlider.value;
    kurtValue.textContent = kurtSlider.value;

    updatePlot(
      parseFloat(meanSlider.value),
      parseFloat(stdSlider.value),
      parseFloat(skewSlider.value),
      parseFloat(kurtSlider.value)
    );
  });

  // Initial plot
  updatePlot(
    parseFloat(meanSlider.value),
    parseFloat(stdSlider.value),
    parseFloat(skewSlider.value),
    parseFloat(kurtSlider.value)
  );
});
