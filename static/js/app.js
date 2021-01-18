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
    // Use the first sample from the list to build the initial plots
  });
}

/*
   Hints: Create additional functions to build the charts,
          build the gauge chart, set up the metadata,
          and handle the event listeners

   Recommended function names:
    buildGauge()
    buildMetadata()
*/
function optionChanged(){
  buildChart();
};
//Function to build bar chart
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
    title: 'Each Sample',
    showlegend: true,
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);
};
// Initialize the dashboard
init();