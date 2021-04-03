function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSamplesResult = samplesArray[0];
    console.log(firstSamplesResult);
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var bigList = []
    for (index in firstSamplesResult.otu_ids) {
      bigList.push({
        id: firstSamplesResult.otu_ids[index],
        label: firstSamplesResult.otu_labels[index],
        sample_value: firstSamplesResult.sample_values[index],
      });
    }

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var sorted_otu_ids = bigList.sort((a,b) => (b.sample_value - a.sample_value));
    var top10_otu_ids = sorted_otu_ids.slice(0,10);

    // 8. Create the trace for the bar chart.
    var trace = {
      x: top10_otu_ids.map((otu) => otu.sample_value).reverse(),
      y: top10_otu_ids.map((otu) => "OTU " + otu.id).reverse(),
      type: 'bar',
      orientation: 'h',
      text: top10_otu_ids.map((otu) => otu.label)
    };
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2 - Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: bigList.map((otu) => otu.id),
      y: bigList.map((otu) => otu.sample_value),
      text: bigList.map((otu) => otu.label),
      mode: 'markers',
      marker: {
        size: bigList.map((otu) => otu.sample_value),
        color: bigList.map((otu) => otu.id)}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      //margin: plotly.graph_objects.layout.Margin(autoexpand=True, b=[0,inf], l=[0,inf], pad=None, r=[0,inf], t=[0,inf]),
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3 - Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstSampleMetadata = filteredMetadata[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = firstSampleMetadata.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: { text: "Belly Button Washing Frequency <br /> Scrubs Per Week" },
      gauge: {
       axis: { range: [null, 10], tickwidth: 1, tickcolor: "black", nticks: 10 },
       bar: { color: "black" },
       steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow"},
        { range: [6, 8], color: "lightgreen"},
        { range: [8, 10], color: "darkgreen"}
      ],
    }}];
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      font: { color: "black", family: "Arial" },
      
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  })};
