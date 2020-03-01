function buildCharts(sample) {
  // Make an API call to gather all data and then reduce to matching the sample selected
  //TODO:
  d3.json('samples.json').then((data)=> {

    var allSamples = data.samples
    var index;
    for(var i = 0;i<allSamples.length;i++){
      if (allSamples[i].id === sample){
        index = i
        break;
      }
    }
    var selSample = data.samples[index];
   
    var sampleValues = [];

    // we created an array of objects with the individual data since it will be easier to organize and aggregate the data.
    for(var i = 0; i<selSample.sample_values.length;i++){
      sampleValues.push({"sample_values": selSample.sample_values[i],"otu_ids": selSample.otu_ids[i], 'otu_labels': selSample.otu_labels[i] })
    };
    var top10_OTUs = sampleValues.sort((a,b)=> b.sample_values - a.sample_values);
    // console.log(top10_OTUs);
    top10_OTUs = top10_OTUs.slice(0,10);
    // console.log(top10_OTUs);
    top10_OTUs = top10_OTUs.reverse();
    // console.log(top10_OTUs);

    var samValues = top10_OTUs.map(data => data.sample_values);
    var OTU_IDs = top10_OTUs.map(data => `OTU ${data.otu_ids}`);
    var OTU_Labels = top10_OTUs.map(data => data.otu_labels);
    
    var trace1 = {
      x: samValues,
      y: OTU_IDs,
      text: OTU_Labels,
      type: "bar",
      orientation: "h"
    };

    allOTU_IDs = sampleValues.map(data => data.otu_ids);
    allsamValues = sampleValues.map(data => data.sample_values);
    allOTU_Labels = sampleValues.map(data => data.otu_labels);

    var trace2 = {
      x: allOTU_IDs,
      y: allsamValues,
      text: allOTU_Labels,
      // name: "",
      mode: "markers",
      marker: {
        color: sampleValues.map(data => data.otu_ids * 50),
        size: sampleValues.map(data => data.sample_values)
      }
    };

    // data
    var data = [trace1];
    var data2 = [trace2];
    
    // Apply the group bar mode to the layout
    var layout = {
      title: "Top 10 OTUs:",
    };
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);
    Plotly.newPlot("bubble", data2);

 })

};

function buildMetadata(sample) {
  // Make an API call to gather all data and then reduce to matching the sample selected
  //TODO: 
  
  d3.json('samples.json').then((data)=> {

    var data = data.metadata
    var index;
    for (var i = 0;i<data.length;i++){
      if (data[i].id === parseInt(sample)){
        index = i;
        break;
      }
    }
    
    var selSample = data[index];

    var panelData = d3.select('#sample-metadata');
    panelData.html("");
    for(var i in selSample){
      panelData.append('p').text(`${i}:${selSample[i]}`)
    }
  });
};


function init() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      //TODO: 

      sampleNames.forEach(element => {
        var dropdownSel = selector.append('option').text(element);
        dropdownSel.value = element;
        });
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();