function loadDashboard(mode) {
  Papa.parse("merged_sorted_with_timestamp.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      if (mode === "station") initStationDashboard(data);
      if (mode === "parameter") initParameterDashboard(data);
    }
  });
}

function initStationDashboard(data) {
  const stationSelect = document.getElementById("stationSelect");
  const plotsDiv = document.getElementById("plots");
  const stations = [...new Set(data.map(d => d.station_name))];
  stationSelect.innerHTML = stations.map(s => `<option>${s}</option>`).join("");

  stationSelect.addEventListener("change", () => renderStationPlots(data, stationSelect.value));
  renderStationPlots(data, stations[0]); // default
}

function renderStationPlots(data, station) {
  const plotsDiv = document.getElementById("plots");
  plotsDiv.innerHTML = "";
  const stationData = data.filter(d => d.station_name === station);

  const params = Object.keys(stationData[0]).filter(k => !["date","time","station_id","station_name","timestamp"].includes(k));
  params.forEach(param => {
    const trace = {
      x: stationData.map(d => d.timestamp || `${d.date} ${d.time}`),
      y: stationData.map(d => parseFloat(d[param]) || null),
      type: "scatter",
      mode: "lines+markers",
      name: param
    };


    
    const layout = {
      title: `${param} at ${station}`,
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      font: {color: "#1e293b"},
      margin: {t: 50, l: 50, r: 30, b: 50}
    };
    const div = document.createElement("div");
    plotsDiv.appendChild(div);
    Plotly.newPlot(div, [trace], layout, {responsive: true});
  });
}

function initParameterDashboard(data) {
  const paramSelect = document.getElementById("paramSelect");
  const plotsDiv = document.getElementById("plots");
  const params = Object.keys(data[0]).filter(k => !["date","time","station_id","station_name","timestamp"].includes(k));
  paramSelect.innerHTML = params.map(p => `<option>${p}</option>`).join("");

  paramSelect.addEventListener("change", () => renderParamPlots(data, paramSelect.value));
  renderParamPlots(data, params[0]); // default
}

function renderParamPlots(data, param) {
  const plotsDiv = document.getElementById("plots");
  plotsDiv.innerHTML = "";
  const stations = [...new Set(data.map(d => d.station_name))];

  stations.forEach(station => {
    const stationData = data.filter(d => d.station_name === station);
    const trace = {
      x: stationData.map(d => d.timestamp || `${d.date} ${d.time}`),
      y: stationData.map(d => parseFloat(d[param]) || null),
      type: "scatter",
      mode: "lines+markers",
      name: station
    };
    
    const layout = {
      title: `${param} at ${station}`,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {color: "white"}
    };
    const div = document.createElement("div");
    plotsDiv.appendChild(div);
    Plotly.newPlot(div, [trace], layout, {responsive: true});
  });
}
