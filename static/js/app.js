var sampleData = {}
// Grab a reference to the dropdown select element
var dropDown = d3.select('#selDataset');
//Event Listener
dropDown.on('change', optionChanged)

function init() {
  // Grab a reference to the dropdown select element
  // Use the list of sample names to populate the select options
  d3.json("/samples").then((data) => {
    sampleData = data;
    // your-code-here
    sampleData.names.forEach(name => {
      d3.select('#selDataset').append('option').attr('value', name).text(name);
    })
    buildChart();
    buildGauge();
    buildMetadata();
    // Use the first sample from the list to build the initial plots
  });
};
function optionChanged(){
  buildChart();
  buildGauge();
  buildMetadata();
};
//Function to build charts
function buildChart(){
  //find sample by id
  var subjectID = d3.select('#selDataset').node().value;
  let targetSample = sampleData.samples.find(sample => sample.id == subjectID);
  //get top 10
  var top10otuIds = targetSample.otu_ids.slice(0, 10).map(item => 'otu' + item);
  var top10Samples = targetSample.sample_values.slice(0, 10);
  //console.log(top10Samples);
  //Plotly Bar Chart structure
  var trace1 = {
    type: 'bar',
    x: top10Samples,
    y: top10otuIds,
    orientation: 'h',
    transforms: [{
      type: 'sort',
      target: 'y',
      order: 'descending'
    }]    
  };
  var layout = {
    title: 'Top 10 OTUs found Individual',
    barmode: 'stack'
  };
  var barChartData = [
    trace1
  ];
  
  Plotly.newPlot('bar', barChartData, layout);

  //Bubble Chart
  var trace1 = {
    x: targetSample.otu_ids,
    y: targetSample.sample_values,
    text: targetSample.otu_labels,
    mode: 'markers',
    marker: {
      color: targetSample.otu_ids,
      //opacity: [1, 0.8, 0.6, 0.4],
      size: targetSample.sample_values
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'OTU Sample',
    showlegend: true,
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);
};
//Build Metadata
function buildMetadata(){
    //find sample by id
    var subjectID = d3.select('#selDataset').node().value;
    let targetSample = sampleData.metadata.find(subject => subject.id == subjectID);
    var sampleMetadata = d3.select('#sample-metadata');
    sampleMetadata.html('');
    var table = sampleMetadata.append('table');
    table.attr('class', 'table table-striped')
    Object.entries(targetSample).forEach(([key, value]) => {
      var row = table.append('tr');
      var cell = row.append('td');
      cell.text(`${key}:`);
      var cell = row.append('td');
      cell.text(value);
    })
  //console.log(targetSample);
}
//Gauge Chart
function buildGauge(){
  var subjectID = d3.select('#selDataset').node().value;
  let targetSample = sampleData.metadata.find(subject => subject.id == subjectID);
  var gauge = d3.select('#gauge');
  var washFreq = targetSample.wfreq;
  console.log(washFreq);
  //gaauge
  var trace1 =
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "Belly Button Washing Fequency" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 5 },
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 1], color: "rgb(245, 249, 250)" },
          { range: [1, 2], color: "rgb(225, 233, 235)" },
          { range: [2, 3], color: "rgb(202, 216, 219)" },
          { range: [3, 4], color: "rgb(184, 207, 212)" },
          { range: [4, 5], color: "rgb(174, 203, 209)" },
          { range: [5, 6], color: "rgb(163, 203, 212)" },
          { range: [6, 7], color: "rgb(154, 207, 219)" },
          { range: [7, 8], color: "rgb(154, 214, 227)" },
          { range: [8, 9], color: "rgb(146, 217, 232)" },
          { range: [9, 10], color: "rgb(142, 227, 245)" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 10
        }
      }
    };
    var data = [
      trace1
    ]
  
  var layout = { width: 475, height: 350, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}
// Initialize the dashboard
init();