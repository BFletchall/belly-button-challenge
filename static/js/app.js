// Source url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Promise
const dataPromise = d3.json(url);

// fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
}); 

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Initialize the page with default
function init() {
    //access data
    d3.json(url).then((data) => {
        //set variable for sample names
        let sampleIds = data.names;

        // Populate the dropdown menu with sample IDs
        let dropdownMenu = d3.select("#selDataset");
        console.log(sampleIds);
        sampleIds.forEach(sampleId => {
            dropdownMenu.append("option").text(sampleId).attr("value", sampleId);
        });

         // default sample for initial display
         let defaultSample = sampleIds[0]; 
         console.log(defaultSample);

         // Create initial horizontal bar chart and bubble chart
        createBar(defaultSample, data);
        createBubble(defaultSample, data);
        createMetadata(defaultSample, data);
      
     });    
    
};

// Function to create sample metadata display
function createMetadata(sampleId, data) {
    // Find the sample metadata for the selected sampleId
    let sampleMetadata = data.metadata.find(metadata => metadata.id === parseInt(sampleId));
    // Display metadata
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear existing metadata

    Object.entries(sampleMetadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to create the horizontal bar chart
function createBar(sampleId, data) {
    // Find the sample data for the selected sampleId
    let sample = data.samples.find(sample => sample.id === sampleId);

    // Extract top 10
    let sampleValues = sample.sample_values.slice(0, 10).reverse();
    let otuIds = sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otuLabels = sample.otu_labels.slice(0, 10).reverse();
    console.log(sampleValues)

    // Create trace for bar chart
    let trace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    // Create layout for bar chart
    let layout = {
        title: "Top 10 OTUs Found in Individual",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", [trace], layout);
}

// Function to create the bubble chart
function createBubble(sampleId, data) {
    // Find the sample data for the selected sampleId
    let sample = data.samples.find(sample => sample.id === sampleId);

    // Create trace for bubble chart
    let trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    };

    // Create layout for bubble chart
    let layout = {
        title: "OTU Frequency",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", [trace], layout);
}


// Event listener for dropdown change
function optionChanged(selectedSampleId) {
    // Re-create the charts with the newly selected sample ID
    d3.json(url).then(function(data) {
        createBar(selectedSampleId, data);
        createBubble(selectedSampleId, data);
    });
}


// Initialize the dashboard
init();